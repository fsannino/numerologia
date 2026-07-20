import { describe, expect, it } from 'vitest'
import { unwrap } from '@numerus/shared-kernel'
import { LocalDate } from '../value-objects/local-date'
import { calculateEventPersonalYear, calculateEventVibration } from './event-numbers'

const date = (iso: string) => unwrap(LocalDate.fromISO(iso))

describe('números do evento', () => {
  // Evento 2015-06-20: dia 20→2, mês 6, ano 2015→8 · 2+6+8 = 16 (dívida) → 7
  it('vibração é o Caminho de Vida da data do evento, com dívida cármica', () => {
    const trace = calculateEventVibration(date('2015-06-20'), 'reduce-parts-then-sum')
    expect(trace.finalValue).toMatchObject({ raw: 16, reduced: 7, karmicDebt: 16 })
    expect(trace.resultId).toBe('event-vibration')
    expect(trace.ruleRefs[0]?.id).toBe('event/vibration')
  })

  it('Ano Pessoal do evento trata a data do evento como um nascimento', () => {
    const trace = unwrap(calculateEventPersonalYear(date('2015-06-20'), date('2026-07-20')))
    expect(trace.resultId).toBe('event-personal-year')
    expect(trace.ruleRefs[0]?.id).toBe('event/personal-year')
    expect(trace.finalValue.reduced).toBeGreaterThanOrEqual(1)
    expect(trace.finalValue.reduced).toBeLessThanOrEqual(9)
  })

  it('propaga erro se a data de referência é anterior ao evento', () => {
    const result = calculateEventPersonalYear(date('2015-06-20'), date('2010-01-01'))
    expect(result).toMatchObject({ ok: false, error: { code: 'reference-before-birth-date' } })
  })
})
