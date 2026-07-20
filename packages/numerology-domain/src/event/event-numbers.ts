import type { Result } from '@numerus/shared-kernel'
import { ok } from '@numerus/shared-kernel'
import type { LocalDate } from '../value-objects/local-date'
import type { CalculationError } from '../ports/numerology-model'
import type { CalculationTrace } from '../trace/calculation-trace'
import type { LifePathVariant } from '../models/pythagorean/date-numbers'
import { calculateLifePath } from '../models/pythagorean/date-numbers'
import { calculatePersonalTime } from '../models/pythagorean/time-numbers'
import { EVENT_RULES } from './event-rules'

/**
 * Números do sujeito Evento (§2.3): a vibração de uma data específica.
 * Derivam apenas da DATA — independentes de escola. Reusam as funções de data
 * existentes (R4: a redução de datas é conhecimento único), re-rotulando o
 * resultado para o contexto de evento (mesmo padrão do casamento).
 */

/** Vibração do evento = Caminho de Vida da data do evento. */
export function calculateEventVibration(eventDate: LocalDate, variant: LifePathVariant): CalculationTrace {
  const base = calculateLifePath(eventDate, variant)
  return {
    ...base,
    resultId: 'event-vibration',
    ruleRefs: [EVENT_RULES.vibrationFromDate, ...base.ruleRefs],
  }
}

/** Ano Pessoal do evento = Ano Pessoal da data do evento na data de referência. */
export function calculateEventPersonalYear(
  eventDate: LocalDate,
  referenceDate: LocalDate,
): Result<CalculationTrace, CalculationError> {
  const base = calculatePersonalTime('personal-year', eventDate, referenceDate)
  if (!base.ok) {
    return base
  }
  return ok({
    ...base.value,
    resultId: 'event-personal-year',
    ruleRefs: [EVENT_RULES.personalYearOfEvent, ...base.value.ruleRefs],
  })
}
