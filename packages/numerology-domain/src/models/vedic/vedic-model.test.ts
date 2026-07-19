import fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import { unwrap } from '@numerus/shared-kernel'
import { BirthName } from '../../value-objects/birth-name'
import { LocalDate } from '../../value-objects/local-date'
import { personSubject } from '../../entities/person-subject'
import type { CalculationTrace } from '../../trace/calculation-trace'
import { vedicModel } from './vedic-model'
import { VEDIC_PLANETS, planetOf } from './planets'

const subject = (iso: string) =>
  personSubject(unwrap(BirthName.create('Maria Silva')), unwrap(LocalDate.fromISO(iso)))

function traceFor(iso: string, kind: 'vedic-moolank' | 'vedic-bhagyank'): CalculationTrace {
  const traces = unwrap(vedicModel.calculate(subject(iso), { numbers: [kind] }))
  const trace = traces[0]
  if (trace === undefined) throw new Error('sem traço')
  return trace
}

function planetStep(trace: CalculationTrace) {
  const step = trace.steps.find((s) => s.kind === 'planetary-ruler')
  if (step?.kind !== 'planetary-ruler') throw new Error('sem passo planetary-ruler')
  return step
}

describe('vedicModel — fixtures conferidas manualmente', () => {
  // Moolank = dia reduzido. Dia 15 → 1+5 = 6 → Vênus (Shukra).
  it('Moolank reduz o dia do nascimento à raiz e aponta o planeta regente', () => {
    const trace = traceFor('1990-05-15', 'vedic-moolank')
    expect(trace.finalValue.reduced).toBe(6)
    expect(trace.finalValue.isMaster).toBe(false)
    expect(planetStep(trace).output.sanskrit).toBe('Shukra')
    expect(planetStep(trace).output.symbol).toBe('♀')
  })

  // Dia 29 → 2+9 = 11 → 1+1 = 2 → Lua (Chandra). Sem preservar mestres.
  // Com preservação (pitagórica) pararia em 11 → registra divergência (§2.4).
  it('Moolank não preserva mestres e registra a divergência quando ela existe', () => {
    const trace = traceFor('1990-11-29', 'vedic-moolank')
    expect(trace.finalValue.reduced).toBe(2)
    expect(planetStep(trace).output.sanskrit).toBe('Chandra')
    expect(trace.divergenceNotes).toHaveLength(1)
    expect(trace.divergenceNotes[0]?.id).toBe('vedic/moolank-masterless')
  })

  // Dia 4 → 4 → Rahu, sem divergência (4 não vira mestre).
  it('Moolank sem mestre não gera nota de divergência', () => {
    const trace = traceFor('1990-05-04', 'vedic-moolank')
    expect(trace.finalValue.reduced).toBe(4)
    expect(planetStep(trace).output.sanskrit).toBe('Rahu')
    expect(trace.divergenceNotes).toHaveLength(0)
  })

  // Bhagyank = soma de todos os dígitos, reduzida.
  // 1990-11-29 → 2+9+1+1+1+9+9+0 = 32 → 3+2 = 5 → Mercúrio (Budha).
  it('Bhagyank soma todos os dígitos da data e reduz à raiz', () => {
    const trace = traceFor('1990-11-29', 'vedic-bhagyank')
    const sumStep = trace.steps.find((s) => s.kind === 'sum')
    if (sumStep?.kind !== 'sum') throw new Error('sem passo de soma')
    expect(sumStep.output.total).toBe(32)
    expect(trace.finalValue.reduced).toBe(5)
    expect(planetStep(trace).output.sanskrit).toBe('Budha')
    expect(trace.divergenceNotes).toHaveLength(0)
  })

  // 1995-12-29 → 2+9+1+2+1+9+9+5 = 38 → 3+8 = 11 → 1+1 = 2 → Lua.
  // 38 preservando mestres pararia em 11 → divergência registrada.
  it('Bhagyank registra a divergência de mestre quando o total reduz a um mestre', () => {
    const trace = traceFor('1995-12-29', 'vedic-bhagyank')
    expect(trace.finalValue.reduced).toBe(2)
    expect(trace.finalValue.isMaster).toBe(false)
    expect(trace.divergenceNotes[0]?.id).toBe('vedic/bhagyank-masterless')
  })

  it('exige data de nascimento com erro tipado (escola derivada de data)', () => {
    const noDate = personSubject(unwrap(BirthName.create('Maria Silva')))
    expect(vedicModel.calculate(noDate, { numbers: ['vedic-moolank'] })).toMatchObject({
      ok: false,
      error: { code: 'missing-birth-date' },
    })
  })

  it('rejeita número não suportado com erro tipado', () => {
    expect(vedicModel.calculate(subject('1990-11-29'), { numbers: ['expression'] })).toMatchObject({
      ok: false,
      error: { code: 'unsupported-number', number: 'expression', model: 'vedic' },
    })
  })

  it('rejeita sujeito não suportado com erro tipado', () => {
    const notPerson = { kind: 'couple' } as unknown as Parameters<typeof vedicModel.calculate>[0]
    expect(vedicModel.calculate(notPerson, { numbers: ['vedic-moolank'] })).toMatchObject({
      ok: false,
      error: { code: 'unsupported-subject', model: 'vedic' },
    })
  })

  it('sem números pedidos retorna lista vazia', () => {
    expect(vedicModel.calculate(subject('1990-11-29'), { numbers: [] })).toMatchObject({ ok: true, value: [] })
  })

  it('calcula Moolank e Bhagyank juntos, cada um com seu traço', () => {
    const traces = unwrap(
      vedicModel.calculate(subject('1990-11-29'), { numbers: ['vedic-moolank', 'vedic-bhagyank'] }),
    )
    expect(traces.map((t) => t.resultId)).toEqual(['vedic-moolank', 'vedic-bhagyank'])
  })

  it('a tabela de planetas cobre exatamente os dígitos 1–9', () => {
    expect(Object.keys(VEDIC_PLANETS).map(Number).sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9])
  })

  it('planetOf rejeita dígito fora de 1–9', () => {
    expect(() => planetOf(0)).toThrow(RangeError)
  })
})

describe('vedicModel — propriedades', () => {
  const anyDate = fc
    .record({
      year: fc.integer({ min: 1, max: 9999 }),
      month: fc.integer({ min: 1, max: 12 }),
      day: fc.integer({ min: 1, max: 28 }),
    })
    .map(({ year, month, day }) => unwrap(LocalDate.create(year, month, day)))

  it('todo número védico tem traço, raiz 1–9 (nunca mestre) e planeta coerente', () => {
    fc.assert(
      fc.property(anyDate, fc.constantFrom('vedic-moolank' as const, 'vedic-bhagyank' as const), (date, kind) => {
        const traces = unwrap(vedicModel.calculate(personSubject(unwrap(BirthName.create('Ana')), date), { numbers: [kind] }))
        const trace = traces[0]
        expect(trace).toBeDefined()
        if (trace === undefined) return
        // Invariante do produto: nunca um número sem traço.
        expect(trace.steps.length).toBeGreaterThan(0)
        expect(trace.finalValue.reduced).toBeGreaterThanOrEqual(1)
        expect(trace.finalValue.reduced).toBeLessThanOrEqual(9)
        expect(trace.finalValue.isMaster).toBe(false)
        const step = trace.steps.find((s) => s.kind === 'planetary-ruler')
        if (step?.kind !== 'planetary-ruler') throw new Error('sem passo planetary-ruler')
        expect(step.output.sanskrit).toBe(planetOf(trace.finalValue.reduced).sanskrit)
      }),
    )
  })
})
