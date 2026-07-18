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

  it('calcula o mapa completo quando a data de nascimento é fornecida', () => {
    const chart = unwrap(
      calculateChart({
        subject: { kind: 'person', fullName: 'Maria Silva', birthDate: '1990-03-27' },
        models: ['pythagorean'],
        numbers: ['expression', 'life-path', 'psychic', 'mission'],
      }),
    )
    const reduced = chart.results[0]?.traces.map((trace) => trace.finalValue.reduced)
    // Expressão 6 · Destino 4 (dívida 13) · Psíquico 9 (dia 27) · Missão 6+4=10→1
    expect(reduced).toEqual([6, 4, 9, 1])
  })

  it('propaga erro de data malformada com a causa', () => {
    const result = calculateChart({
      subject: { kind: 'person', fullName: 'Maria Silva', birthDate: '27/03/1990' },
      models: ['pythagorean'],
      numbers: ['life-path'],
    })
    expect(result).toMatchObject({ ok: false, error: { code: 'invalid-birth-date', cause: { code: 'malformed-date' } } })
  })

  it('erro explícito quando um número de data é pedido sem data', () => {
    const result = calculateChart({
      subject: { kind: 'person', fullName: 'Maria Silva' },
      models: ['pythagorean'],
      numbers: ['life-path'],
    })
    expect(result).toMatchObject({ ok: false, error: { code: 'missing-birth-date', number: 'life-path' } })
  })

  it('repassa a seleção de variante ao modelo', () => {
    const chart = unwrap(
      calculateChart({
        subject: { kind: 'person', fullName: 'Maria Silva' },
        models: ['pythagorean'],
        numbers: ['expression'],
        variantSelections: { 'name-reduction': 'sum-all-then-reduce' },
      }),
    )
    expect(chart.results[0]?.traces[0]?.finalValue.raw).toBe(42)
  })
})
