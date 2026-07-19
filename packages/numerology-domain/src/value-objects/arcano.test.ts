import fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import { reduceToArcano } from './arcano'

describe('reduceToArcano — fixtures conferidas manualmente', () => {
  // ((62 − 1) mod 22) + 1 = (61 mod 22) + 1 = 17 + 1 = 18 (FABIANO SANNINO sequencial)
  it('62 → 18', () => {
    expect(reduceToArcano(62)).toBe(18)
  })
  // ((52 − 1) mod 22) + 1 = (51 mod 22) + 1 = 7 + 1 = 8 (FABIANO SANNINO caldaica)
  it('52 → 8', () => {
    expect(reduceToArcano(52)).toBe(8)
  })
  // Totais dentro de 1–22 ficam iguais; 22 permanece 22; 23 volta a 1.
  it('respeita a borda do ciclo', () => {
    expect(reduceToArcano(1)).toBe(1)
    expect(reduceToArcano(22)).toBe(22)
    expect(reduceToArcano(23)).toBe(1)
    expect(reduceToArcano(44)).toBe(22)
  })
  it('rejeita entrada inválida', () => {
    expect(() => reduceToArcano(0)).toThrow(RangeError)
    expect(() => reduceToArcano(-3)).toThrow(RangeError)
    expect(() => reduceToArcano(1.5)).toThrow(RangeError)
  })
})

describe('reduceToArcano — propriedades', () => {
  it('sempre produz um arcano de 1 a 22', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 1_000_000 }), (raw) => {
        const arcano = reduceToArcano(raw)
        expect(arcano).toBeGreaterThanOrEqual(1)
        expect(arcano).toBeLessThanOrEqual(22)
      }),
    )
  })
})
