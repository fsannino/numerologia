import type { Result } from '@numerus/shared-kernel'
import { err, ok } from '@numerus/shared-kernel'
import { text } from '../../trace/step-builders'
import type { NumberKind, SubjectKind } from '../../model-ids'
import type { Subject } from '../../entities/person-subject'
import type { CalculationTrace } from '../../trace/calculation-trace'
import type {
  CalculationError,
  CalculationRequest,
  NumerologyModel,
  VariantDimension,
} from '../../ports/numerology-model'
import { PYTHAGOREAN_LETTER_VALUES } from './letter-table'
import type { NameNumberKind, NameNumberVariants, NameReductionVariant } from './name-numbers'
import { DEFAULT_NAME_REDUCTION, NAME_REDUCTION_DIMENSION, calculateNameNumber } from './name-numbers'
import type { YClassificationVariant } from '../../value-objects/letter-classification'
import { DEFAULT_Y_CLASSIFICATION } from '../../value-objects/letter-classification'
import type { NameGridNumberKind } from './name-grid'
import { calculateNameGridNumber } from './name-grid'
import {
  calculateChallenges,
  calculateLifeCycles,
  calculatePersonalTime,
  calculatePinnacles,
} from './time-numbers'
import type { LocalDate } from '../../value-objects/local-date'
import type { LifePathVariant } from './date-numbers'
import {
  DEFAULT_LIFE_PATH_VARIANT,
  LIFE_PATH_REDUCTION_DIMENSION,
  calculateLifePath,
  calculateMission,
  calculatePsychic,
} from './date-numbers'

export const Y_CLASSIFICATION_DIMENSION = 'y-classification'

const SUPPORTED_SUBJECTS: ReadonlySet<SubjectKind> = new Set(['person'])
const SUPPORTED_NUMBERS: ReadonlySet<NumberKind> = new Set([
  'expression',
  'motivation',
  'impression',
  'key-number',
  'life-path',
  'psychic',
  'mission',
  'karmic-lessons',
  'hidden-tendencies',
  'subconscious',
  'life-cycles',
  'pinnacles',
  'challenges',
  'personal-year',
  'personal-month',
  'personal-day',
])

const NAME_NUMBER_KINDS: ReadonlySet<NumberKind> = new Set(['expression', 'motivation', 'impression', 'key-number'])
const NAME_GRID_KINDS: ReadonlySet<NumberKind> = new Set(['karmic-lessons', 'hidden-tendencies', 'subconscious'])
const TIME_KINDS: ReadonlySet<NumberKind> = new Set([
  'life-cycles',
  'pinnacles',
  'challenges',
  'personal-year',
  'personal-month',
  'personal-day',
])

