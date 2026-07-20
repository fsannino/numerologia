import { describe, expect, it } from 'vitest'
import { unwrap } from '@numerus/shared-kernel'
import { calculateEventChart } from './calculate-event-chart.handler'

describe('calculateEventChart', () => {
  it('calcula a vibração do evento (Caminho de Vida da data)', () => {
    // 2026-07-20 reduz-partes: dia 20→2, mês 7→7, ano 2026→10→1; 2+7+1=10→1.
    const chart = unwrap(calculateEventChart({ eventDate: '2026-07-20' }))
    expect(chart.vibration.resultId).toBe('event-vibration')
    expect(chart.vibration.finalValue.reduced).toBe(1)
    // sem data de referência, não há Ano Pessoal do evento.
    expect(chart.personalYear).toBeUndefined()
  })

  it('inclui o Ano Pessoal do evento quando há data de referência', () => {
    const chart = unwrap(
      calculateEventChart({ eventDate: '2020-01-01', referenceDate: '2026-07-20' }),
    )
    expect(chart.personalYear?.resultId).toBe('event-personal-year')
  })

  it('omite o Ano Pessoal se a referência é anterior ao evento (sem erro)', () => {
    const chart = unwrap(
      calculateEventChart({ eventDate: '2030-01-01', referenceDate: '2020-01-01' }),
    )
    expect(chart.personalYear).toBeUndefined()
  })

  it('data de evento inválida vira erro tipado', () => {
    expect(calculateEventChart({ eventDate: '2026-02-30' })).toMatchObject({
      ok: false,
      error: { code: 'invalid-event-date' },
    })
  })

  it('respeita a variante de redução do Caminho de Vida', () => {
    const chart = unwrap(
      calculateEventChart({
        eventDate: '1999-12-31',
        variantSelections: { 'life-path-reduction': 'sum-all-digits' },
      }),
    )
    expect(chart.vibration.variantSelections['life-path-reduction']).toBe('sum-all-digits')
  })
})
