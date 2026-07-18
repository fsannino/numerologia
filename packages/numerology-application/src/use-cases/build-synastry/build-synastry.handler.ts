import type { Result } from '@numerus/shared-kernel'
import { err, ok } from '@numerus/shared-kernel'
import type { CalculationTrace, ModelId, NumberKind, UnionNumberKind } from '@numerus/numerology-domain'
import { UNION_SOURCE, calculateUnionNumber } from '@numerus/numerology-domain'
import type { CalculateChartError, ChartModelResult } from '../calculate-chart/calculate-chart.handler'
import { calculateChart } from '../calculate-chart/calculate-chart.handler'
import type { BuildSynastryCommand, SynastryPerson } from './build-synastry.command'

const UNION_KINDS: ReadonlyArray<UnionNumberKind> = [
  'union-destiny',
  'union-soul',
  'union-expression',
  'union-personality',
  'union-mission',
  'union-key',
]

/** Números do nome — sempre disponíveis. */
const NAME_SOURCE_NUMBERS: ReadonlyArray<NumberKind> = ['expression', 'motivation', 'impression', 'key-number']
/** Números que exigem data de nascimento. */
const DATE_SOURCE_NUMBERS: ReadonlyArray<NumberKind> = ['life-path', 'mission']
/** Exige data de nascimento E data de referência. */
const REFERENCE_SOURCE_NUMBERS: ReadonlyArray<NumberKind> = ['personal-year']

export type PersonalYearPair = {
  readonly personA: CalculationTrace
  readonly personB: CalculationTrace
}

export type SynastryModelResult = {
  readonly model: ModelId
  readonly unionNumbers: ReadonlyArray<CalculationTrace>
  /** Convergências: números da união onde os dois indivíduos já compartilham o mesmo dígito. */
  readonly convergences: ReadonlyArray<UnionNumberKind>
  readonly personalYear?: PersonalYearPair
}

export type Synastry = {
  readonly personAName: string
  readonly personBName: string
  readonly results: ReadonlyArray<SynastryModelResult>
}

export type BuildSynastryError =
  | { readonly code: 'invalid-person-a'; readonly cause: CalculateChartError }
  | { readonly code: 'invalid-person-b'; readonly cause: CalculateChartError }

function chartOf(
  person: SynastryPerson,
  command: BuildSynastryCommand,
): Result<ReadonlyArray<ChartModelResult>, CalculateChartError> {
  const hasBirthDate = person.birthDate !== undefined && person.birthDate !== ''
  const hasReference = command.referenceDate !== undefined && command.referenceDate !== ''
  const numbers: NumberKind[] = [
    ...NAME_SOURCE_NUMBERS,
    ...(hasBirthDate ? DATE_SOURCE_NUMBERS : []),
    ...(hasBirthDate && hasReference ? REFERENCE_SOURCE_NUMBERS : []),
  ]
  const chart = calculateChart({
    subject: {
      kind: 'person',
      fullName: person.fullName,
      ...(hasBirthDate ? { birthDate: person.birthDate } : {}),
    },
    models: command.models,
    numbers,
    ...(command.variantSelections !== undefined ? { variantSelections: command.variantSelections } : {}),
    ...(command.referenceDate !== undefined ? { referenceDate: command.referenceDate } : {}),
  })
  return chart.ok ? ok(chart.value.results) : err(chart.error)
}

function reducedValueOf(result: ChartModelResult | undefined, number: NumberKind): number | undefined {
  return result?.traces.find((trace) => trace.resultId === number)?.finalValue.reduced
}

function traceOf(result: ChartModelResult | undefined, number: NumberKind): CalculationTrace | undefined {
  return result?.traces.find((trace) => trace.resultId === number)
}

/**
 * Constrói a sinastria de um casal: números da união por escola + comparação
 * de Anos Pessoais. Roda 100% no cliente — reusa o CalculateChart de cada um.
 */
export function buildSynastry(command: BuildSynastryCommand): Result<Synastry, BuildSynastryError> {
  const chartA = chartOf(command.personA, command)
  if (!chartA.ok) {
    return err({ code: 'invalid-person-a', cause: chartA.error })
  }
  const chartB = chartOf(command.personB, command)
  if (!chartB.ok) {
    return err({ code: 'invalid-person-b', cause: chartB.error })
  }

  const results: SynastryModelResult[] = command.models.map((model, modelIndex) => {
    const resultA = chartA.value[modelIndex]
    const resultB = chartB.value[modelIndex]

    const unionNumbers: CalculationTrace[] = []
    const convergences: UnionNumberKind[] = []
    for (const kind of UNION_KINDS) {
      const source = UNION_SOURCE[kind]
      const reducedA = reducedValueOf(resultA, source)
      const reducedB = reducedValueOf(resultB, source)
      if (reducedA === undefined || reducedB === undefined) {
        continue
      }
      if (reducedA === reducedB) {
        convergences.push(kind)
      }
      unionNumbers.push(calculateUnionNumber(kind, model, reducedA, reducedB))
    }

    const personalYearA = traceOf(resultA, 'personal-year')
    const personalYearB = traceOf(resultB, 'personal-year')
    const personalYear =
      personalYearA !== undefined && personalYearB !== undefined
        ? { personA: personalYearA, personB: personalYearB }
        : undefined

    return {
      model,
      unionNumbers,
      convergences,
      ...(personalYear !== undefined ? { personalYear } : {}),
    }
  })

  return ok({
    personAName: command.personA.fullName,
    personBName: command.personB.fullName,
    results,
  })
}