const VARIANT_DIMENSIONS: ReadonlyArray<VariantDimension> = [
  {
    dimension: NAME_REDUCTION_DIMENSION,
    label: text('Método de redução dos números do nome', 'Name-number reduction method', 'Método de reducción de los números del nombre'),
    options: [
      {
        id: 'reduce-words-then-sum',
        label: text('Reduzir cada palavra antes de somar', 'Reduce each word before summing', 'Reducir cada palabra antes de sumar'),
        description: text(
          'Cada palavra do nome é reduzida (preservando mestres) e os resultados são somados. Método predominante.',
          'Each word of the name is reduced (preserving masters) and the results are summed. Predominant method.',
          'Cada palabra del nombre se reduce (preservando maestros) y los resultados se suman. Método predominante.',
        ),
      },
      {
        id: 'sum-all-then-reduce',
        label: text('Somar todas as letras e reduzir uma vez', 'Sum all letters and reduce once', 'Sumar todas las letras y reducir una vez'),
        description: text(
          'Todas as letras consideradas são somadas em um único total, reduzido ao final.',
          'Every considered letter is summed into a single total, reduced at the end.',
          'Todas las letras consideradas se suman en un único total, reducido al final.',
        ),
      },
    ],
    defaultOption: DEFAULT_NAME_REDUCTION,
  },
  {
    dimension: Y_CLASSIFICATION_DIMENSION,
    label: text('Classificação do Y', 'Y classification', 'Clasificación de la Y'),
    options: [
      {
        id: 'y-by-context',
        label: text('Y por contexto', 'Y by context', 'Y por contexto'),
        description: text(
          'Y conta como vogal quando não há vogal plena vizinha na palavra (LYDIA → vogal; YARA → consoante).',
          'Y counts as a vowel when no plain vowel is adjacent in the word (LYDIA → vowel; YARA → consonant).',
          'La Y cuenta como vocal cuando no hay vocal plena vecina en la palabra (LYDIA → vocal; YARA → consonante).',
        ),
      },
      {
        id: 'y-always-vowel',
        label: text('Y sempre vogal', 'Y always vowel', 'Y siempre vocal'),
        description: text('Algumas escolas tratam o Y sempre como vogal.', 'Some schools always treat Y as a vowel.', 'Algunas escuelas tratan la Y siempre como vocal.'),
      },
      {
        id: 'y-always-consonant',
        label: text('Y sempre consoante', 'Y always consonant', 'Y siempre consonante'),
        description: text('Outras escolas tratam o Y sempre como consoante.', 'Other schools always treat Y as a consonant.', 'Otras escuelas tratan la Y siempre como consonante.'),
      },
    ],
    defaultOption: DEFAULT_Y_CLASSIFICATION,
  },
  {
    dimension: LIFE_PATH_REDUCTION_DIMENSION,
    label: text('Método de redução do Destino', 'Life Path reduction method', 'Método de reducción del Destino'),
    options: [
      {
        id: 'reduce-parts-then-sum',
        label: text('Reduzir dia, mês e ano antes de somar', 'Reduce day, month and year before summing', 'Reducir día, mes y año antes de sumar'),
        description: text(
          'Cada parte da data é reduzida (preservando mestres) e os resultados são somados. Método predominante.',
          'Each date part is reduced (preserving masters) and the results are summed. Predominant method.',
          'Cada parte de la fecha se reduce (preservando maestros) y los resultados se suman. Método predominante.',
        ),
      },
      {
        id: 'sum-all-digits',
        label: text('Somar todos os dígitos da data', 'Sum every digit of the date', 'Sumar todos los dígitos de la fecha'),
        description: text(
          'Todos os dígitos de dia, mês e ano são somados em um único total, reduzido ao final.',
          'Every digit of day, month and year is summed into a single total, reduced at the end.',
          'Todos los dígitos de día, mes y año se suman en un único total, reducido al final.',
        ),
      },
    ],
    defaultOption: DEFAULT_LIFE_PATH_VARIANT,
  },
]

type ResolvedVariants = {
  readonly nameReduction: NameReductionVariant
  readonly yClassification: YClassificationVariant
  readonly lifePath: LifePathVariant
}

function resolveVariant<T extends string>(
  request: CalculationRequest,
  dimension: string,
  known: ReadonlyArray<T>,
  fallback: T,
): Result<T, CalculationError> {
  const selected = request.variantSelections?.[dimension]
  if (selected === undefined) {
    return ok(fallback)
  }
  const match = known.find((option) => option === selected)
  if (match === undefined) {
    return err({ code: 'unknown-variant', dimension, option: selected })
  }
  return ok(match)
}

function resolveAllVariants(request: CalculationRequest): Result<ResolvedVariants, CalculationError> {
  const nameReduction = resolveVariant<NameReductionVariant>(
    request,
    NAME_REDUCTION_DIMENSION,
    ['reduce-words-then-sum', 'sum-all-then-reduce'],
    DEFAULT_NAME_REDUCTION,
  )
  if (!nameReduction.ok) return nameReduction
  const yClassification = resolveVariant<YClassificationVariant>(
    request,
    Y_CLASSIFICATION_DIMENSION,
    ['y-by-context', 'y-always-vowel', 'y-always-consonant'],
    DEFAULT_Y_CLASSIFICATION,
  )
  if (!yClassification.ok) return yClassification
  const lifePath = resolveVariant<LifePathVariant>(
    request,
    LIFE_PATH_REDUCTION_DIMENSION,
    ['reduce-parts-then-sum', 'sum-all-digits'],
    DEFAULT_LIFE_PATH_VARIANT,
  )
  if (!lifePath.ok) return lifePath
  return ok({
    nameReduction: nameReduction.value,
    yClassification: yClassification.value,
    lifePath: lifePath.value,
  })
}

