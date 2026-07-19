import fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import { unwrap } from '@numerus/shared-kernel'
import { BirthName } from '../../value-objects/birth-name'
import { personSubject } from '../../entities/person-subject'
import type { CalculationTrace, KabbalisticReading } from '../../trace/calculation-trace'
import { kabbalisticModel } from './kabbalistic-model'

const subject = (name: string) => personSubject(unwrap(BirthName.create(name)))

function trace(name: string): CalculationTrace {
  const traces = unwrap(kabbalisticModel.calculate(subject(name), { numbers: ['kabbalistic-name'] }))
  const first = traces[0]
  if (first === undefined) throw new Error('sem traço')
  return first
}

function readingsOf(t: CalculationTrace): ReadonlyArray<KabbalisticReading> {
  const step = t.steps.find((s) => s.kind === 'reading-matrix')
  if (step?.kind !== 'reading-matrix') throw new Error('sem passo reading-matrix')
  return step.output.readings
}

function reading(t: CalculationTrace, table: string, reduction: string): KabbalisticReading {
  const found = readingsOf(t).find((r) => r.table === table && r.reduction === reduction)
  if (found === undefined) throw new Error(`sem leitura ${table} · ${reduction}`)
  return found
}

describe('kabbalisticModel — fixtures conferidas manualmente', () => {
  // FABIANO SANNINO
  // Pitagórica: FABIANO 6+1+2+9+1+5+6=30, SANNINO 1+1+5+5+9+5+6=32 → total 62
  //   decimal 6+2=8 · arcano ((62-1)%22)+1=18
  // Caldaica: FABIANO 8+1+2+1+1+5+7=25, SANNINO 3+1+5+5+1+5+7=27 → total 52
  //   decimal 5+2=7 · arcano ((52-1)%22)+1=8
  it('produz as 4 leituras da Matriz com os totais e reduções corretos', () => {
    const t = trace('FABIANO SANNINO')
    expect(reading(t, 'sequential-1-9', 'decimal')).toMatchObject({ rawTotal: 62, value: 8 })
    expect(reading(t, 'sequential-1-9', 'modular-22')).toMatchObject({ rawTotal: 62, value: 18 })
    expect(reading(t, 'chaldean-like-1-8', 'decimal')).toMatchObject({ rawTotal: 52, value: 7 })
    expect(reading(t, 'chaldean-like-1-8', 'modular-22')).toMatchObject({ rawTotal: 52, value: 8 })
  })

  it('o escalar do card é o nº de valores distintos entre as leituras', () => {
    // valores {8, 18, 7, 8} → distintos {8, 18, 7} = 3
    const t = trace('FABIANO SANNINO')
    expect(t.finalValue.reduced).toBe(3)
  })

  it('detecta coincidência com pitagórica e caldaica (proveniência provada)', () => {
    const t = trace('FABIANO SANNINO')
    expect(reading(t, 'sequential-1-9', 'decimal').coincidesWith).toBe('pythagorean')
    expect(reading(t, 'chaldean-like-1-8', 'decimal').coincidesWith).toBe('chaldean')
    // o arcano é próprio da cabalística — nunca coincide.
    expect(reading(t, 'sequential-1-9', 'modular-22').coincidesWith).toBeUndefined()
    // e a coincidência vira nota de divergência (feature, §2.4/§9).
    expect(t.divergenceNotes.length).toBe(2)
  })

  // "RRRA A": pitagórica soma-tudo = 9+9+9+1+1 = 29 → decimal preserva mestre → 11.
  // Já a Expressão pitagórica (reduz palavra a palavra) = RRRA(28→1) + A(1) = 2.
  // 11 ≠ 2 → a leitura NÃO coincide (soma-tudo × redução por palavra divergem).
  it('não marca coincidência quando os métodos divergem de fato', () => {
    const t = trace('RRRA A')
    expect(reading(t, 'sequential-1-9', 'decimal').value).toBe(11)
    expect(reading(t, 'sequential-1-9', 'decimal').coincidesWith).toBeUndefined()
  })

  it('rejeita número não suportado com erro tipado', () => {
    expect(kabbalisticModel.calculate(subject('Ana'), { numbers: ['expression'] })).toMatchObject({
      ok: false,
      error: { code: 'unsupported-number', number: 'expression', model: 'kabbalistic' },
    })
  })

  it('rejeita sujeito não suportado com erro tipado', () => {
    const notPerson = { kind: 'company' } as unknown as Parameters<typeof kabbalisticModel.calculate>[0]
    expect(kabbalisticModel.calculate(notPerson, { numbers: ['kabbalistic-name'] })).toMatchObject({
      ok: false,
      error: { code: 'unsupported-subject', model: 'kabbalistic' },
    })
  })

  it('sem o número pedido retorna lista vazia', () => {
    expect(kabbalisticModel.calculate(subject('Ana'), { numbers: [] })).toMatchObject({ ok: true, value: [] })
  })

  it('opera só sobre o nome — não exige data de nascimento', () => {
    // Sem data, ainda calcula (a data não entra na cabalística).
    expect(unwrap(kabbalisticModel.calculate(subject('Ana'), { numbers: ['kabbalistic-name'] }))).toHaveLength(1)
    expect(kabbalisticModel.supportedNumbers.has('kabbalistic-name')).toBe(true)
    expect(kabbalisticModel.metadata.standardization).toBe('unstandardized')
  })
})

describe('kabbalisticModel — propriedades', () => {
  const anyName = fc
    .stringMatching(/^[A-Za-z]{1,10}( [A-Za-z]{1,10}){0,2}$/)
    .filter((s) => /[A-Za-z]/.test(s))

  it('toda Matriz tem 4 leituras válidas, traço e escalar coerente', () => {
    fc.assert(
      fc.property(anyName, (name) => {
        const created = BirthName.create(name)
        if (!created.ok) return
        const traces = unwrap(kabbalisticModel.calculate(personSubject(created.value), { numbers: ['kabbalistic-name'] }))
        const t = traces[0]
        if (t === undefined) return
        expect(t.steps.length).toBeGreaterThan(0)
        const readings = readingsOf(t)
        expect(readings).toHaveLength(4)
        for (const r of readings) {
          if (r.reduction === 'modular-22') {
            expect(r.value).toBeGreaterThanOrEqual(1)
            expect(r.value).toBeLessThanOrEqual(22)
          } else {
            // decimal: 1–9 ou um mestre (11/22/33)
            expect(r.value >= 1 && (r.value <= 9 || r.value === 11 || r.value === 22 || r.value === 33)).toBe(true)
          }
        }
        // o escalar é o nº de valores distintos (1–4, nunca precisa reduzir)
        const distinct = new Set(readings.map((r) => r.value)).size
        expect(t.finalValue.reduced).toBe(distinct)
      }),
    )
  })
})
