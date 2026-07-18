import { describe, expect, it } from 'vitest'
import fc from 'fast-check'
import { unwrap } from '@numerus/shared-kernel'
import { BirthName } from '../../value-objects/birth-name'
import { calculateChaldeanNameNumber } from './name-numbers'
import { chaldeanValueOf } from './letter-table'

const name = (raw: string) => unwrap(BirthName.create(raw))

// MARIA = M4+A1+R2+I1+A1 = 9 · SILVA = S3+I1+L3+V6+A1 = 14 · composto 23 → 5
describe('números do nome caldeus — fixtures conferidas manualmente', () => {
  it('Expressão de Maria Silva: composto 23 → 5', () => {
    const trace = calculateChaldeanNameNumber(name('Maria Silva'), 'expression', 'y-by-context')
    expect(trace.finalValue).toMatchObject({ raw: 23, reduced: 5, chain: [23, 5], isMaster: false })
    expect(trace.model).toBe('chaldean')
    // O composto aparece como passo de primeira classe.
    const compound = trace.steps.find((step) => step.kind === 'sum')
    expect(compound?.output).toEqual({ total: 23 })
  })

  // Vogais: A,I,A (1+1+1) + I,A (1+1) = 5
  it('Motivação de Maria Silva → 5', () => {
    const trace = calculateChaldeanNameNumber(name('Maria Silva'), 'motivation', 'y-by-context')
    expect(trace.finalValue).toMatchObject({ raw: 5, reduced: 5 })
    expect(trace.variantSelections).toEqual({ 'y-classification': 'y-by-context' })
  })

  // Consoantes: M,R (4+2) + S,L,V (3+3+6) = 18 → 9 (9 pode ser SOMA, só não é valor de letra)
  it('Impressão de Maria Silva: composto 18 → 9', () => {
    const trace = calculateChaldeanNameNumber(name('Maria Silva'), 'impression', 'y-by-context')
    expect(trace.finalValue).toMatchObject({ raw: 18, reduced: 9 })
  })

  it('Número Chave de Maria Silva usa só o primeiro nome → 9', () => {
    const trace = calculateChaldeanNameNumber(name('Maria Silva'), 'key-number', 'y-by-context')
    expect(trace.finalValue).toMatchObject({ raw: 9, reduced: 9 })
  })

  // O = 7, D = 4 → composto 11: a escola NÃO preserva mestres — reduz para 2
  it('não preserva números mestres: composto 11 → 2', () => {
    const trace = calculateChaldeanNameNumber(name('Od'), 'expression', 'y-by-context')
    expect(trace.finalValue).toMatchObject({ raw: 11, reduced: 2, isMaster: false })
    expect(trace.ruleRefs.map((rule) => rule.id)).toContain('chaldean/no-master-preservation')
  })

  it('nenhuma letra da tabela caldaica vale 9', () => {
    for (const letter of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
      expect(chaldeanValueOf(letter)).toBeGreaterThanOrEqual(1)
      expect(chaldeanValueOf(letter)).toBeLessThanOrEqual(8)
    }
  })

  it('propriedade: vogais + consoantes = composto da Expressão', () => {
    const nameArb = fc
      .array(fc.stringMatching(/^[A-Z]{1,10}$/), { minLength: 1, maxLength: 4 })
      .map((words) => words.join(' '))
    fc.assert(
      fc.property(nameArb, (rawName) => {
        const birthName = name(rawName)
        const motivation = calculateChaldeanNameNumber(birthName, 'motivation', 'y-by-context')
        const impression = calculateChaldeanNameNumber(birthName, 'impression', 'y-by-context')
        const expression = calculateChaldeanNameNumber(birthName, 'expression', 'y-by-context')
        return motivation.finalValue.raw + impression.finalValue.raw === expression.finalValue.raw
      }),
    )
  })
})
