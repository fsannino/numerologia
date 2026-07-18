import { describe, expect, it } from 'vitest'
import { unwrap } from '@numerus/shared-kernel'
import { BirthName } from '../../value-objects/birth-name'
import { personSubject } from '../../entities/person-subject'
import { pythagoreanModel } from './pythagorean-model'

const subject = personSubject(unwrap(BirthName.create('Maria Silva')))

describe('pythagoreanModel', () => {
  it('calcula a Expressão com a variante default quando nenhuma é pedida', () => {
    const result = pythagoreanModel.calculate(subject, { numbers: ['expression'] })
    const traces = unwrap(result)
    expect(traces).toHaveLength(1)
    expect(traces[0]?.variantSelections['expression-reduction']).toBe('reduce-words-then-sum')
  })

  it('respeita a variante explícita pedida no request', () => {
    const result = pythagoreanModel.calculate(subject, {
      numbers: ['expression'],
      variantSelections: { 'expression-reduction': 'sum-all-then-reduce' },
    })
    expect(unwrap(result)[0]?.finalValue.raw).toBe(42)
  })

  it('rejeita variante desconhecida com erro explícito — nunca um chute', () => {
    const result = pythagoreanModel.calculate(subject, {
      numbers: ['expression'],
      variantSelections: { 'expression-reduction': 'inventada' },
    })
    expect(result).toMatchObject({ ok: false, error: { code: 'unknown-variant', option: 'inventada' } })
  })

  it('rejeita número ainda não suportado com erro explícito', () => {
    const result = pythagoreanModel.calculate(subject, { numbers: ['life-path'] })
    expect(result).toMatchObject({ ok: false, error: { code: 'unsupported-number', number: 'life-path' } })
  })

  it('declara metadados, sujeitos e números suportados', () => {
    expect(pythagoreanModel.supportedSubjects.has('person')).toBe(true)
    expect(pythagoreanModel.supportedNumbers.has('expression')).toBe(true)
    expect(pythagoreanModel.metadata.variantDimensions[0]?.defaultOption).toBe('reduce-words-then-sum')
  })
})
