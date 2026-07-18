import { describe, expect, it } from 'vitest'
import fc from 'fast-check'
import { unwrap } from '@numerus/shared-kernel'
import { BirthName } from '../../value-objects/birth-name'
import { sumDigits } from '../../value-objects/numerology-value'
import { calculateExpression } from './expression'
import { pythagoreanValueOf } from './letter-table'

const name = (raw: string) => unwrap(BirthName.create(raw))

describe('calculateExpression — fixtures conferidas manualmente', () => {
  // MARIA = 4+1+9+9+1 = 24 → 6 · SILVA = 1+9+3+4+1 = 18 → 9 · 6+9 = 15 → 6
  it('Maria Silva → 6 (reduce-words-then-sum)', () => {
    const trace = calculateExpression(name('Maria Silva'), 'reduce-words-then-sum')
    expect(trace.finalValue).toMatchObject({ raw: 15, reduced: 6, chain: [15, 6], isMaster: false })
    expect(trace.finalValue.karmicDebt).toBeUndefined()
  })

  // 24 + 18 = 42 → 6
  it('Maria Silva → 6 (sum-all-then-reduce), sem divergência entre variantes', () => {
    const trace = calculateExpression(name('Maria Silva'), 'sum-all-then-reduce')
    expect(trace.finalValue).toMatchObject({ raw: 42, reduced: 6, chain: [42, 6] })
    expect(trace.divergenceNotes).toEqual([])
  })

  // JOAO = 1+6+1+6 = 14 (dívida) → 5 · SILVA = 18 → 9 · 5+9 = 14 (dívida) → 5
  it('João Silva → 5 com dívida cármica 14 detectada no total bruto', () => {
    const trace = calculateExpression(name('João Silva'), 'reduce-words-then-sum')
    expect(trace.finalValue).toMatchObject({ raw: 14, reduced: 5, karmicDebt: 14 })

    const karmic = trace.steps.find((step) => step.kind === 'karmic-check')
    expect(karmic?.output).toEqual({ debtsFound: [14, 14] })
  })

  // sum-all: 14+18 = 32 → 5. Mesmo reduzido, mas SEM a dívida 14 → divergência registrada.
  it('João Silva diverge entre variantes na dívida cármica, e o traço explica', () => {
    const traceA = calculateExpression(name('João Silva'), 'reduce-words-then-sum')
    const traceB = calculateExpression(name('João Silva'), 'sum-all-then-reduce')
    expect(traceB.finalValue.karmicDebt).toBeUndefined()
    expect(traceA.divergenceNotes).toHaveLength(1)
    expect(traceB.divergenceNotes).toHaveLength(1)
  })

  // ANA = 1+5+1 = 7 · DAVILA = 4+1+4+9+3+1 = 22 (mestre, não reduz) · 7+22 = 29 → 2+9 = 11 (mestre)
  it("Ana D'Ávila → 11 (mestre), com mestre 22 preservado na palavra", () => {
    const trace = calculateExpression(name("Ana D'Ávila"), 'reduce-words-then-sum')
    expect(trace.finalValue).toMatchObject({ raw: 29, reduced: 11, chain: [29, 11], isMaster: true })

    const davilaReduction = trace.steps.find(
      (step) => step.kind === 'reduction' && step.input.raw === 22,
    )
    expect(davilaReduction?.output).toMatchObject({ value: { reduced: 22, isMaster: true } })
  })

  it('registra variante, versão do engine e regras citáveis no traço', () => {
    const trace = calculateExpression(name('Maria Silva'), 'reduce-words-then-sum')
    expect(trace.model).toBe('pythagorean')
    expect(trace.resultId).toBe('expression')
    expect(trace.engineVersion).toMatch(/^\d+\.\d+\.\d+$/)
    expect(trace.variantSelections).toEqual({ 'expression-reduction': 'reduce-words-then-sum' })
    expect(trace.ruleRefs.map((rule) => rule.id)).toContain('pythagorean/letter-table')
  })

  it('o traço começa pela normalização e contém todos os tipos de passo', () => {
    const trace = calculateExpression(name('João Silva'), 'reduce-words-then-sum')
    expect(trace.steps[0]?.kind).toBe('filter')
    const kinds = new Set(trace.steps.map((step) => step.kind))
    expect(kinds).toEqual(new Set(['filter', 'letter-mapping', 'sum', 'reduction', 'master-check', 'karmic-check']))
  })
})

describe('calculateExpression — propriedades', () => {
  const wordArb = fc.stringMatching(/^[A-Z]{1,10}$/)
  const nameArb = fc
    .array(wordArb, { minLength: 1, maxLength: 5 })
    .map((words) => words.join(' '))

  it('na variante sum-all, o total bruto é a soma dos valores de todas as letras', () => {
    fc.assert(
      fc.property(nameArb, (rawName) => {
        const birthName = name(rawName)
        const trace = calculateExpression(birthName, 'sum-all-then-reduce')
        const expected = birthName.allLetters
          .map((letter) => pythagoreanValueOf(letter))
          .reduce((acc, value) => acc + value, 0)
        return trace.finalValue.raw === expected
      }),
    )
  })

  it('a cadeia de redução final é internamente consistente em ambas as variantes', () => {
    fc.assert(
      fc.property(
        nameArb,
        fc.constantFrom('reduce-words-then-sum' as const, 'sum-all-then-reduce' as const),
        (rawName, variant) => {
          const { chain, reduced } = calculateExpression(name(rawName), variant).finalValue
          if (chain[chain.length - 1] !== reduced) return false
          for (let i = 1; i < chain.length; i += 1) {
            if (chain[i] !== sumDigits(chain[i - 1] ?? 0)) return false
          }
          return true
        },
      ),
    )
  })

  it('todo cálculo produz traço com passos — nunca um número sem explicação', () => {
    fc.assert(
      fc.property(nameArb, (rawName) => {
        const trace = calculateExpression(name(rawName), 'reduce-words-then-sum')
        return trace.steps.length >= 4 && trace.ruleRefs.length > 0
      }),
    )
  })
})
