import { describe, expect, it } from 'vitest'
import fc from 'fast-check'
import { unwrap } from '@numerus/shared-kernel'
import { BirthName } from '../../value-objects/birth-name'
import { calculateNameGridNumber } from './name-grid'

const name = (raw: string) => unwrap(BirthName.create(raw))

// Maria Silva → valores [4,1,9,9,1,1,9,3,4,1]:
// 1×4 (A,A,S,A) · 3×1 (L) · 4×2 (M,V) · 9×3 (R,I,I) · ausentes: 2,5,6,7,8
describe('grade do nome — fixtures conferidas manualmente (Maria Silva)', () => {
  it('Lições Cármicas: dígitos ausentes {2,5,6,7,8} → contagem 5', () => {
    const trace = calculateNameGridNumber(name('Maria Silva'), 'karmic-lessons')
    expect(trace.finalValue.reduced).toBe(5)
    const grid = trace.steps.find((step) => step.kind === 'grid-analysis')
    expect(grid?.output.highlighted).toEqual([2, 5, 6, 7, 8])
  })

  it('Tendências Ocultas: dígitos com 3+ repetições {1, 9} → contagem 2', () => {
    const trace = calculateNameGridNumber(name('Maria Silva'), 'hidden-tendencies')
    expect(trace.finalValue.reduced).toBe(2)
    const grid = trace.steps.find((step) => step.kind === 'grid-analysis')
    expect(grid?.output.highlighted).toEqual([1, 9])
    expect(grid?.output.tally.find((entry) => entry.digit === 1)?.count).toBe(4)
    expect(grid?.output.tally.find((entry) => entry.digit === 9)?.count).toBe(3)
  })

  it('Subconsciente: dígitos distintos presentes {1,3,4,9} → 4', () => {
    const trace = calculateNameGridNumber(name('Maria Silva'), 'subconscious')
    expect(trace.finalValue.reduced).toBe(4)
  })

  it('todo traço de grade registra a análise, as regras e nenhuma variante', () => {
    const trace = calculateNameGridNumber(name('Maria Silva'), 'karmic-lessons')
    expect(trace.steps.map((step) => step.kind)).toContain('grid-analysis')
    expect(trace.variantSelections).toEqual({})
    expect(trace.ruleRefs.map((rule) => rule.id)).toContain('pythagorean/karmic-lessons')
  })
})

describe('grade do nome — propriedades', () => {
  const nameArb = fc
    .array(fc.stringMatching(/^[A-Z]{1,10}$/), { minLength: 1, maxLength: 4 })
    .map((words) => words.join(' '))

  it('lições + subconsciente = 9 (partição dos dígitos 1–9)', () => {
    fc.assert(
      fc.property(nameArb, (rawName) => {
        const lessons = calculateNameGridNumber(name(rawName), 'karmic-lessons')
        const subconscious = calculateNameGridNumber(name(rawName), 'subconscious')
        return lessons.finalValue.reduced + subconscious.finalValue.reduced === 9
      }),
    )
  })

  it('a soma das contagens da grade é o número de letras do nome', () => {
    fc.assert(
      fc.property(nameArb, (rawName) => {
        const birthName = name(rawName)
        const trace = calculateNameGridNumber(birthName, 'karmic-lessons')
        const grid = trace.steps.find((step) => step.kind === 'grid-analysis')
        if (grid?.kind !== 'grid-analysis') return false
        const total = grid.output.tally.reduce((acc, entry) => acc + entry.count, 0)
        return total === birthName.allLetters.length
      }),
    )
  })
})
