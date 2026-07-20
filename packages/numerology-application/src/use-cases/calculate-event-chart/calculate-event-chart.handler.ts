import type { Result } from '@numerus/shared-kernel'
import { err, ok } from '@numerus/shared-kernel'
import type { CalculationTrace, LifePathVariant, LocalDateError } from '@numerus/numerology-domain'
import {
  LIFE_PATH_REDUCTION_DIMENSION,
  LocalDate,
  calculateEventPersonalYear,
  calculateEventVibration,
} from '@numerus/numerology-domain'
import type { CalculateEventChartCommand } from './calculate-event-chart.command'

const LIFE_PATH_VARIANTS: ReadonlyArray<LifePathVariant> = ['reduce-parts-then-sum', 'sum-all-digits']
const DEFAULT_LIFE_PATH_VARIANT: LifePathVariant = 'reduce-parts-then-sum'

export type EventChart = {
  readonly vibration: CalculationTrace
  /** Presente quando a data de referência é igual ou posterior ao evento. */
  readonly personalYear?: CalculationTrace
}

export type CalculateEventChartError = { readonly code: 'invalid-event-date'; readonly cause: LocalDateError }

function resolveLifePathVariant(command: CalculateEventChartCommand): LifePathVariant {
  const selected = command.variantSelections?.[LIFE_PATH_REDUCTION_DIMENSION]
  return LIFE_PATH_VARIANTS.find((variant) => variant === selected) ?? DEFAULT_LIFE_PATH_VARIANT
}

/**
 * Calcula a vibração de um evento (Caminho de Vida da data) e, se houver data
 * de referência, o Ano Pessoal do evento. Roda no cliente (device-first).
 */
export function calculateEventChart(
  command: CalculateEventChartCommand,
): Result<EventChart, CalculateEventChartError> {
  const eventDate = LocalDate.fromISO(command.eventDate)
  if (!eventDate.ok) {
    return err({ code: 'invalid-event-date', cause: eventDate.error })
  }

  const vibration = calculateEventVibration(eventDate.value, resolveLifePathVariant(command))

  let personalYear: CalculationTrace | undefined
  if (command.referenceDate !== undefined && command.referenceDate !== '') {
    const reference = LocalDate.fromISO(command.referenceDate)
    if (reference.ok) {
      const computed = calculateEventPersonalYear(eventDate.value, reference.value)
      // Referência anterior ao evento apenas omite o Ano Pessoal — não é erro do fluxo.
      if (computed.ok) {
        personalYear = computed.value
      }
    }
  }

  return ok({ vibration, ...(personalYear !== undefined ? { personalYear } : {}) })
}
