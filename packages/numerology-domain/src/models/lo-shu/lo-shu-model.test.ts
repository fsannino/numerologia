import { describe, expect, it } from 'vitest'
import { unwrap } from '@numerus/shared-kernel'
import { BirthName } from '../../value-objects/birth-name'
import { LocalDate } from '../../value-objects/local-date'
import { personSubject } from '../../entities/person-subject'
import { loShuModel } from './lo-shu-model'

const subject = (iso: string) =>
  personSubject(unwrap(BirthName.create('Maria Silva')), unwrap(LocalDate.fromISO(iso)))

function gridStep(iso: string) {
  const traces = unwrap(loShuModel.calculate(subject(iso), { numbers: ['lo-shu-grid'] }))
  const step = traces[0]?.steps.find((s) => s.kind === 'lo-shu-grid')
  if (step?.kind !== 'lo-shu-grid') throw new Error('sem passo lo-shu-grid')
  return step
}

describe('loShuModel — fixtures conferidas manualmente', () => {
  // 1990-03-27 → dígitos 2,7,3,1,9,9,0 → sem zero: 2,7,3,1,9,9
  it('posiciona os dígitos da data e ignora o zero', () => {
    const step = gridStep('1990-03-27')
    expect(step.input.dateDigits).toEqual([2, 7, 3, 1, 9, 9])
    const countOf = (digit: number) => step.output.tally.find((entry) => entry.digit === digit)?.count ?? 0
    expect(countOf(9)).toBe(2) // repetido
    expect(countOf(2)).toBe(1)
    expect(countOf(5)).toBe(0) // ausente
  })

  // Números presentes: {1,2,3,7,9} → 5 distintos
  it('o escalar final é a quantidade de números distintos presentes', () => {
    const traces = unwrap(loShuModel.calculate(subject('1990-03-27'), { numbers: ['lo-shu-grid'] }))
    expect(traces[0]?.finalValue.reduced).toBe(5)
  })

  // Linha do meio 3-5-7: 5 ausente → não é seta de força. Coluna direita 2-7-6: 6 ausente.
  // Nenhuma linha totalmente presente nesta data; a diagonal 2-5-8 tem 5 e 8 ausentes → seta de ausência? não (2 presente).
  it('detecta setas de ausência (linha totalmente vazia)', () => {
    // 2000-01-01 → dígitos 1,1,2,0,0,0 → sem zero: 1,1,2 → presentes {1,2}
    const step = gridStep('2000-01-01')
    const absences = step.output.arrows.filter((arrow) => arrow.kind === 'absence')
    // linha superior 4-9-2: 4,9 ausentes mas 2 presente → não. coluna esquerda 4-3-8: todos ausentes → ausência.
    expect(absences.some((arrow) => arrow.line.join('') === '438')).toBe(true)
  })

  it('detecta seta de força (linha totalmente presente)', () => {
    // 1949-02-24 → dígitos 2,4,2,1,9,4,9 → presentes {1,2,4,9}
    // linha superior 4-9-2: 4,9,2 todos presentes → força.
    const step = gridStep('1949-02-24')
    const strengths = step.output.arrows.filter((arrow) => arrow.kind === 'strength')
    expect(strengths.some((arrow) => arrow.line.join('') === '492')).toBe(true)
  })

  it('exige data de nascimento com erro explícito', () => {
    const noDate = personSubject(unwrap(BirthName.create('Maria Silva')))
    expect(loShuModel.calculate(noDate, { numbers: ['lo-shu-grid'] })).toMatchObject({
      ok: false,
      error: { code: 'missing-birth-date' },
    })
  })

  it('declara metadados e o número suportado', () => {
    expect(loShuModel.supportedNumbers.has('lo-shu-grid')).toBe(true)
    expect(loShuModel.metadata.variantDimensions).toEqual([])
  })
})
