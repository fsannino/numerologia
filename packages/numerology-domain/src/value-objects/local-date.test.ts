import { describe, expect, it } from 'vitest'
import { unwrap } from '@numerus/shared-kernel'
import { LocalDate, daysInMonth } from './local-date'

describe('LocalDate (ADR-0005)', () => {
  it('cria datas válidas e faz roundtrip ISO', () => {
    const date = unwrap(LocalDate.create(1990, 3, 27))
    expect(date).toMatchObject({ year: 1990, month: 3, day: 27 })
    expect(date.toISO()).toBe('1990-03-27')
    expect(unwrap(LocalDate.fromISO('1990-03-27')).day).toBe(27)
  })

  it('valida anos bissextos de verdade (regra dos séculos)', () => {
    expect(LocalDate.create(2000, 2, 29).ok).toBe(true)
    expect(LocalDate.create(2024, 2, 29).ok).toBe(true)
    expect(LocalDate.create(1900, 2, 29)).toMatchObject({ ok: false, error: { code: 'date-out-of-range' } })
    expect(daysInMonth(1900, 2)).toBe(28)
  })

  it('rejeita mês, dia ou ano fora do intervalo', () => {
    expect(LocalDate.create(1990, 13, 1).ok).toBe(false)
    expect(LocalDate.create(1990, 4, 31).ok).toBe(false)
    expect(LocalDate.create(1990, 1, 0).ok).toBe(false)
    expect(LocalDate.create(0, 1, 1).ok).toBe(false)
    expect(LocalDate.create(1990.5, 1, 1).ok).toBe(false)
  })

  it('rejeita ISO malformado com erro explícito', () => {
    expect(LocalDate.fromISO('27/03/1990')).toMatchObject({ ok: false, error: { code: 'malformed-date' } })
    expect(LocalDate.fromISO('1990-3-27').ok).toBe(false)
    expect(LocalDate.fromISO('').ok).toBe(false)
  })
})
