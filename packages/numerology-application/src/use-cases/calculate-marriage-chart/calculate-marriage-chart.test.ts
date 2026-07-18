import { describe, expect, it } from 'vitest'
import { unwrap } from '@numerus/shared-kernel'
import { calculateMarriageChart } from './calculate-marriage-chart.handler'

const couple = {
  personA: { fullName: 'Maria Silva', birthDate: '1990-03-27' },
  personB: { fullName: 'Joao Silva', birthDate: '1988-07-14' },
}

describe('calculateMarriageChart', () => {
  it('calcula o número regente da data do casamento e os números da união', () => {
    const chart = unwrap(
      calculateMarriageChart({
        ...couple,
        weddingDate: '2015-06-20',
        models: ['pythagorean'],
        referenceDate: '2026-07-18',
      }),
    )
    // 2015-06-20 → 16 (dívida) → 7
    expect(chart.governingNumber).toMatchObject({
      resultId: 'marriage-governing',
      finalValue: { raw: 16, reduced: 7, karmicDebt: 16 },
    })
    expect(chart.marriagePersonalYear?.resultId).toBe('marriage-personal-year')
    expect(chart.synastry.results[0]?.unionNumbers.length).toBeGreaterThan(0)
    expect(chart.personAName).toBe('Maria Silva')
  })

  it('omite o Ano Pessoal do casamento se a referência é anterior ao casamento', () => {
    const chart = unwrap(
      calculateMarriageChart({
        ...couple,
        weddingDate: '2015-06-20',
        models: ['pythagorean'],
        referenceDate: '2010-01-01',
      }),
    )
    expect(chart.governingNumber).toBeDefined()
    expect(chart.marriagePersonalYear).toBeUndefined()
  })

  it('rejeita data de casamento malformada com erro explícito', () => {
    const result = calculateMarriageChart({
      ...couple,
      weddingDate: '20/06/2015',
      models: ['pythagorean'],
    })
    expect(result).toMatchObject({ ok: false, error: { code: 'invalid-wedding-date', cause: { code: 'malformed-date' } } })
  })

  it('propaga erro de nome inválido no casal', () => {
    const result = calculateMarriageChart({
      personA: { fullName: 'Maria' },
      personB: { fullName: '  ' },
      weddingDate: '2015-06-20',
      models: ['pythagorean'],
    })
    expect(result).toMatchObject({ ok: false, error: { code: 'invalid-couple' } })
  })

  it('respeita a variante de redução do Destino no número regente', () => {
    // sum-all-digits: 2+0+0+6+2+0+1+5 = 16 → 7 (mesmo reduzido, mas sem preservar dívida em partes)
    const chart = unwrap(
      calculateMarriageChart({
        ...couple,
        weddingDate: '2015-06-20',
        models: ['pythagorean'],
        variantSelections: { 'life-path-reduction': 'sum-all-digits' },
      }),
    )
    expect(chart.governingNumber.variantSelections['life-path-reduction']).toBe('sum-all-digits')
  })
})
