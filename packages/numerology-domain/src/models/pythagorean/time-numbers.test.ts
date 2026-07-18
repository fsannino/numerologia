import { describe, expect, it } from 'vitest'
import { unwrap } from '@numerus/shared-kernel'
import { LocalDate } from '../../value-objects/local-date'
import {
  ageAt,
  calculateChallenges,
  calculateLifeCycles,
  calculatePersonalTime,
  calculatePinnacles,
} from './time-numbers'

const date = (iso: string) => unwrap(LocalDate.fromISO(iso))
const BIRTH = date('1990-03-27') // Caminho de Vida 4 → fronteira base 36−4 = 32
const REFERENCE = date('2026-07-18') // idade 36 na referência

describe('ageAt', () => {
  it('conta anos civis completos, descontando aniversário não atingido', () => {
    expect(unwrap(ageAt(BIRTH, date('2026-03-26')))).toBe(35)
    expect(unwrap(ageAt(BIRTH, date('2026-03-27')))).toBe(36)
    expect(unwrap(ageAt(BIRTH, REFERENCE))).toBe(36)
  })

  it('referência anterior ao nascimento é erro explícito', () => {
    expect(ageAt(BIRTH, date('1980-01-01'))).toMatchObject({ ok: false, error: { code: 'reference-before-birth-date' } })
  })
})

describe('calculateLifeCycles — fixture conferida manualmente', () => {
  // c1 = mês 3 → 3 [0,32) · c2 = dia 27 → 9 [32,59) · c3 = 1990 → 1 [59,∞) · idade 36 → c2 vigente
  it('1990-03-27 em 2026: ciclo vigente é o 2º (produtivo) = 9', () => {
    const trace = unwrap(calculateLifeCycles(BIRTH, REFERENCE, 'reduce-parts-then-sum'))
    expect(trace.finalValue.reduced).toBe(9)
    const timeline = trace.steps.find((step) => step.kind === 'timeline')
    if (timeline?.kind !== 'timeline') throw new Error('sem timeline')
    expect(timeline.input.ageAtReference).toBe(36)
    expect(timeline.output.segments.map((segment) => segment.value.reduced)).toEqual([3, 9, 1])
    expect(timeline.output.segments.map((segment) => segment.isCurrent)).toEqual([false, true, false])
    expect(timeline.output.segments[0]).toMatchObject({ fromAge: 0, toAge: 32 })
    expect(timeline.output.segments[1]).toMatchObject({ fromAge: 32, toAge: 59 })
    expect(timeline.output.segments[2]?.toAge).toBeUndefined()
  })

  // mês 11 → mestre 11 preservado no valor do ciclo
  it('1975-11-29: 1º ciclo é o mestre 11 e está vigente aos 24 anos', () => {
    const trace = unwrap(calculateLifeCycles(date('1975-11-29'), date('2000-01-01'), 'reduce-parts-then-sum'))
    expect(trace.finalValue).toMatchObject({ reduced: 11, isMaster: true })
  })
})

describe('calculatePinnacles — fixture conferida manualmente', () => {
  // dia→9, mês→3, ano→1 · P1 = 12→3 · P2 = 10→1 · P3 = 3+1 = 4 · P4 = 3+1 = 4
  // janelas [0,32) [32,41) [41,50) [50,∞) · idade 36 → P2 vigente = 1
  it('1990-03-27 em 2026: pináculo vigente é P2 = 1', () => {
    const trace = unwrap(calculatePinnacles(BIRTH, REFERENCE, 'reduce-parts-then-sum'))
    expect(trace.finalValue.reduced).toBe(1)
    const timeline = trace.steps.find((step) => step.kind === 'timeline')
    if (timeline?.kind !== 'timeline') throw new Error('sem timeline')
    expect(timeline.output.segments.map((segment) => segment.value.reduced)).toEqual([3, 1, 4, 4])
    expect(timeline.output.segments[1]).toMatchObject({ fromAge: 32, toAge: 41, isCurrent: true })
  })
})

describe('calculateChallenges — fixture conferida manualmente', () => {
  // D1 = |3−9| = 6 · D2 = |9−1| = 8 · D3 = |6−8| = 2 · D4 = |3−1| = 2 · idade 36 → D2 vigente = 8
  it('1990-03-27 em 2026: desafio vigente é D2 = 8', () => {
    const trace = unwrap(calculateChallenges(BIRTH, REFERENCE, 'reduce-parts-then-sum'))
    expect(trace.finalValue.reduced).toBe(8)
    const timeline = trace.steps.find((step) => step.kind === 'timeline')
    if (timeline?.kind !== 'timeline') throw new Error('sem timeline')
    expect(timeline.output.segments.map((segment) => segment.value.reduced)).toEqual([6, 8, 2, 2])
  })

  it('desafio 0 é resultado válido (nascimento com componentes iguais)', () => {
    // 2001-01-01: dia→1, mês→1, ano 2001→3 · D1 = |1−1| = 0
    const trace = unwrap(calculateChallenges(date('2001-01-01'), date('2005-01-01'), 'reduce-parts-then-sum'))
    const timeline = trace.steps.find((step) => step.kind === 'timeline')
    if (timeline?.kind !== 'timeline') throw new Error('sem timeline')
    expect(timeline.output.segments[0]?.value.reduced).toBe(0)
  })
})

describe('calculatePersonalTime — fixtures conferidas manualmente', () => {
  // dia 27→9 + mês 3→3 + ano 2026→10→1 · 9+3+1 = 13 (dívida!) → 4
  it('Ano Pessoal 2026 de 1990-03-27 → 4 com dívida cármica 13', () => {
    const trace = unwrap(calculatePersonalTime('personal-year', BIRTH, REFERENCE))
    expect(trace.finalValue).toMatchObject({ raw: 13, reduced: 4, karmicDebt: 13 })
  })

  // Mês Pessoal julho: 4+7 = 11 → 2 (totalmente reduzido — ADR-0007)
  it('Mês Pessoal 07/2026 → 2, com 11 totalmente reduzido', () => {
    const trace = unwrap(calculatePersonalTime('personal-month', BIRTH, REFERENCE))
    expect(trace.finalValue).toMatchObject({ raw: 11, reduced: 2, isMaster: false })
  })

  // Dia Pessoal 18/07: dia ref 18→9 · 2+9 = 11 → 2
  it('Dia Pessoal 2026-07-18 → 2', () => {
    const trace = unwrap(calculatePersonalTime('personal-day', BIRTH, REFERENCE))
    expect(trace.finalValue.reduced).toBe(2)
  })

  it('propaga referência anterior ao nascimento', () => {
    expect(calculatePersonalTime('personal-year', BIRTH, date('1980-01-01'))).toMatchObject({
      ok: false,
      error: { code: 'reference-before-birth-date' },
    })
  })
})
