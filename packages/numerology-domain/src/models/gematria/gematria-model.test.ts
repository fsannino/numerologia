import { describe, expect, it } from 'vitest'
import { unwrap } from '@numerus/shared-kernel'
import { BirthName } from '../../value-objects/birth-name'
import { personSubject } from '../../entities/person-subject'
import { gematriaModel } from './gematria-model'
import { transliterate } from './transliteration'

const subject = (name: string) => personSubject(unwrap(BirthName.create(name)))

function transliterationStep(name: string) {
  const traces = unwrap(gematriaModel.calculate(subject(name), { numbers: ['gematria-value'] }))
  const step = traces[0]?.steps.find((s) => s.kind === 'transliteration')
  if (step?.kind !== 'transliteration') throw new Error('sem passo de transliteração')
  return { trace: traces[0]!, step }
}

describe('transliterate — fixtures conferidas manualmente', () => {
  // DAVI = D(4) + A(1/70) + V(6) + I(10). padrão: 4+1+6+10 = 21. min: 4+1+6+10=21. max: 4+70+6+10=90.
  it('expõe candidatas por letra e os totais representativos', () => {
    const result = transliterate([...'DAVI'])
    expect(result.standardTotal).toBe(21)
    expect(result.minTotal).toBe(21)
    expect(result.maxTotal).toBe(90) // A → ayin(70)
    expect(result.combinationCount).toBe(2) // só o A é ambíguo
    // A letra A traz as duas candidatas.
    const aLetter = result.letters.find((letter) => letter.latin === 'A')
    expect(aLetter?.options.map((option) => option.value)).toEqual([1, 70])
  })

  it('conta as combinações como produto das opções por letra', () => {
    // ST: S(2 opções) × T(2 opções) = 4
    expect(transliterate([...'ST']).combinationCount).toBe(4)
  })
})

describe('gematriaModel', () => {
  it('produz um valor pela transliteração padrão e expõe a ambiguidade', () => {
    const { trace, step } = transliterationStep('Davi')
    // standardTotal 21 → 3
    expect(trace.finalValue).toMatchObject({ raw: 21, reduced: 3 })
    expect(step.output.combinationCount).toBe(2)
    expect(step.output.standardHebrew.length).toBeGreaterThan(0)
  })

  it('registra a divergência do espectro quando há ambiguidade', () => {
    const { trace } = transliterationStep('Davi')
    expect(trace.divergenceNotes).toHaveLength(1)
    expect(trace.divergenceNotes[0]?.id).toBe('gematria/transliteration-spectrum')
    expect(trace.ruleRefs.map((rule) => rule.id)).toContain('gematria/transliteration-reconstruction')
  })

  it('sem ambiguidade (min = máx), não há nota de espectro', () => {
    // BR: B(2) + R(200), ambos sem alternativa
    const { trace } = transliterationStep('Br')
    expect(trace.divergenceNotes).toEqual([])
  })

  it('não exige data de nascimento (é número de nome)', () => {
    const result = gematriaModel.calculate(subject('Maria Silva'), { numbers: ['gematria-value'] })
    expect(result.ok).toBe(true)
  })

  it('declara metadados e o número suportado', () => {
    expect(gematriaModel.supportedNumbers.has('gematria-value')).toBe(true)
  })
})
