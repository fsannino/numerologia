import { describe, expect, it } from 'vitest'
import { unwrap } from '@numerus/shared-kernel'
import { BirthName } from '../../value-objects/birth-name'
import { LocalDate } from '../../value-objects/local-date'
import { personSubject } from '../../entities/person-subject'
import { pythagoreanModel } from './pythagorean-model'

const subject = personSubject(unwrap(BirthName.create('Maria Silva')))
const subjectWithDate = personSubject(
  unwrap(BirthName.create('Maria Silva')),
  unwrap(LocalDate.create(1990, 3, 27)),
)

describe('pythagoreanModel', () => {
  it('calcula a Expressão com a variante default quando nenhuma é pedida', () => {
    const result = pythagoreanModel.calculate(subject, { numbers: ['expression'] })
    const traces = unwrap(result)
    expect(traces).toHaveLength(1)
    expect(traces[0]?.variantSelections['name-reduction']).toBe('reduce-words-then-sum')
  })

  it('respeita a variante explícita pedida no request', () => {
    const result = pythagoreanModel.calculate(subject, {
      numbers: ['expression'],
      variantSelections: { 'name-reduction': 'sum-all-then-reduce' },
    })
    expect(unwrap(result)[0]?.finalValue.raw).toBe(42)
  })

  it('rejeita variante desconhecida com erro explícito — nunca um chute', () => {
    const result = pythagoreanModel.calculate(subject, {
      numbers: ['expression'],
      variantSelections: { 'name-reduction': 'inventada' },
    })
    expect(result).toMatchObject({ ok: false, error: { code: 'unknown-variant', option: 'inventada' } })
  })

  it('exige data de nascimento para números derivados de data — erro explícito, não cálculo parcial', () => {
    for (const number of ['life-path', 'psychic', 'mission'] as const) {
      const result = pythagoreanModel.calculate(subject, { numbers: [number] })
      expect(result).toMatchObject({ ok: false, error: { code: 'missing-birth-date', number } })
    }
  })

  it('calcula o mapa completo (7 números) quando nome e data estão presentes', () => {
    const result = pythagoreanModel.calculate(subjectWithDate, {
      numbers: ['expression', 'motivation', 'impression', 'key-number', 'life-path', 'psychic', 'mission'],
    })
    const traces = unwrap(result)
    expect(traces.map((trace) => trace.resultId)).toEqual([
      'expression', 'motivation', 'impression', 'key-number', 'life-path', 'psychic', 'mission',
    ])
    // Missão herda as variantes usadas na Expressão e no Destino.
    expect(traces[6]?.variantSelections).toMatchObject({
      'name-reduction': 'reduce-words-then-sum',
      'life-path-reduction': 'reduce-parts-then-sum',
    })
  })

  it('declara metadados, sujeitos e números suportados', () => {
    expect(pythagoreanModel.supportedSubjects.has('person')).toBe(true)
    expect(pythagoreanModel.supportedNumbers.size).toBe(7)
    expect(pythagoreanModel.metadata.variantDimensions.map((dimension) => dimension.dimension)).toEqual([
      'name-reduction', 'y-classification', 'life-path-reduction',
    ])
  })
})
