import { describe, expect, it } from 'vitest'
import { unwrap } from '@numerus/shared-kernel'
import { LocalDate } from '../../value-objects/local-date'
import { calculateLifePath, calculateMission, calculatePsychic } from './date-numbers'

const date = (iso: string) => unwrap(LocalDate.fromISO(iso))

describe('calculateLifePath — fixtures conferidas manualmente', () => {
  // dia 27→9 · mês 3 · ano 1990→19→10→1 · 9+3+1 = 13 (dívida!) → 4
  it('1990-03-27 → 4 com dívida cármica 13 (reduce-parts-then-sum)', () => {
    const trace = calculateLifePath(date('1990-03-27'), 'reduce-parts-then-sum')
    expect(trace.finalValue).toMatchObject({ raw: 13, reduced: 4, karmicDebt: 13, chain: [13, 4] })
    expect(trace.variantSelections).toEqual({ 'life-path-reduction': 'reduce-parts-then-sum' })
  })

  // 2+7+0+3+1+9+9+0 = 31 → 4: mesmo reduzido, SEM a dívida 13 → divergência registrada
  it('1990-03-27 → 4 sem dívida (sum-all-digits), com nota de divergência', () => {
    const trace = calculateLifePath(date('1990-03-27'), 'sum-all-digits')
    expect(trace.finalValue).toMatchObject({ raw: 31, reduced: 4 })
    expect(trace.finalValue.karmicDebt).toBeUndefined()
    expect(trace.divergenceNotes).toHaveLength(1)
  })

  // dia 29→11 (mestre) · mês 11 (mestre) · ano 1975: 1+9+7+5=22 (mestre) · 11+11+22 = 44 → 8
  it('1975-11-29 preserva mestres nas três partes (reduce-parts-then-sum)', () => {
    const trace = calculateLifePath(date('1975-11-29'), 'reduce-parts-then-sum')
    expect(trace.finalValue).toMatchObject({ raw: 44, reduced: 8, chain: [44, 8] })
    const partReductions = trace.steps.filter((step) => step.kind === 'reduction')
    expect(partReductions[0]?.output.value.reduced).toBe(11)
    expect(partReductions[1]?.output.value.reduced).toBe(11)
    expect(partReductions[2]?.output.value.reduced).toBe(22)
  })

  it('todo traço registra regras citáveis e versão do engine', () => {
    const trace = calculateLifePath(date('1990-03-27'), 'reduce-parts-then-sum')
    expect(trace.ruleRefs.map((rule) => rule.id)).toContain('pythagorean/life-path')
    expect(trace.engineVersion).toMatch(/^\d+\.\d+\.\d+$/)
  })
})

describe('calculatePsychic — fixtures conferidas manualmente', () => {
  it('dia 29 → 11 (mestre preservado)', () => {
    const trace = calculatePsychic(date('1975-11-29'))
    expect(trace.finalValue).toMatchObject({ raw: 29, reduced: 11, chain: [29, 11], isMaster: true })
  })

  it('dia 19 → 1 com dívida cármica 19', () => {
    const trace = calculatePsychic(date('2000-05-19'))
    expect(trace.finalValue).toMatchObject({ raw: 19, reduced: 1, karmicDebt: 19 })
  })

  it('dia de um dígito não reduz', () => {
    expect(calculatePsychic(date('2000-05-07')).finalValue).toMatchObject({ raw: 7, reduced: 7, chain: [7] })
  })
})

describe('calculateMission — fixture conferida manualmente', () => {
  // Expressão 6 (Maria Silva) + Destino 4 (1990-03-27) = 10 → 1
  it('soma Expressão e Destino reduzidos e reduz o total', () => {
    const expression = { raw: 15, reduced: 6, chain: [15, 6], isMaster: false } as const
    const lifePath = { raw: 13, reduced: 4, chain: [13, 4], isMaster: false, karmicDebt: 13 } as const
    const trace = calculateMission(expression, lifePath, { 'name-reduction': 'reduce-words-then-sum' })
    expect(trace.finalValue).toMatchObject({ raw: 10, reduced: 1, chain: [10, 1] })
    expect(trace.resultId).toBe('mission')
    expect(trace.variantSelections).toEqual({ 'name-reduction': 'reduce-words-then-sum' })
  })

  // 11 + 22 = 33 → mestre: a Missão pode ser mestre e não reduz
  it('preserva mestre no resultado da soma', () => {
    const expression = { raw: 29, reduced: 11, chain: [29, 11], isMaster: true } as const
    const lifePath = { raw: 22, reduced: 22, chain: [22], isMaster: true } as const
    const trace = calculateMission(expression, lifePath, {})
    expect(trace.finalValue).toMatchObject({ raw: 33, reduced: 33, isMaster: true, chain: [33] })
  })
})
