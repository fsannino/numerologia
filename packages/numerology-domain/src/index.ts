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

export type { ExpressionVariant } from './models/pythagorean/expression'
export {
  DEFAULT_EXPRESSION_VARIANT,
  EXPRESSION_REDUCTION_DIMENSION,
  calculateExpression,
} from './models/pythagorean/expression'
export { PYTHAGOREAN_LETTER_VALUES } from './models/pythagorean/letter-table'
export { pythagoreanModel } from './models/pythagorean/pythagorean-model'

export type { UnknownModelError } from './models/registry'
export { getModel, listModels } from './models/registry'
