import { describe, expect, it } from 'vitest'
import { unwrap } from '@numerus/shared-kernel'
import { calculateChart } from './calculate-chart.handler'

describe('calculateChart', () => {
  it('calcula a Expressão pitagórica de uma pessoa, end-to-end', () => {
    const chart = unwrap(
      calculateChart({
        subject: { kind: 'person', fullName: 'Maria Silva' },
        models: ['pythagorean'],
        numbers: ['expression'],
      }),
    )
    expect(chart.results).toHaveLength(1)
    const trace = chart.results[0]?.traces[0]
    expect(trace?.finalValue.reduced).toBe(6)
    expect(trace?.steps.length).toBeGreaterThan(0)
  })

  it('propaga erro de nome inválido com a causa', () => {
    const result = calculateChart({
      subject: { kind: 'person', fullName: '   ' },
      models: ['pythagorean'],
      numbers: ['expression'],
    })
    expect(result).toMatchObject({ ok: false, error: { code: 'invalid-name', cause: { code: 'empty-name' } } })
  })

  it('propaga erro de modelo desconhecido', () => {
    const result = calculateChart({
      subject: { kind: 'person', fullName: 'Maria Silva' },
      models: ['chaldean'],
      numbers: ['expression'],
    })
    expect(result).toMatchObject({ ok: false, error: { code: 'unknown-model' } })
  })

  it('repassa a seleção de variante ao modelo', () => {
    const chart = unwrap(
      calculateChart({
        subject: { kind: 'person', fullName: 'Maria Silva' },
        models: ['pythagorean'],
        numbers: ['expression'],
        variantSelections: { 'expression-reduction': 'sum-all-then-reduce' },
      }),
    )
    expect(chart.results[0]?.traces[0]?.finalValue.raw).toBe(42)
  })
})
