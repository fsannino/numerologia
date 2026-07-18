import { ENGINE_VERSION } from '../../engine-version'
import type { BirthName } from '../../value-objects/birth-name'
import { reduceToValue } from '../../value-objects/numerology-value'
import type { CalculationStep, CalculationTrace, DigitTallyEntry, RuleReference } from '../../trace/calculation-trace'
import type { NumberKind } from '../../model-ids'
import type { LocalizedText } from '@numerus/shared-kernel'
import { pythagoreanValueOf } from './letter-table'
import { PYTHAGOREAN_RULES } from './rules'
import { letterMappingStep, text } from './trace-steps'

/**
 * Grade do nome (ADR-0006): Lições Cármicas, Tendências Ocultas e
 * Subconsciente derivam da contagem de cada dígito 1–9 entre os valores
 * das letras. Não dependem de variante: usam todas as letras, sem redução.
 */

const GRID_DIGITS: ReadonlyArray<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9]

/** Repetição mínima para um dígito contar como Tendência Oculta. */
const HIDDEN_TENDENCY_MIN_COUNT = 3

export type NameGridNumberKind = 'karmic-lessons' | 'hidden-tendencies' | 'subconscious'

function tallyOf(name: BirthName): { readonly letterValues: ReadonlyArray<number>; readonly tally: ReadonlyArray<DigitTallyEntry> } {
  const letterValues = name.allLetters.map((letter) => pythagoreanValueOf(letter))
  const tally = GRID_DIGITS.map((digit) => ({
    digit,
    count: letterValues.filter((value) => value === digit).length,
  }))
  return { letterValues, tally }
}

function gridAnalysisStep(
  title: LocalizedText,
  explanation: LocalizedText,
  letterValues: ReadonlyArray<number>,
  tally: ReadonlyArray<DigitTallyEntry>,
  highlighted: ReadonlyArray<number>,
): CalculationStep {
  return {
    kind: 'grid-analysis',
    title,
    explanation,
    input: { letterValues },
    output: { tally, highlighted },
    visual: 'digit-grid',
  }
}

type GridDefinition = {
  readonly highlight: (tally: ReadonlyArray<DigitTallyEntry>) => ReadonlyArray<number>
  /** O escalar final com significado tradicional (ADR-0006). */
  readonly finalCount: (tally: ReadonlyArray<DigitTallyEntry>, highlighted: ReadonlyArray<number>) => number
  readonly stepTitle: LocalizedText
  readonly stepExplanation: LocalizedText
  readonly ruleRef: RuleReference
}

const GRID_DEFINITIONS: Record<NameGridNumberKind, GridDefinition> = {
  'karmic-lessons': {
    highlight: (tally) => tally.filter((entry) => entry.count === 0).map((entry) => entry.digit),
    finalCount: (_tally, highlighted) => highlighted.length,
    stepTitle: text('Dígitos ausentes na grade', 'Missing digits in the grid'),
    stepExplanation: text(
      'Contamos quantas vezes cada dígito 1–9 aparece entre os valores das letras; os ausentes (contagem zero) são as Lições Cármicas.',
      'We count how often each digit 1–9 appears among the letter values; the absent ones (count zero) are the Karmic Lessons.',
    ),
    ruleRef: PYTHAGOREAN_RULES.karmicLessonsFromMissingDigits,
  },
  'hidden-tendencies': {
    highlight: (tally) =>
      tally.filter((entry) => entry.count >= HIDDEN_TENDENCY_MIN_COUNT).map((entry) => entry.digit),
    finalCount: (_tally, highlighted) => highlighted.length,
    stepTitle: text('Dígitos repetidos na grade', 'Repeated digits in the grid'),
    stepExplanation: text(
      `Dígitos que aparecem ${HIDDEN_TENDENCY_MIN_COUNT} ou mais vezes entre os valores das letras são Tendências Ocultas.`,
      `Digits appearing ${HIDDEN_TENDENCY_MIN_COUNT} or more times among the letter values are Hidden Tendencies.`,
    ),
    ruleRef: PYTHAGOREAN_RULES.hiddenTendenciesFromRepetition,
  },
  subconscious: {
    highlight: (tally) => tally.filter((entry) => entry.count > 0).map((entry) => entry.digit),
    finalCount: (_tally, highlighted) => highlighted.length,
    stepTitle: text('Dígitos presentes na grade', 'Digits present in the grid'),
    stepExplanation: text(
      'O Subconsciente é a quantidade de dígitos distintos presentes — equivalente a 9 menos o número de Lições Cármicas.',
      'The Subconscious is the count of distinct digits present — equivalent to 9 minus the number of Karmic Lessons.',
    ),
    ruleRef: PYTHAGOREAN_RULES.subconsciousFromDistinctDigits,
  },
}

export function calculateNameGridNumber(name: BirthName, kind: NameGridNumberKind): CalculationTrace {
  const definition = GRID_DEFINITIONS[kind]
  const { letterValues, tally } = tallyOf(name)
  const highlighted = definition.highlight(tally)
  const finalCount = definition.finalCount(tally, highlighted)

  const steps: CalculationStep[] = [
    {
      kind: 'filter',
      title: text('Normalização do nome', 'Name normalization'),
      explanation: text(
        'Acentos e cedilha são removidos, apóstrofos unem letras, hífens separam palavras e as partículas entram no cálculo (ADR-0002).',
        'Diacritics are removed, apostrophes join letters, hyphens split words and particles are included (ADR-0002).',
      ),
      input: { source: name.original },
      output: { kept: name.words },
      visual: 'text',
    },
    ...name.words.map((word) =>
      letterMappingStep(
        word,
        [...word].map((letter) => ({ letter, value: pythagoreanValueOf(letter) })),
      ),
    ),
    gridAnalysisStep(definition.stepTitle, definition.stepExplanation, letterValues, tally, highlighted),
  ]

  return {
    resultId: kind satisfies NumberKind,
    model: 'pythagorean',
    engineVersion: ENGINE_VERSION,
    variantSelections: {},
    finalValue: reduceToValue(finalCount, { preserveMasters: false }),
    steps,
    ruleRefs: [PYTHAGOREAN_RULES.letterTable, definition.ruleRef],
    divergenceNotes: [],
  }
}
