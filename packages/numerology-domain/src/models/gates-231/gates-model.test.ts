import { describe, expect, it } from 'vitest'
import { unwrap } from '@numerus/shared-kernel'
import { BirthName } from '../../value-objects/birth-name'
import { personSubject } from '../../entities/person-subject'
import { gates231Model } from './gates-model'

const subject = (name: string) => personSubject(unwrap(BirthName.create(name)))

function structure(name: string, variantSelections?: Record<string, string>) {
  const traces = unwrap(
    gates231Model.calculate(subject(name), {
      numbers: ['gates-231-structure'],
      ...(variantSelections ? { variantSelections } : {}),
    }),
  )
  const trace = traces[0]
  if (trace === undefined) throw new Error('sem traço')
  const step = trace.steps.find((s) => s.kind === 'gate-structure')
  if (step?.kind !== 'gate-structure') throw new Error('sem passo gate-structure')
  return { trace, step }
}

describe('gates231Model — fixtures conferidas manualmente', () => {
  // "ABC" transliteração padrão: A→alef(1), B→bet(2), C→kaf(20).
  // distinct-letter-pairs: 3 letras distintas → C(3,2)=3 portões {1,2},{1,20},{2,20}.
  it('ativa C(N,2) portões pelas letras distintas do nome', () => {
    const { trace, step } = structure('ABC')
    expect(step.output.totalGates).toBe(231)
    expect(step.output.activated).toHaveLength(3)
    expect(step.output.mode).toBe('distinct-letter-pairs')
    // escalar estrutural = nº de portões ativados
    expect(trace.finalValue.reduced).toBe(3)
  })

  // adjacent-pairs em "ABC": (alef,bet)={1,2}, (bet,kaf)={2,20} → 2 portões.
  it('modo adjacent-pairs é explícito e muda o resultado', () => {
    const { step } = structure('ABC', { 'gate-activation': 'adjacent-pairs' })
    expect(step.output.mode).toBe('adjacent-pairs')
    expect(step.output.activated).toHaveLength(2)
  })

  it('os portões ativados são pares não-ordenados de letras distintas', () => {
    const { step } = structure('ABC')
    for (const gate of step.output.activated) {
      expect(gate.first.value).toBeLessThan(gate.second.value)
    }
  })

  it('não produz texto interpretativo — só estrutura, valores e referência', () => {
    const { trace } = structure('ABC')
    // a fonte citada é o Sefer Yetzirah; nenhuma nota de "leitura por portão".
    expect(trace.ruleRefs.some((r) => r.id === 'gates-231/sefer-yetzirah')).toBe(true)
    expect(trace.divergenceNotes).toHaveLength(0)
  })

  it('expõe a canonicidade honesta (construção contemporânea, não padronizada)', () => {
    expect(gates231Model.metadata.canonicity).toBe('contemporary-construction')
    expect(gates231Model.metadata.standardization).toBe('unstandardized')
  })

  it('rejeita variante desconhecida com erro tipado', () => {
    expect(
      gates231Model.calculate(subject('Ana'), {
        numbers: ['gates-231-structure'],
        variantSelections: { 'gate-activation': 'triples' },
      }),
    ).toMatchObject({ ok: false, error: { code: 'unknown-variant' } })
  })

  it('rejeita número e sujeito não suportados; sem número pedido retorna vazio', () => {
    expect(gates231Model.calculate(subject('Ana'), { numbers: ['expression'] })).toMatchObject({
      ok: false,
      error: { code: 'unsupported-number', model: 'gates-231' },
    })
    const notPerson = { kind: 'company' } as unknown as Parameters<typeof gates231Model.calculate>[0]
    expect(gates231Model.calculate(notPerson, { numbers: ['gates-231-structure'] })).toMatchObject({
      ok: false,
      error: { code: 'unsupported-subject' },
    })
    expect(gates231Model.calculate(subject('Ana'), { numbers: [] })).toMatchObject({ ok: true, value: [] })
  })

  it('opera só sobre o nome (sem data)', () => {
    const { trace } = structure('Maria')
    expect(trace.model).toBe('gates-231')
    expect(gates231Model.supportedNumbers.has('gates-231-structure')).toBe(true)
  })
})
