import type { Result } from '@numerus/shared-kernel'
import { err, ok } from '@numerus/shared-kernel'
import type {
  BirthNameError,
  CalculationError,
  CalculationTrace,
  ModelId,
  UnknownModelError,
} from '@numerus/numerology-domain'
import { BirthName, getModel, personSubject } from '@numerus/numerology-domain'
import type { CalculateChartCommand } from './calculate-chart.command'

export type ChartModelResult = {
  readonly model: ModelId
  readonly traces: ReadonlyArray<CalculationTrace>
}

export type Chart = {
  readonly subjectKind: 'person'
  readonly results: ReadonlyArray<ChartModelResult>
}

export type CalculateChartError =
  | { readonly code: 'invalid-name'; readonly cause: BirthNameError }
  | UnknownModelError
  | CalculationError

/**
 * Use case CalculateChart. Roda no cliente na persona pessoal (device-first,
 * ADR-0001): nenhum dado do comando atravessa a rede.
 */
export function calculateChart(command: CalculateChartCommand): Result<Chart, CalculateChartError> {
  const birthName = BirthName.create(command.subject.fullName)
  if (!birthName.ok) {
    return err({ code: 'invalid-name', cause: birthName.error })
  }
  const subject = personSubject(birthName.value)

  const results: ChartModelResult[] = []
  for (const modelId of command.models) {
    const model = getModel(modelId)
    if (!model.ok) {
      return model
    }
    const request = {
      numbers: command.numbers,
      ...(command.variantSelections !== undefined
        ? { variantSelections: command.variantSelections }
        : {}),
    }
    const traces = model.value.calculate(subject, request)
    if (!traces.ok) {
      return traces
    }
    results.push({ model: modelId, traces: traces.value })
  }

  return ok({ subjectKind: 'person', results })
}
