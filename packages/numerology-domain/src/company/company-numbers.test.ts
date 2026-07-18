import { describe, expect, it } from 'vitest'
import { calculateBrandHarmony, calculateFounderAffinity } from './company-numbers'

describe('números empresariais derivados', () => {
  // Expressão razão social 8 + fantasia 6 = 14 (dívida) → 5
  it('harmonia da marca soma as duas Expressões e detecta dívida cármica', () => {
    const trace = calculateBrandHarmony('pythagorean', 8, 6)
    expect(trace.finalValue).toMatchObject({ raw: 14, reduced: 5, karmicDebt: 14 })
    expect(trace.resultId).toBe('brand-harmony')
    expect(trace.ruleRefs.map((rule) => rule.id)).toContain('company/brand-harmony')
  })

  // 9 + 2 = 11 → mestre preservado
  it('afinidade com o sócio preserva número mestre', () => {
    const trace = calculateFounderAffinity('pythagorean', 9, 2)
    expect(trace.finalValue).toMatchObject({ raw: 11, reduced: 11, isMaster: true })
    expect(trace.resultId).toBe('founder-affinity')
  })

  it('carrega a escola de origem', () => {
    expect(calculateBrandHarmony('chaldean', 3, 4).model).toBe('chaldean')
  })
})
