export type { CalculateChartCommand } from './use-cases/calculate-chart/calculate-chart.command'
export type {
  CalculateChartError,
  Chart,
  ChartModelResult,
} from './use-cases/calculate-chart/calculate-chart.handler'
export { calculateChart } from './use-cases/calculate-chart/calculate-chart.handler'

export type { CompareSignaturesCommand } from './use-cases/compare-signatures/compare-signatures.command'
export type {
  CompareSignaturesError,
  SignatureComparison,
  SignatureModelDelta,
  SignatureNumberDelta,
} from './use-cases/compare-signatures/compare-signatures.handler'
export { compareSignatures } from './use-cases/compare-signatures/compare-signatures.handler'

export type { BuildSynastryCommand, SynastryPerson } from './use-cases/build-synastry/build-synastry.command'
export type {
  BuildSynastryError,
  PersonalYearPair,
  Synastry,
  SynastryModelResult,
} from './use-cases/build-synastry/build-synastry.handler'
export { buildSynastry } from './use-cases/build-synastry/build-synastry.handler'
