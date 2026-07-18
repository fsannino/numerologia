import type { Result } from '@numerus/shared-kernel'
import { err, ok } from '@numerus/shared-kernel'
import { text } from '../../trace/step-builders'
import type { NumberKind, SubjectKind } from '../../model-ids'
import type { Subject } from '../../entities/person-subject'
import type { CalculationTrace } from '../../trace/calculation-trace'
import type { CalculationError, CalculationRequest, NumerologyModel } from '../../ports/numerology-model'
import type { YClassificationVariant } from '../../value-objects/letter-classification'
import { DEFAULT_Y_CLASSIFICATION } from '../../value-objects/letter-classification'
import { CHALDEAN_LETTER_VALUES } from './letter-table'
import type { ChaldeanNameNumberKind } from './name-numbers'
import { calculateChaldeanNameNumber } from './name-numbers'

const Y_CLASSIFICATION_DIMENSION = 'y-classification'
const Y_OPTIONS: ReadonlyArray<YClassificationVariant> = ['y-by-context', 'y-always-vowel', 'y-always-consonant']

const SUPPORTED_SUBJECTS: ReadonlySet<SubjectKind> = new Set(['person'])
const SUPPORTED_NUMBERS: ReadonlySet<NumberKind> = new Set(['expression', 'motivation', 'impression', 'key-number'])

export const chaldeanModel: NumerologyModel = {
  id: 'chaldean',
  metadata: {
    name: { 'pt-BR': 'Caldeu', en: 'Chaldean', es: 'Caldeo' },
    historicalOrigin: {
      'pt-BR':
        'Tradição atribuída à Caldeia/Babilônia, com tabela 1–8 por afinidade fonética e o 9 reservado como sagrado. A forma moderna foi popularizada por "Cheiro" no início do séc. XX.',
      en: 'Tradition attributed to Chaldea/Babylon, with a 1–8 phonetic-affinity table and 9 reserved as sacred. The modern form was popularized by "Cheiro" in the early 20th century.',
      es: 'Tradición atribuida a Caldea/Babilonia, con tabla 1–8 por afinidad fonética y el 9 reservado como sagrado. La forma moderna fue popularizada por "Cheiro" a inicios del s. XX.',
    },
    sources: ['Cheiro, "Cheiro\'s Book of Numbers" (1926)'],
    letterValues: CHALDEAN_LETTER_VALUES,
    variantDimensions: [
      {
        dimension: Y_CLASSIFICATION_DIMENSION,
        label: text('Classificação do Y', 'Y classification', 'Clasificación de la Y'),
        options: [
          {
            id: 'y-by-context',
            label: text('Y por contexto', 'Y by context', 'Y por contexto'),
            description: text(
              'Y conta como vogal quando não há vogal plena vizinha na palavra.',
              'Y counts as a vowel when no plain vowel is adjacent in the word.',
              'La Y cuenta como vocal cuando no hay vocal plena vecina en la palabra.',
            ),
          },
          {
            id: 'y-always-vowel',
            label: text('Y sempre vogal', 'Y always vowel', 'Y siempre vocal'),
            description: text('Regra fixa de algumas escolas.', 'Fixed rule of some schools.', 'Regla fija de algunas escuelas.'),
          },
          {
            id: 'y-always-consonant',
            label: text('Y sempre consoante', 'Y always consonant', 'Y siempre consonante'),
            description: text('Regra fixa de outras escolas.', 'Fixed rule of other schools.', 'Regla fija de otras escuelas.'),
          },
        ],
        defaultOption: DEFAULT_Y_CLASSIFICATION,
      },
    ],
  },
  supportedSubjects: SUPPORTED_SUBJECTS,
  supportedNumbers: SUPPORTED_NUMBERS,

  calculate(subject: Subject, request: CalculationRequest): Result<ReadonlyArray<CalculationTrace>, CalculationError> {
    if (!SUPPORTED_SUBJECTS.has(subject.kind)) {
      return err({ code: 'unsupported-subject', subject: subject.kind, model: 'chaldean' })
    }
    const unsupported = request.numbers.find((number) => !SUPPORTED_NUMBERS.has(number))
    if (unsupported !== undefined) {
      return err({ code: 'unsupported-number', number: unsupported, model: 'chaldean' })
    }
    const selected = request.variantSelections?.[Y_CLASSIFICATION_DIMENSION]
    let yClassification: YClassificationVariant = DEFAULT_Y_CLASSIFICATION
    if (selected !== undefined) {
      const match = Y_OPTIONS.find((option) => option === selected)
      if (match === undefined) {
        return err({ code: 'unknown-variant', dimension: Y_CLASSIFICATION_DIMENSION, option: selected })
      }
      yClassification = match
    }
    const traces = request.numbers.map((number) =>
      calculateChaldeanNameNumber(subject.birthName, number as ChaldeanNameNumberKind, yClassification),
    )
    return ok(traces)
  },
}
