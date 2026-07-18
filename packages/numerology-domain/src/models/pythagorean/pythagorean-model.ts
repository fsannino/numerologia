import type { Result } from '@numerus/shared-kernel'
import { err, ok, ptBR } from '@numerus/shared-kernel'
import type { NumberKind, SubjectKind } from '../../model-ids'
import type { Subject } from '../../entities/person-subject'
import type { CalculationTrace } from '../../trace/calculation-trace'
import type {
  CalculationError,
  CalculationRequest,
  NumerologyModel,
  VariantDimension,
} from '../../ports/numerology-model'
import type { NameNumberKind, NameNumberVariants, NameReductionVariant } from './name-numbers'
import { DEFAULT_NAME_REDUCTION, NAME_REDUCTION_DIMENSION, calculateNameNumber } from './name-numbers'
import type { YClassificationVariant } from './letter-classification'
import { DEFAULT_Y_CLASSIFICATION } from './letter-classification'
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
    label: ptBR('Método de redução dos números do nome'),
    options: [
      {
        id: 'reduce-words-then-sum',
        label: ptBR('Reduzir cada palavra antes de somar'),
        description: ptBR('Cada palavra do nome é reduzida (preservando mestres) e os resultados são somados. Método predominante.'),
      },
      {
        id: 'sum-all-then-reduce',
        label: ptBR('Somar todas as letras e reduzir uma vez'),
        description: ptBR('Todas as letras consideradas são somadas em um único total, reduzido ao final.'),
      },
    ],
    defaultOption: DEFAULT_NAME_REDUCTION,
  },
  {
    dimension: Y_CLASSIFICATION_DIMENSION,
    label: ptBR('Classificação do Y'),
    options: [
      {
        id: 'y-by-context',
        label: ptBR('Y por contexto'),
        description: ptBR('Y conta como vogal quando não há vogal plena vizinha na palavra (LYDIA → vogal; YARA → consoante).'),
      },
      { id: 'y-always-vowel', label: ptBR('Y sempre vogal'), description: ptBR('Algumas escolas tratam o Y sempre como vogal.') },
      { id: 'y-always-consonant', label: ptBR('Y sempre consoante'), description: ptBR('Outras escolas tratam o Y sempre como consoante.') },
    ],
    defaultOption: DEFAULT_Y_CLASSIFICATION,
  },
  {
    dimension: LIFE_PATH_REDUCTION_DIMENSION,
    label: ptBR('Método de redução do Destino'),
    options: [
      {
        id: 'reduce-parts-then-sum',
        label: ptBR('Reduzir dia, mês e ano antes de somar'),
        description: ptBR('Cada parte da data é reduzida (preservando mestres) e os resultados são somados. Método predominante.'),
      },
      {
        id: 'sum-all-digits',
        label: ptBR('Somar todos os dígitos da data'),
        description: ptBR('Todos os dígitos de dia, mês e ano são somados em um único total, reduzido ao final.'),
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
    },
    sources: [
      'L. Dow Balliett, "The Philosophy of Numbers" (1908)',
      'Juno Jordan, "Numerology: The Romance in Your Name" (1965)',
    ],
    variantDimensions: VARIANT_DIMENSIONS,
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
