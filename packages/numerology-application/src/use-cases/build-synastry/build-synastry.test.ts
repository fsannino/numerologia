import { describe, expect, it } from 'vitest'
import { unwrap } from '@numerus/shared-kernel'
import { buildSynastry } from './build-synastry.handler'

describe('buildSynastry', () => {
  it('deriva os números da união do nome (sem data) para ambas as pessoas', () => {
    const synastry = unwrap(
      buildSynastry({
        personA: { fullName: 'Maria Silva' },
        personB: { fullName: 'Joao Silva' },
        models: ['pythagorean'],
      }),
    )
    const kinds = synastry.results[0]?.unionNumbers.map((trace) => trace.resultId) ?? []
    // Sem data: só as uniões de nome (soul, expression, personality, key).
    expect(kinds).toEqual(['union-soul', 'union-expression', 'union-personality', 'union-key'])
    expect(synastry.personAName).toBe('Maria Silva')
    expect(synastry.personBName).toBe('Joao Silva')
  })

  it('com datas, inclui Destino e Missão da União e a comparação de Anos Pessoais', () => {
    const synastry = unwrap(
      buildSynastry({
        personA: { fullName: 'Maria Silva', birthDate: '1990-03-27' },
        personB: { fullName: 'Joao Silva', birthDate: '1988-07-14' },
        models: ['pythagorean'],
        referenceDate: '2026-07-18',
      }),
    )
    const kinds = synastry.results[0]?.unionNumbers.map((trace) => trace.resultId) ?? []
    expect(kinds).toContain('union-destiny')
    expect(kinds).toContain('union-mission')
    expect(synastry.results[0]?.personalYear).toBeDefined()
    expect(synastry.results[0]?.personalYear?.personA.resultId).toBe('personal-year')
  })

  it('marca convergências onde os dois indivíduos já compartilham o número', () => {
    // Maria Silva e Maria Silva → todos os números do nome iguais.
    const synastry = unwrap(
      buildSynastry({
        personA: { fullName: 'Maria Silva' },
        personB: { fullName: 'Maria Silva' },
        models: ['pythagorean'],
      }),
    )
    expect(synastry.results[0]?.convergences).toEqual([
      'union-soul', 'union-expression', 'union-personality', 'union-key',
    ])
  })

  it('a escola caldaica gera uniões apenas dos números que ela suporta', () => {
    const synastry = unwrap(
      buildSynastry({
        personA: { fullName: 'Maria Silva', birthDate: '1990-03-27' },
        personB: { fullName: 'Joao Silva', birthDate: '1988-07-14' },
        models: ['chaldean'],
        referenceDate: '2026-07-18',
      }),
    )
    // Caldeu não calcula life-path/mission/personal-year → só uniões de nome.
    const kinds = synastry.results[0]?.unionNumbers.map((trace) => trace.resultId) ?? []
    expect(kinds).toEqual(['union-soul', 'union-expression', 'union-personality', 'union-key'])
    expect(synastry.results[0]?.personalYear).toBeUndefined()
  })

  it('propaga erro de nome inválido identificando a pessoa', () => {
    const result = buildSynastry({
      personA: { fullName: 'Maria' },
      personB: { fullName: '  ' },
      models: ['pythagorean'],
    })
    expect(result).toMatchObject({ ok: false, error: { code: 'invalid-person-b' } })
  })
})
