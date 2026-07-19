import type { Result } from '@numerus/shared-kernel'
import { ok } from '@numerus/shared-kernel'
import type { LocalDate } from '../value-objects/local-date'
import type { CalculationError } from '../ports/numerology-model'
import type { CalculationTrace } from '../trace/calculation-trace'
import type { LifePathVariant } from '../models/pythagorean/date-numbers'
import { calculateLifePath } from '../models/pythagorean/date-numbers'
import { calculatePersonalTime } from '../models/pythagorean/time-numbers'
import { MARRIAGE_RULES } from './marriage-rules'

/**
 * Números da união formal (§2.3, item 3). Derivam apenas da DATA DO CASAMENTO
 * — são independentes de escola (a redução de dígitos de data é a mesma em
 * toda escola). Reusam as funções de data existentes (R4: a redução de datas
 * é conhecimento único), apenas re-rotulando o resultado para o contexto de
 * casamento.
 */

/** Número regente = Caminho de Vida da data do casamento. */
export function calculateMarriageGoverning(weddingDate: LocalDate, variant: LifePathVariant): CalculationTrace {
  const base = calculateLifePath(weddingDate, variant)
  return {
    ...base,
    resultId: 'marriage-governing',
    ruleRefs: [MARRIAGE_RULES.governingFromWeddingDate, ...base.ruleRefs],
  }
}

/** Ano Pessoal do casamento = Ano Pessoal da data do casamento na data de referência. */
export function calculateMarriagePersonalYear(
  weddingDate: LocalDate,
  referenceDate: LocalDate,
): Result<CalculationTrace, CalculationError> {
  const base = calculatePersonalTime('personal-year', weddingDate, referenceDate)
  if (!base.ok) {
    return base
  }
  return ok({
    ...base.value,
    resultId: 'marriage-personal-year',
    ruleRefs: [MARRIAGE_RULES.personalYearOfMarriage, ...base.value.ruleRefs],
  })
}
