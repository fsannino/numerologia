import type { Result } from '@numerus/shared-kernel'
import { err, ok } from '@numerus/shared-kernel'
import type { CalculationTrace, ModelId, NumberKind } from '@numerus/numerology-domain'
import type { CalculateChartError, ChartModelResult } from '../calculate-chart/calculate-chart.handler'
import { calculateChart } from '../calculate-chart/calculate-chart.handler'
import type { CompareSignaturesCommand } from './compare-signatures.command'

/** Números do nome — os únicos que mudam quando a assinatura muda. */
const NAME_NUMBERS: ReadonlyArray<NumberKind> = ['expression', 'motivation', 'impression', 'key-number']

export type SignatureNumberDelta = {
  readonly numberKind: NumberKind
  readonly registration: CalculationTrace
  readonly signature: CalculationTrace
  /** O dígito reduzido mudou entre os dois nomes? */
  readonly changed: boolean
}

export type SignatureModelDelta = {
  readonly model: ModelId
  readonly numbers: ReadonlyArray<SignatureNumberDelta>
}

export type SignatureComparison = {
  readonly registrationName: string
  readonly signatureName: string
  readonly results: ReadonlyArray<SignatureModelDelta>
  /** Quantidade total de números que mudaram, somando todas as escolas. */
  readonly changedCount: number
}

export type CompareSignaturesError =
  | { readonly code: 'invalid-registration-name'; readonly cause: CalculateChartError }
  | { readonly code: 'invalid-signature-name'; readonly cause: CalculateChartError }

function nameNumbersOf(
  fullName: string,
  command: CompareSignaturesCommand,
): Result<ReadonlyArray<ChartModelResult>, CalculateChartError> {
  const chart = calculateChart({
    subject: { kind: 'person', fullName },
    models: command.models,
    numbers: NAME_NUMBERS,
    ...(command.variantSelections !== undefined ? { variantSelections: command.variantSelections } : {}),
  })
  return chart.ok ? ok(chart.value.results) : err(chart.error)
}

/**
 * Compara os números do nome de dois nomes da mesma pessoa e expõe o delta.
 * Roda inteiramente no cliente (device-first): reusa o CalculateChart.
 */
export function compareSignatures(
  command: CompareSignaturesCommand,
): Result<SignatureComparison, CompareSignaturesError> {
  const registration = nameNumbersOf(command.registrationName, command)
  if (!registration.ok) {
    return err({ code: 'invalid-registration-name', cause: registration.error })
  }
  const signature = nameNumbersOf(command.signatureName, command)
  if (!signature.ok) {
    return err({ code: 'invalid-signature-name', cause: signature.error })
  }

  let changedCount = 0
  const results: SignatureModelDelta[] = registration.value.map((registrationResult, modelIndex) => {
    const signatureResult = signature.value[modelIndex]
    const numbers: SignatureNumberDelta[] = registrationResult.traces.map((registrationTrace, traceIndex) => {
      const signatureTrace = signatureResult?.traces[traceIndex]
      if (signatureTrace === undefined) {
        throw new Error('Assimetria inesperada entre os cálculos de registro e assinatura')
      }
      const changed = registrationTrace.finalValue.reduced !== signatureTrace.finalValue.reduced
      if (changed) changedCount += 1
      return {
        numberKind: registrationTrace.resultId,
        registration: registrationTrace,
        signature: signatureTrace,
        changed,
      }
    })
    return { model: registrationResult.model, numbers }
  })

  return ok({
    registrationName: command.registrationName,
    signatureName: command.signatureName,
    results,
    changedCount,
  })
}