function calculateOne(
  subject: Subject,
  number: NumberKind,
  variants: ResolvedVariants,
  referenceDate: LocalDate | undefined,
): Result<CalculationTrace, CalculationError> {
  const nameVariants: NameNumberVariants = {
    reduction: variants.nameReduction,
    yClassification: variants.yClassification,
  }
  if (NAME_NUMBER_KINDS.has(number)) {
    return ok(calculateNameNumber(subject.birthName, number as NameNumberKind, nameVariants))
  }
  if (NAME_GRID_KINDS.has(number)) {
    return ok(calculateNameGridNumber(subject.birthName, number as NameGridNumberKind))
  }
  const birthDate = subject.birthDate
  if (birthDate === undefined) {
    return err({ code: 'missing-birth-date', number })
  }
  if (TIME_KINDS.has(number)) {
    if (referenceDate === undefined) {
      return err({ code: 'missing-reference-date', number })
    }
    switch (number) {
      case 'life-cycles':
        return calculateLifeCycles(birthDate, referenceDate, variants.lifePath)
      case 'pinnacles':
        return calculatePinnacles(birthDate, referenceDate, variants.lifePath)
      case 'challenges':
        return calculateChallenges(birthDate, referenceDate, variants.lifePath)
      case 'personal-year':
      case 'personal-month':
      case 'personal-day':
        return calculatePersonalTime(number, birthDate, referenceDate)
    }
  }
  switch (number) {
    case 'life-path':
      return ok(calculateLifePath(birthDate, variants.lifePath))
    case 'psychic':
      return ok(calculatePsychic(birthDate))
    case 'mission': {
      const expression = calculateNameNumber(subject.birthName, 'expression', nameVariants)
      const lifePath = calculateLifePath(birthDate, variants.lifePath)
      return ok(
        calculateMission(expression.finalValue, lifePath.finalValue, {
          ...expression.variantSelections,
          ...lifePath.variantSelections,
        }),
      )
    }
    default:
      return err({ code: 'unsupported-number', number, model: 'pythagorean' })
  }
}

export const pythagoreanModel: NumerologyModel = {
  id: 'pythagorean',
  metadata: {
    name: { 'pt-BR': 'Pitagórico', en: 'Pythagorean', es: 'Pitagórico' },
    historicalOrigin: {
      'pt-BR':
        'Sistema moderno estruturado no fim do séc. XIX / início do XX por L. Dow Balliett e Juno Jordan, reivindicando a herança de Pitágoras. É o modelo mais difundido no Ocidente.',
      en: 'Modern system structured in the late 19th / early 20th century by L. Dow Balliett and Juno Jordan, claiming the heritage of Pythagoras. The most widespread Western model.',
      es: 'Sistema moderno estructurado a finales del s. XIX / inicios del XX por L. Dow Balliett y Juno Jordan, reivindicando la herencia de Pitágoras. Es el modelo más difundido en Occidente.',
    },
    sources: [
      'L. Dow Balliett, "The Philosophy of Numbers" (1908)',
      'Juno Jordan, "Numerology: The Romance in Your Name" (1965)',
    ],
    variantDimensions: VARIANT_DIMENSIONS,
    letterValues: PYTHAGOREAN_LETTER_VALUES,
  },
  supportedSubjects: SUPPORTED_SUBJECTS,
  supportedNumbers: SUPPORTED_NUMBERS,

  calculate(subject: Subject, request: CalculationRequest): Result<ReadonlyArray<CalculationTrace>, CalculationError> {
    if (!SUPPORTED_SUBJECTS.has(subject.kind)) {
      return err({ code: 'unsupported-subject', subject: subject.kind, model: 'pythagorean' })
    }
    const unsupported = request.numbers.find((number) => !SUPPORTED_NUMBERS.has(number))
    if (unsupported !== undefined) {
      return err({ code: 'unsupported-number', number: unsupported, model: 'pythagorean' })
    }
    const variants = resolveAllVariants(request)
    if (!variants.ok) {
      return variants
    }
    const traces: CalculationTrace[] = []
    for (const number of request.numbers) {
      const trace = calculateOne(subject, number, variants.value, request.referenceDate)
      if (!trace.ok) {
        return trace
      }
      traces.push(trace.value)
    }
    return ok(traces)
  },
}
