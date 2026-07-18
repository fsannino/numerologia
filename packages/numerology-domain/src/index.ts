export type { ModelId, NumberKind, SubjectKind } from './model-ids'
export { ENGINE_VERSION } from './engine-version'

export type {
  MasterNumber,
  KarmicDebtNumber,
  ReductionChain,
  NumerologyValue,
} from './value-objects/numerology-value'
export {
  MASTER_NUMBERS,
  KARMIC_DEBT_NUMBERS,
  isMasterNumber,
  karmicDebtOf,
  sumDigits,
  reduceToValue,
} from './value-objects/numerology-value'

export type {
  NameNormalizationError,
  NormalizedName,
  UnsupportedCharacter,
} from './value-objects/name-normalization-policy'
export { normalizeName } from './value-objects/name-normalization-policy'
export type { BirthNameError } from './value-objects/birth-name'
export { BirthName } from './value-objects/birth-name'
export type { LocalDateError } from './value-objects/local-date'
export { LocalDate, daysInMonth } from './value-objects/local-date'

export type { PersonSubject, Subject } from './entities/person-subject'
export { personSubject } from './entities/person-subject'

export type {
  CalculationStep,
  CalculationTrace,
  DivergenceNote,
  LetterMappingEntry,
  RuleReference,
} from './trace/calculation-trace'

export type {
  CalculationError,
  CalculationRequest,
  ModelMetadata,
  NumerologyModel,
  VariantDimension,
  VariantOption,
} from './ports/numerology-model'

export type {
  NameNumberKind,
  NameNumberVariants,
  NameReductionVariant,
} from './models/pythagorean/name-numbers'
export {
  DEFAULT_NAME_REDUCTION,
  NAME_REDUCTION_DIMENSION,
  calculateExpression,
  calculateNameNumber,
} from './models/pythagorean/name-numbers'
export type { LetterRole, YClassificationVariant } from './models/pythagorean/letter-classification'
export {
  DEFAULT_Y_CLASSIFICATION,
  classifyLetter,
  lettersWithRole,
} from './models/pythagorean/letter-classification'
export type { LifePathVariant } from './models/pythagorean/date-numbers'
export {
  DEFAULT_LIFE_PATH_VARIANT,
  LIFE_PATH_REDUCTION_DIMENSION,
  calculateLifePath,
  calculateMission,
  calculatePsychic,
} from './models/pythagorean/date-numbers'
export { PYTHAGOREAN_LETTER_VALUES } from './models/pythagorean/letter-table'
export { Y_CLASSIFICATION_DIMENSION, pythagoreanModel } from './models/pythagorean/pythagorean-model'

export type { UnknownModelError } from './models/registry'
export { getModel, listModels } from './models/registry'
