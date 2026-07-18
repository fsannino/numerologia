import { describe, expect, it } from 'vitest'
import { UNION_SOURCE, calculateUnionNumber } from './union-numbers'

describe('calculateUnionNumber', () => {
  // Expressão 6 (Maria Silva) + Expressão 3 (outra pessoa) = 9
  it('soma os valores reduzidos e reduz o total', () => {
    const trace = calculateUnionNumber('union-expression', 'pythagorean', 6, 3)
    expect(trace.finalValue).toMatchObject({ raw: 9, reduced: 9 })
    expect(trace.resultId).toBe('union-expression')
    expect(trace.model).toBe('pythagorean')
  })

  // 5 + 8 = 13 (dívida cármica) → 4
  it('detecta dívida cármica no total da união', () => {
    const trace = calculateUnionNumber('union-destiny', 'pythagorean', 5, 8)
    expect(trace.finalValue).toMatchObject({ raw: 13, reduced: 4, karmicDebt: 13 })
  })

  // 9 + 2 = 11 → mestre preservado
  it('preserva número mestre na união', () => {
    const trace = calculateUnionNumber('union-soul', 'pythagorean', 9, 2)
    expect(trace.finalValue).toMatchObject({ raw: 11, reduced: 11, isMaster: true })
  })

  it('sempre cita a regra epistêmica (reflexão, não veredito) — §9', () => {
    const trace = calculateUnionNumber('union-mission', 'chaldean', 4, 7)
    expect(trace.ruleRefs.map((rule) => rule.id)).toContain('synastry/reflection-not-verdict')
    expect(trace.model).toBe('chaldean')
  })

  it('mapeia cada união ao número individual de origem', () => {
    expect(UNION_SOURCE['union-destiny']).toBe('life-path')
    expect(UNION_SOURCE['union-soul']).toBe('motivation')
    expect(UNION_SOURCE['union-personality']).toBe('impression')
    expect(UNION_SOURCE['union-key']).toBe('key-number')
  })
})
