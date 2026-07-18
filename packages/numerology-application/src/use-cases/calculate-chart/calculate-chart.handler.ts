import type { Result } from '@numerus/shared-kernel'
import { err, ok } from '@numerus/shared-kernel'
import type {
  BirthNameError,
  CalculationError,
  CalculationTrace,
  LocalDateError,
  ModelId,
  UnknownModelError,
} from '@numerus/numerology-domain'
import { BirthName, LocalDate, getModel, personSubject } from '@numerus/numerology-domain'
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
  | { readonly code: 'invalid-birth-date'; readonly cause: LocalDateError }
  | { readonly code: 'invalid-reference-date'; readonly cause: LocalDateError }
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
  let birthDate: LocalDate | undefined
  if (command.subject.birthDate !== undefined && command.subject.birthDate !== '') {
    const parsed = LocalDate.fromISO(command.subject.birthDate)
    if (!parsed.ok) {
      return err({ code: 'invalid-birth-date', cause: parsed.error })
    }
    birthDate = parsed.value
  }
  let referenceDate: LocalDate | undefined
  if (command.referenceDate !== undefined && command.referenceDate !== '') {
    const parsed = LocalDate.fromISO(command.referenceDate)
    if (!parsed.ok) {
      return err({ code: 'invalid-reference-date', cause: parsed.error })
    }
    referenceDate = parsed.value
  }
  const subject = personSubject(birthName.value, birthDate)

  const results: ChartModelResult[] = []
  for (const modelId of command.models) {
    const model = getModel(modelId)
    if (!model.ok) {
      return model
    }
    // Capacidade declarada não é ambiguidade: cada escola calcula o subconjunto
    // que suporta e a UI mostra explicitamente o que uma escola não calcula.
    const numbersForModel = command.numbers.filter((number) =>
      model.value.supportedNumbers.has(number),
    )
    const request = {
      numbers: numbersForModel,
      ...(command.variantSelections !== undefined
        ? { variantSelections: command.variantSelections }
        : {}),
      ...(referenceDate !== undefined ? { referenceDate } : {}),
    }
    const traces = model.value.calculate(subject, request)
    if (!traces.ok) {
      return traces
    }
    results.push({ model: modelId, traces: traces.value })
  }

  return ok({ subjectKind: 'person', results })
}
