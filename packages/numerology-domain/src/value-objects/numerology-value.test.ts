import { describe, expect, it } from 'vitest'
import fc from 'fast-check'
import { isMasterNumber, karmicDebtOf, reduceToValue, sumDigits } from './numerology-value'

describe('sumDigits', () => {
  it('soma os dígitos de um número', () => {
    expect(sumDigits(62)).toBe(8)
    expect(sumDigits(199)).toBe(19)
    expect(sumDigits(7)).toBe(7)
    expect(sumDigits(0)).toBe(0)
  })
})

describe('reduceToValue', () => {
  it('reduz 62 para 8 com a cadeia explícita', () => {
    const value = reduceToValue(62, { preserveMasters: true })
    expect(value).toMatchObject({ raw: 62, reduced: 8, chain: [62, 8], isMaster: false })
    expect(value.karmicDebt).toBeUndefined()
  })

  it('preserva números mestres quando a regra manda', () => {
    expect(reduceToValue(11, { preserveMasters: true }).reduced).toBe(11)
    expect(reduceToValue(22, { preserveMasters: true }).isMaster).toBe(true)
    expect(reduceToValue(29, { preserveMasters: true }).chain).toEqual([29, 11])
  })

  it('reduz mestres quando a escola não os preserva', () => {
    expect(reduceToValue(11, { preserveMasters: false })).toMatchObject({ reduced: 2, chain: [11, 2] })
  })

  it('marca dívida cármica no valor bruto, antes da redução', () => {
    const value = reduceToValue(14, { preserveMasters: true })
    expect(value.karmicDebt).toBe(14)
    expect(value.reduced).toBe(5)
  })

  it('rejeita entrada não inteira ou negativa (fail fast)', () => {
    expect(() => reduceToValue(-1, { preserveMasters: true })).toThrow(RangeError)
    expect(() => reduceToValue(3.5, { preserveMasters: true })).toThrow(RangeError)
  })

  it('propriedade: todo total ≥ 1 reduz para 1–9 ou para um mestre', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 1_000_000 }), (raw) => {
        const value = reduceToValue(raw, { preserveMasters: true })
        return (value.reduced >= 1 && value.reduced <= 9) || isMasterNumber(value.reduced)
      }),
    )
  })

  it('propriedade: a cadeia começa no bruto, termina no reduzido e cada elo é a soma de dígitos do anterior', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 1_000_000 }), (raw) => {
        const { chain, reduced } = reduceToValue(raw, { preserveMasters: true })
        if (chain[0] !== raw || chain[chain.length - 1] !== reduced) return false
        for (let i = 1; i < chain.length; i += 1) {
          if (chain[i] !== sumDigits(chain[i - 1] ?? 0)) return false
        }
        return true
      }),
    )
  })
})

describe('karmicDebtOf', () => {
  it('reconhece apenas 13, 14, 16 e 19', () => {
    expect(karmicDebtOf(13)).toBe(13)
    expect(karmicDebtOf(19)).toBe(19)
    expect(karmicDebtOf(15)).toBeUndefined()
    expect(karmicDebtOf(9)).toBeUndefined()
  })
})
