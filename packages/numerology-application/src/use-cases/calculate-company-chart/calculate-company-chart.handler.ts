import type { Result } from '@numerus/shared-kernel'
import { err, ok } from '@numerus/shared-kernel'
import type { CalculationTrace, ModelId, NumberKind } from '@numerus/numerology-domain'
import { calculateBrandHarmony, calculateFounderAffinity } from '@numerus/numerology-domain'
import type { CalculateChartError, ChartModelResult } from '../calculate-chart/calculate-chart.handler'
import { calculateChart } from '../calculate-chart/calculate-chart.handler'
import type { CalculateCompanyChartCommand } from './calculate-company-chart.command'

const NAME_NUMBERS: ReadonlyArray<NumberKind> = ['expression', 'motivation', 'impression', 'key-number']

export type CompanyModelResult = {
  readonly model: ModelId
  readonly corporateNumbers: ReadonlyArray<CalculationTrace>
  readonly brandNumbers: ReadonlyArray<CalculationTrace>
  readonly corporateDestiny?: CalculationTrace
  readonly brandHarmony?: CalculationTrace
  readonly founderAffinity?: CalculationTrace
}

export type CompanyChart = {
  readonly legalName: string
  readonly tradeName: string
  readonly results: ReadonlyArray<CompanyModelResult>
}

export type CalculateCompanyChartError =
  | { readonly code: 'invalid-legal-name'; readonly cause: CalculateChartError }
  | { readonly code: 'invalid-trade-name'; readonly cause: CalculateChartError }
  | { readonly code: 'invalid-founder-name'; readonly cause: CalculateChartError }

function nameChart(
  fullName: string,
  command: CalculateCompanyChartCommand,
  numbers: ReadonlyArray<NumberKind>,
  birthDate?: string,
): Result<ReadonlyArray<ChartModelResult>, CalculateChartError> {
  const chart = calculateChart({
    subject: { kind: 'person', fullName, ...(birthDate !== undefined && birthDate !== '' ? { birthDate } : {}) },
    models: command.models,
    numbers,
    ...(command.variantSelections !== undefined ? { variantSelections: command.variantSelections } : {}),
  })
  return chart.ok ? ok(chart.value.results) : err(chart.error)
}

function reducedExpression(result: ChartModelResult | undefined): number | undefined {
  return result?.traces.find((trace) => trace.resultId === 'expression')?.finalValue.reduced
}

/**
 * Calcula o mapa de uma empresa: identidade corporativa (razão social),
 * marca (nome fantasia), destino corporativo (data de constituição),
 * harmonia da marca e, opcionalmente, afinidade com um sócio.
 * Roda 100% no cliente — reusa o CalculateChart.
 */
export function calculateCompanyChart(
  command: CalculateCompanyChartCommand,
): Result<CompanyChart, CalculateCompanyChartError> {
  const hasDate = command.incorporationDate !== undefined && command.incorporationDate !== ''
  const corporate = nameChart(
    command.legalName,
    command,
    hasDate ? [...NAME_NUMBERS, 'life-path'] : NAME_NUMBERS,
    command.incorporationDate,
  )
  if (!corporate.ok) {
    return err({ code: 'invalid-legal-name', cause: corporate.error })
  }
  const brand = nameChart(command.tradeName, command, NAME_NUMBERS)
  if (!brand.ok) {
    return err({ code: 'invalid-trade-name', cause: brand.error })
  }

  let founder: ReadonlyArray<ChartModelResult> | undefined
  if (command.founderName !== undefined && command.founderName !== '') {
    const founderChart = nameChart(command.founderName, command, NAME_NUMBERS)
    if (!founderChart.ok) {
      return err({ code: 'invalid-founder-name', cause: founderChart.error })
    }
    founder = founderChart.value
  }

  const results: CompanyModelResult[] = command.models.map((model, modelIndex) => {
    const corporateResult = corporate.value[modelIndex]
    const brandResult = brand.value[modelIndex]
    const legalExpression = reducedExpression(corporateResult)
    const tradeExpression = reducedExpression(brandResult)
    const founderExpression = reducedExpression(founder?.[modelIndex])

    const corporateDestiny = corporateResult?.traces.find((trace) => trace.resultId === 'life-path')
    const brandHarmony =
      legalExpression !== undefined && tradeExpression !== undefined
        ? calculateBrandHarmony(model, legalExpression, tradeExpression)
        : undefined
    const founderAffinity =
      legalExpression !== undefined && founderExpression !== undefined
        ? calculateFounderAffinity(model, legalExpression, founderExpression)
        : undefined

    return {
      model,
      corporateNumbers: corporateResult?.traces.filter((trace) => trace.resultId !== 'life-path') ?? [],
      brandNumbers: brandResult?.traces ?? [],
      ...(corporateDestiny !== undefined ? { corporateDestiny } : {}),
      ...(brandHarmony !== undefined ? { brandHarmony } : {}),
      ...(founderAffinity !== undefined ? { founderAffinity } : {}),
    }
  })

  return ok({ legalName: command.legalName, tradeName: command.tradeName, results })
}
