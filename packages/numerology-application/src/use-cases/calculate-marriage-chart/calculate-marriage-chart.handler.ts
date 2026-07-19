import type { Result } from '@numerus/shared-kernel'
import { err, ok } from '@numerus/shared-kernel'
import type { CalculationTrace, LifePathVariant, LocalDateError } from '@numerus/numerology-domain'
import {
  LIFE_PATH_REDUCTION_DIMENSION,
  LocalDate,
  calculateMarriageGoverning,
  calculateMarriagePersonalYear,
} from '@numerus/numerology-domain'
import type { Synastry, BuildSynastryError } from '../build-synastry/build-synastry.handler'
import { buildSynastry } from '../build-synastry/build-synastry.handler'
import type { CalculateMarriageChartCommand } from './calculate-marriage-chart.command'

const LIFE_PATH_VARIANTS: ReadonlyArray<LifePathVariant> = ['reduce-parts-then-sum', 'sum-all-digits']
const DEFAULT_LIFE_PATH_VARIANT: LifePathVariant = 'reduce-parts-then-sum'

export type MarriageChart = {
  readonly personAName: string
  readonly personBName: string
  readonly governingNumber: CalculationTrace
  /** Presente quando a data de referência é igual ou posterior ao casamento. */
  readonly marriagePersonalYear?: CalculationTrace
  readonly synastry: Synastry
}

export type CalculateMarriageChartError =
  | { readonly code: 'invalid-wedding-date'; readonly cause: LocalDateError }
  | { readonly code: 'invalid-couple'; readonly cause: BuildSynastryError }

function resolveLifePathVariant(command: CalculateMarriageChartCommand): LifePathVariant {
  const selected = command.variantSelections?.[LIFE_PATH_REDUCTION_DIMENSION]
  return LIFE_PATH_VARIANTS.find((variant) => variant === selected) ?? DEFAULT_LIFE_PATH_VARIANT
}

/**
 * Calcula o mapa de um casamento: número regente + Ano Pessoal do casamento
 * (da data do casamento) e os números da união do casal. Roda no cliente.
 */
export function calculateMarriageChart(
  command: CalculateMarriageChartCommand,
): Result<MarriageChart, CalculateMarriageChartError> {
  const weddingDate = LocalDate.fromISO(command.weddingDate)
  if (!weddingDate.ok) {
    return err({ code: 'invalid-wedding-date', cause: weddingDate.error })
  }

  const synastry = buildSynastry({
    personA: command.personA,
    personB: command.personB,
    models: command.models,
    ...(command.variantSelections !== undefined ? { variantSelections: command.variantSelections } : {}),
    ...(command.referenceDate !== undefined ? { referenceDate: command.referenceDate } : {}),
  })
  if (!synastry.ok) {
    return err({ code: 'invalid-couple', cause: synastry.error })
  }

  const governingNumber = calculateMarriageGoverning(weddingDate.value, resolveLifePathVariant(command))

  let marriagePersonalYear: CalculationTrace | undefined
  if (command.referenceDate !== undefined && command.referenceDate !== '') {
    const reference = LocalDate.fromISO(command.referenceDate)
    if (reference.ok) {
      const personalYear = calculateMarriagePersonalYear(weddingDate.value, reference.value)
      // Referência anterior ao casamento apenas omite o Ano Pessoal — não é erro do fluxo.
      if (personalYear.ok) {
        marriagePersonalYear = personalYear.value
      }
    }
  }

  return ok({
    personAName: command.personA.fullName,
    personBName: command.personB.fullName,
    governingNumber,
    ...(marriagePersonalYear !== undefined ? { marriagePersonalYear } : {}),
    synastry: synastry.value,
  })
}
