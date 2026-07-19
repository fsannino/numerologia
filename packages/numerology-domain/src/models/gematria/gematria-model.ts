import type { Result } from '@numerus/shared-kernel'
import { err, ok } from '@numerus/shared-kernel'
import { ENGINE_VERSION } from '../../engine-version'
import type { NumberKind, SubjectKind } from '../../model-ids'
import type { Subject } from '../../entities/person-subject'
import { reduceToValue } from '../../value-objects/numerology-value'
import type { CalculationStep, CalculationTrace, DivergenceNote } from '../../trace/calculation-trace'
import type { CalculationError, CalculationRequest, NumerologyModel } from '../../ports/numerology-model'
import { text } from '../../trace/step-builders'
import { GEMATRIA_RULES } from './gematria-rules'
import { transliterate } from './transliteration'

const SUPPORTED_SUBJECTS: ReadonlySet<SubjectKind> = new Set(['person'])
const SUPPORTED_NUMBERS: ReadonlySet<NumberKind> = new Set(['gematria-value'])

function transliterationDivergence(
  standardTotal: number,
  minTotal: number,
  maxTotal: number,
  combinationCount: number,
): ReadonlyArray<DivergenceNote> {
  if (minTotal === maxTotal) {
    return []
  }
  const minReduced = reduceToValue(minTotal, { preserveMasters: false }).reduced
  const maxReduced = reduceToValue(maxTotal, { preserveMasters: false }).reduced
  return [
    {
      id: 'gematria/transliteration-spectrum',
      note: text(
        `A transliteração é uma reconstrução: há ${combinationCount} combinações possíveis. O valor vai de ${minTotal} (reduz a ${minReduced}) a ${maxTotal} (reduz a ${maxReduced}); a transliteração padrão dá ${standardTotal}. Nenhuma leitura é a "correta" — todas são candidatas.`,
        `Transliteration is a reconstruction: ${combinationCount} combinations are possible. The value ranges from ${minTotal} (reduces to ${minReduced}) to ${maxTotal} (reduces to ${maxReduced}); the standard transliteration gives ${standardTotal}. No reading is "the" answer — all are candidates.`,
        `La transliteración es una reconstrucción: hay ${combinationCount} combinaciones posibles. El valor va de ${minTotal} (se reduce a ${minReduced}) a ${maxTotal} (se reduce a ${maxReduced}); la transliteración estándar da ${standardTotal}. Ninguna lectura es "la" respuesta — todas son candidatas.`,
      ),
    },
  ]
}

export const gematriaModel: NumerologyModel = {
  id: 'gematria',
  metadata: {
    name: { 'pt-BR': 'Gematria (hebraica)', en: 'Gematria (Hebrew)', es: 'Gematría (hebrea)' },
    historicalOrigin: {
      'pt-BR':
        'Sistema hebraico que soma os valores das letras (mispar hechrachi). Para nomes latinos exige transliteração ao hebraico — ambígua por natureza, exposta como múltiplas candidatas (ADR-0008).',
      en: 'Hebrew system summing letter values (mispar hechrachi). Latin names require transliteration into Hebrew — ambiguous by nature, exposed as multiple candidates (ADR-0008).',
      es: 'Sistema hebreo que suma los valores de las letras (mispar hechrachi). Los nombres latinos requieren transliteración al hebreo — ambigua por naturaleza, expuesta como múltiples candidatas (ADR-0008).',
    },
    sources: ['Gematria hebraica clássica (mispar hechrachi)'],
    canonicity: 'documented-tradition',
    standardization: 'variant-dependent',
    variantDimensions: [],
  },
  supportedSubjects: SUPPORTED_SUBJECTS,
  supportedNumbers: SUPPORTED_NUMBERS,

  calculate(subject: Subject, request: CalculationRequest): Result<ReadonlyArray<CalculationTrace>, CalculationError> {
    if (!SUPPORTED_SUBJECTS.has(subject.kind)) {
      return err({ code: 'unsupported-subject', subject: subject.kind, model: 'gematria' })
    }
    const unsupported = request.numbers.find((number) => !SUPPORTED_NUMBERS.has(number))
    if (unsupported !== undefined) {
      return err({ code: 'unsupported-number', number: unsupported, model: 'gematria' })
    }
    if (request.numbers.length === 0) {
      return ok([])
    }

    const result = transliterate(subject.birthName.allLetters)
    const transliterationStep: CalculationStep = {
      kind: 'transliteration',
      title: text('Transliteração para o hebraico', 'Transliteration into Hebrew', 'Transliteración al hebreo'),
      explanation: text(
        'Cada letra latina é mapeada para uma ou mais letras hebraicas. Letras ambíguas mostram todas as candidatas; nada é escolhido em silêncio (ADR-0008).',
        'Each Latin letter maps to one or more Hebrew letters. Ambiguous letters show all candidates; nothing is chosen silently (ADR-0008).',
        'Cada letra latina se asigna a una o más letras hebreas. Las letras ambiguas muestran todas las candidatas; nada se elige en silencio (ADR-0008).',
      ),
      input: { name: subject.birthName.original },
      output: {
        letters: result.letters,
        standardTotal: result.standardTotal,
        minTotal: result.minTotal,
        maxTotal: result.maxTotal,
        combinationCount: result.combinationCount,
        standardHebrew: result.standardHebrew,
      },
      visual: 'transliteration',
    }

    const finalValue = reduceToValue(result.standardTotal, { preserveMasters: false })

    return ok([
      {
        resultId: 'gematria-value',
        model: 'gematria',
        engineVersion: ENGINE_VERSION,
        variantSelections: {},
        finalValue,
        steps: [transliterationStep],
        ruleRefs: [GEMATRIA_RULES.hebrewValues, GEMATRIA_RULES.transliterationIsReconstruction],
        divergenceNotes: transliterationDivergence(
          result.standardTotal,
          result.minTotal,
          result.maxTotal,
          result.combinationCount,
        ),
      },
    ])
  },
}
