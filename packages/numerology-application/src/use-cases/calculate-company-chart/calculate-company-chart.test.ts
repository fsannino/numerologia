import { describe, expect, it } from 'vitest'
import { unwrap } from '@numerus/shared-kernel'
import { calculateCompanyChart } from './calculate-company-chart.handler'

describe('calculateCompanyChart', () => {
  it('calcula identidade corporativa, marca e harmonia (sem data)', () => {
    const chart = unwrap(
      calculateCompanyChart({
        legalName: 'Padaria Estrela Ltda',
        tradeName: 'Estrela',
        models: ['pythagorean'],
      }),
    )
    const result = chart.results[0]
    expect(result?.corporateNumbers.map((trace) => trace.resultId)).toEqual([
      'expression', 'motivation', 'impression', 'key-number',
    ])
    expect(result?.brandNumbers).toHaveLength(4)
    expect(result?.brandHarmony?.resultId).toBe('brand-harmony')
    // Sem data → sem destino corporativo.
    expect(result?.corporateDestiny).toBeUndefined()
  })

  it('inclui o Destino corporativo quando há data de constituição', () => {
    const chart = unwrap(
      calculateCompanyChart({
        legalName: 'Padaria Estrela Ltda',
        tradeName: 'Estrela',
        incorporationDate: '2010-05-12',
        models: ['pythagorean'],
      }),
    )
    expect(chart.results[0]?.corporateDestiny?.resultId).toBe('life-path')
    // O destino não deve aparecer também na lista de números corporativos.
    expect(chart.results[0]?.corporateNumbers.some((trace) => trace.resultId === 'life-path')).toBe(false)
  })

  it('calcula a afinidade com o sócio quando um nome é fornecido', () => {
    const chart = unwrap(
      calculateCompanyChart({
        legalName: 'Padaria Estrela Ltda',
        tradeName: 'Estrela',
        founderName: 'Maria Silva',
        models: ['pythagorean'],
      }),
    )
    expect(chart.results[0]?.founderAffinity?.resultId).toBe('founder-affinity')
  })

  it('sem sócio, não há afinidade', () => {
    const chart = unwrap(
      calculateCompanyChart({ legalName: 'Estrela Ltda', tradeName: 'Estrela', models: ['pythagorean'] }),
    )
    expect(chart.results[0]?.founderAffinity).toBeUndefined()
  })

  it('propaga erro identificando qual nome é inválido', () => {
    const result = calculateCompanyChart({
      legalName: 'Estrela Ltda',
      tradeName: 'Estrela 3',
      models: ['pythagorean'],
    })
    expect(result).toMatchObject({ ok: false, error: { code: 'invalid-trade-name' } })
  })

  it('a escola caldaica gera harmonia mesmo sem suportar números de data', () => {
    const chart = unwrap(
      calculateCompanyChart({
        legalName: 'Estrela Ltda',
        tradeName: 'Estrela',
        incorporationDate: '2010-05-12',
        models: ['chaldean'],
      }),
    )
    expect(chart.results[0]?.brandHarmony?.model).toBe('chaldean')
    // Caldeu não calcula life-path → sem destino corporativo, mas com harmonia.
    expect(chart.results[0]?.corporateDestiny).toBeUndefined()
  })
})
