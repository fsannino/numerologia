import { describe, expect, it } from 'vitest'
import { unwrap } from '@numerus/shared-kernel'
import { LocalDate } from '../value-objects/local-date'
import { calculateMarriageGoverning, calculateMarriagePersonalYear } from './marriage-numbers'

const date = (iso: string) => unwrap(LocalDate.fromISO(iso))

describe('números da união formal', () => {
  // Casamento 2015-06-20: dia 20→2, mês 6, ano 2015→8 · 2+6+8 = 16 (dívida) → 7
  it('número regente é o Caminho de Vida da data do casamento, com dívida cármica', () => {
    const trace = calculateMarriageGoverning(date('2015-06-20'), 'reduce-parts-then-sum')
    expect(trace.finalValue).toMatchObject({ raw: 16, reduced: 7, karmicDebt: 16 })
    expect(trace.resultId).toBe('marriage-governing')
    expect(trace.ruleRefs[0]?.id).toBe('marriage/governing-number')
  })

  it('Ano Pessoal do casamento trata a data do casamento como nascimento da união', () => {
    const trace = unwrap(calculateMarriagePersonalYear(date('2015-06-20'), date('2026-07-18')))
    expect(trace.resultId).toBe('marriage-personal-year')
    expect(trace.ruleRefs[0]?.id).toBe('marriage/personal-year')
    // reduzido a 1–9
    expect(trace.finalValue.reduced).toBeGreaterThanOrEqual(1)
    expect(trace.finalValue.reduced).toBeLessThanOrEqual(9)
  })

  it('propaga erro se a data de referência é anterior ao casamento', () => {
    const result = calculateMarriagePersonalYear(date('2015-06-20'), date('2010-01-01'))
    expect(result).toMatchObject({ ok: false, error: { code: 'reference-before-birth-date' } })
  })
})
