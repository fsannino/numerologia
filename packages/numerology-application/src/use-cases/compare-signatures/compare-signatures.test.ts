import { describe, expect, it } from 'vitest'
import { unwrap } from '@numerus/shared-kernel'
import { compareSignatures } from './compare-signatures.handler'

describe('compareSignatures', () => {
  it('expõe o delta vibracional entre nome de registro e assinatura', () => {
    const comparison = unwrap(
      compareSignatures({
        registrationName: 'Maria Silva',
        signatureName: 'Maria S',
        models: ['pythagorean'],
      }),
    )
    expect(comparison.registrationName).toBe('Maria Silva')
    expect(comparison.signatureName).toBe('Maria S')
    const numbers = comparison.results[0]?.numbers ?? []
    expect(numbers.map((delta) => delta.numberKind)).toEqual([
      'expression', 'motivation', 'impression', 'key-number',
    ])
    // Cada delta traz os dois traços completos (o modo "por quê?" funciona nos dois).
    expect(numbers[0]?.registration.steps.length).toBeGreaterThan(0)
    expect(numbers[0]?.signature.steps.length).toBeGreaterThan(0)
  })

  it('marca changed e conta o total de números alterados', () => {
    // "Maria Silva" (Expressão 6) × "Ana" muda vários números.
    const comparison = unwrap(
      compareSignatures({
        registrationName: 'Maria Silva',
        signatureName: 'Ana',
        models: ['pythagorean'],
      }),
    )
    expect(comparison.changedCount).toBeGreaterThan(0)
    const changedFlags = comparison.results[0]?.numbers.map((delta) => delta.changed)
    expect(changedFlags?.some((flag) => flag)).toBe(true)
  })

  it('nome idêntico não produz nenhuma mudança', () => {
    const comparison = unwrap(
      compareSignatures({
        registrationName: 'Maria Silva',
        signatureName: 'Maria Silva',
        models: ['pythagorean', 'chaldean'],
      }),
    )
    expect(comparison.changedCount).toBe(0)
    expect(comparison.results.every((result) => result.numbers.every((delta) => !delta.changed))).toBe(true)
  })

  it('propaga erro do nome de registro com a causa', () => {
    const result = compareSignatures({
      registrationName: '   ',
      signatureName: 'Maria',
      models: ['pythagorean'],
    })
    expect(result).toMatchObject({
      ok: false,
      error: { code: 'invalid-registration-name', cause: { code: 'invalid-name' } },
    })
  })

  it('propaga erro do nome de assinatura com a causa', () => {
    const result = compareSignatures({
      registrationName: 'Maria',
      signatureName: 'Maria 3',
      models: ['pythagorean'],
    })
    expect(result).toMatchObject({
      ok: false,
      error: { code: 'invalid-signature-name', cause: { code: 'invalid-name' } },
    })
  })
})
