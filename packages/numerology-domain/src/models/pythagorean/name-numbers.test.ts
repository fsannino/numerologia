import { describe, expect, it } from 'vitest'
import fc from 'fast-check'
import { unwrap } from '@numerus/shared-kernel'
import { BirthName } from '../../value-objects/birth-name'
import { sumDigits } from '../../value-objects/numerology-value'
import type { NameNumberVariants } from './name-numbers'
import { calculateExpression, calculateNameNumber } from './name-numbers'
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
    expect(trace.variantSelections).toEqual({ 'name-reduction': 'reduce-words-then-sum' })
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

const DEFAULT_VARIANTS: NameNumberVariants = {
  reduction: 'reduce-words-then-sum',
  yClassification: 'y-by-context',
}

describe('calculateNameNumber — Motivação, Impressão e Chave (fixtures conferidas manualmente)', () => {
  // Vogais: MARIA → A,I,A = 1+9+1 = 11 (mestre, não reduz) · SILVA → I,A = 9+1 = 10 → 1 · 11+1 = 12 → 3
  it('Motivação de Maria Silva → 3, com mestre 11 preservado nas vogais de MARIA', () => {
    const trace = calculateNameNumber(name('Maria Silva'), 'motivation', DEFAULT_VARIANTS)
    expect(trace.finalValue).toMatchObject({ raw: 12, reduced: 3 })
    const mariaVowels = trace.steps.find((step) => step.kind === 'reduction' && step.input.raw === 11)
    expect(mariaVowels?.output).toMatchObject({ value: { reduced: 11, isMaster: true } })
    expect(trace.variantSelections).toEqual({
      'name-reduction': 'reduce-words-then-sum',
      'y-classification': 'y-by-context',
    })
  })

  // Consoantes: MARIA → M,R = 4+9 = 13 (dívida!) → 4 · SILVA → S,L,V = 1+3+4 = 8 · 4+8 = 12 → 3
  it('Impressão de Maria Silva → 3, com dívida cármica 13 detectada nas consoantes de MARIA', () => {
    const trace = calculateNameNumber(name('Maria Silva'), 'impression', DEFAULT_VARIANTS)
    expect(trace.finalValue).toMatchObject({ raw: 12, reduced: 3 })
    const karmic = trace.steps.find((step) => step.kind === 'karmic-check')
    expect(karmic?.output).toEqual({ debtsFound: [13] })
  })

  // Chave: só MARIA = 24 → 6
  it('Número Chave de Maria Silva usa apenas o primeiro nome → 6', () => {
    const trace = calculateNameNumber(name('Maria Silva'), 'key-number', DEFAULT_VARIANTS)
    expect(trace.finalValue).toMatchObject({ raw: 24, reduced: 6 })
  })

  // YARA com y-por-contexto: Y é consoante (vizinho A) → vogais A,A = 2; consoantes Y,R = 16 (dívida) → 7
  it('Yara: Y por contexto é consoante; Impressão detecta dívida 16', () => {
    const motivation = calculateNameNumber(name('Yara'), 'motivation', DEFAULT_VARIANTS)
    expect(motivation.finalValue).toMatchObject({ raw: 2, reduced: 2 })
    const impression = calculateNameNumber(name('Yara'), 'impression', DEFAULT_VARIANTS)
    expect(impression.finalValue).toMatchObject({ raw: 16, reduced: 7, karmicDebt: 16 })
  })

  // LYDIA com y-por-contexto: Y é vogal (vizinhos L e D) → vogais Y,I,A = 7+9+1 = 17 → 8
  it('Lydia: Y por contexto é vogal, e a divergência entre variantes do Y é registrada', () => {
    const trace = calculateNameNumber(name('Lydia'), 'motivation', DEFAULT_VARIANTS)
    expect(trace.finalValue).toMatchObject({ raw: 17, reduced: 8 })
    expect(trace.divergenceNotes.some((note) => note.id.includes('y-divergence'))).toBe(true)
  })

  it('propriedade: por palavra, soma das vogais + consoantes = soma total (consistência cruzada, §8 da spec)', () => {
    const wordArb = fc.stringMatching(/^[A-Z]{1,10}$/)
    const yArb = fc.constantFrom('y-by-context' as const, 'y-always-vowel' as const, 'y-always-consonant' as const)
    fc.assert(
      fc.property(wordArb, yArb, (word, yClassification) => {
        const variants: NameNumberVariants = { reduction: 'sum-all-then-reduce', yClassification }
        const motivation = calculateNameNumber(name(word), 'motivation', variants)
        const impression = calculateNameNumber(name(word), 'impression', variants)
        const expression = calculateNameNumber(name(word), 'expression', variants)
        return motivation.finalValue.raw + impression.finalValue.raw === expression.finalValue.raw
      }),
    )
  })
})
