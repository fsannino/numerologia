import type { LocalizedText, Result } from '@numerus/shared-kernel'
import { err, ok } from '@numerus/shared-kernel'
import { ENGINE_VERSION } from '../../engine-version'
import type { NumberKind, SubjectKind } from '../../model-ids'
import type { Subject } from '../../entities/person-subject'
import type { LocalDate } from '../../value-objects/local-date'
import { reduceToValue } from '../../value-objects/numerology-value'
import type {
  CalculationStep,
  CalculationTrace,
  DigitTallyEntry,
  LoShuArrow,
} from '../../trace/calculation-trace'
import type { CalculationError, CalculationRequest, NumerologyModel } from '../../ports/numerology-model'
import { text } from '../../trace/step-builders'
import { LO_SHU_RULES } from './lo-shu-rules'

const SUPPORTED_SUBJECTS: ReadonlySet<SubjectKind> = new Set(['person'])
const SUPPORTED_NUMBERS: ReadonlySet<NumberKind> = new Set(['lo-shu-grid'])
const GRID_DIGITS: ReadonlyArray<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9]

/** As 8 linhas do quadrado (3 linhas, 3 colunas, 2 diagonais), por número. */
const LO_SHU_LINES: ReadonlyArray<{ readonly line: readonly [number, number, number]; readonly label: LocalizedText }> = [
  { line: [4, 9, 2], label: text('linha superior', 'top row', 'fila superior') },
  { line: [3, 5, 7], label: text('linha do meio', 'middle row', 'fila del medio') },
  { line: [8, 1, 6], label: text('linha inferior', 'bottom row', 'fila inferior') },
  { line: [4, 3, 8], label: text('coluna esquerda', 'left column', 'columna izquierda') },
  { line: [9, 5, 1], label: text('coluna do meio', 'middle column', 'columna del medio') },
  { line: [2, 7, 6], label: text('coluna direita', 'right column', 'columna derecha') },
  { line: [4, 5, 6], label: text('diagonal principal', 'main diagonal', 'diagonal principal') },
  { line: [2, 5, 8], label: text('diagonal secundária', 'anti-diagonal', 'diagonal secundaria') },
]

function dateDigits(date: LocalDate): ReadonlyArray<number> {
  return [...`${date.day}${date.month}${date.year}`]
    .map(Number)
    .filter((digit) => digit !== 0)
}

function tallyOf(digits: ReadonlyArray<number>): ReadonlyArray<DigitTallyEntry> {
  return GRID_DIGITS.map((digit) => ({ digit, count: digits.filter((value) => value === digit).length }))
}

function arrowsOf(tally: ReadonlyArray<DigitTallyEntry>): ReadonlyArray<LoShuArrow> {
  const countOf = (digit: number) => tally.find((entry) => entry.digit === digit)?.count ?? 0
  const arrows: LoShuArrow[] = []
  for (const { line, label } of LO_SHU_LINES) {
    const present = line.filter((digit) => countOf(digit) > 0).length
    if (present === line.length) {
      arrows.push({ line, kind: 'strength', label })
    } else if (present === 0) {
      arrows.push({ line, kind: 'absence', label })
    }
  }
  return arrows
}

export const loShuModel: NumerologyModel = {
  id: 'lo-shu',
  metadata: {
    name: { 'pt-BR': 'Lo Shu (chinês)', en: 'Lo Shu (Chinese)', es: 'Lo Shu (chino)' },
    historicalOrigin: {
      'pt-BR':
        'Numerologia chinesa baseada no quadrado mágico Lo Shu (4-9-2 / 3-5-7 / 8-1-6), atribuído ao mito do rio Luo. Produz uma grade a partir dos dígitos da data — não um número único.',
      en: 'Chinese numerology based on the Lo Shu magic square (4-9-2 / 3-5-7 / 8-1-6), attributed to the Luo River myth. It produces a grid from the date digits — not a single number.',
      es: 'Numerología china basada en el cuadrado mágico Lo Shu (4-9-2 / 3-5-7 / 8-1-6), atribuido al mito del río Luo. Produce una cuadrícula a partir de los dígitos de la fecha — no un número único.',
    },
    sources: ['Tradição do quadrado Lo Shu (numerologia chinesa)'],
    variantDimensions: [],
  },
  supportedSubjects: SUPPORTED_SUBJECTS,
  supportedNumbers: SUPPORTED_NUMBERS,

  calculate(subject: Subject, request: CalculationRequest): Result<ReadonlyArray<CalculationTrace>, CalculationError> {
    if (!SUPPORTED_SUBJECTS.has(subject.kind)) {
      return err({ code: 'unsupported-subject', subject: subject.kind, model: 'lo-shu' })
    }
    const unsupported = request.numbers.find((number) => !SUPPORTED_NUMBERS.has(number))
    if (unsupported !== undefined) {
      return err({ code: 'unsupported-number', number: unsupported, model: 'lo-shu' })
    }
    if (request.numbers.length === 0) {
      return ok([])
    }
    if (subject.birthDate === undefined) {
      return err({ code: 'missing-birth-date', number: 'lo-shu-grid' })
    }

    const digits = dateDigits(subject.birthDate)
    const tally = tallyOf(digits)
    const arrows = arrowsOf(tally)
    const distinctCount = tally.filter((entry) => entry.count > 0).length

    const gridStep: CalculationStep = {
      kind: 'lo-shu-grid',
      title: text('Grade Lo Shu da data', 'Lo Shu grid of the date', 'Cuadrícula Lo Shu de la fecha'),
      explanation: text(
        `Os dígitos ${digits.join(', ')} são posicionados no quadrado mágico; contamos presença, ausência e repetição de cada número 1–9.`,
        `The digits ${digits.join(', ')} are placed on the magic square; we count presence, absence and repetition of each number 1–9.`,
        `Los dígitos ${digits.join(', ')} se colocan en el cuadrado mágico; contamos presencia, ausencia y repetición de cada número 1–9.`,
      ),
      input: { dateDigits: digits },
      output: { tally, arrows },
      visual: 'lo-shu',
    }

    return ok([
      {
        resultId: 'lo-shu-grid',
        model: 'lo-shu',
        engineVersion: ENGINE_VERSION,
        variantSelections: {},
        // Escalar: quantos dos 9 números aparecem na data (a grade é o resultado real).
        finalValue: reduceToValue(distinctCount, { preserveMasters: false }),
        steps: [gridStep],
        ruleRefs: [LO_SHU_RULES.gridFromBirthDate, LO_SHU_RULES.arrowsOfStrengthAndAbsence],
        divergenceNotes: [],
      },
    ])
  },
}
