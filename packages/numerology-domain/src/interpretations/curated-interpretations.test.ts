import { describe, expect, it } from 'vitest'
import { curatedInterpretationProvider } from './curated-interpretations'
import type { NumerologyValue } from '../value-objects/numerology-value'

const value = (reduced: number, isMaster = false): NumerologyValue => ({
  raw: reduced,
  reduced,
  chain: [reduced],
  isMaster,
})

describe('curatedInterpretationProvider', () => {
  it('interpreta um número de vibração com enquadramento + reflexão do valor', () => {
    const result = curatedInterpretationProvider.interpret({
      model: 'pythagorean',
      resultId: 'expression',
      value: value(6),
    })
    expect(result?.source).toBe('curated')
    expect(result?.text['pt-BR']).toContain('Expressão')
    expect(result?.text['pt-BR']).toContain('cuidado') // reflexão do 6
    // trilíngue
    expect(result?.text.en).toBeTruthy()
    expect(result?.text.es).toBeTruthy()
  })

  it('interpreta números mestres (11)', () => {
    const result = curatedInterpretationProvider.interpret({
      model: 'pythagorean',
      resultId: 'life-path',
      value: value(11, true),
    })
    expect(result?.text['pt-BR']).toContain('Destino')
    expect(result?.text['pt-BR']).toContain('mestre')
  })

  it('marca a Gematria como reconstrução no enquadramento', () => {
    const result = curatedInterpretationProvider.interpret({
      model: 'gematria',
      resultId: 'gematria-value',
      value: value(3),
    })
    expect(result?.text['pt-BR']).toContain('reconstrução')
  })

  it('retorna null para vibração sem reflexão cadastrada (valor fora de 1–9/mestres)', () => {
    expect(
      curatedInterpretationProvider.interpret({
        model: 'pythagorean',
        resultId: 'expression',
        value: value(10), // valor artificial sem entrada
      }),
    ).toBeNull()
  })

  it('não interpreta números de grade/contagem (o escalar não é vibração)', () => {
    for (const resultId of ['karmic-lessons', 'hidden-tendencies', 'subconscious', 'lo-shu-grid'] as const) {
      expect(
        curatedInterpretationProvider.interpret({ model: 'pythagorean', resultId, value: value(5) }),
      ).toBeNull()
    }
  })

  it('linguagem de reflexão, nunca veredito (§9): não usa "você é" nem previsão', () => {
    for (let reduced = 1; reduced <= 9; reduced += 1) {
      const result = curatedInterpretationProvider.interpret({
        model: 'pythagorean',
        resultId: 'expression',
        value: value(reduced),
      })
      const pt = result?.text['pt-BR'] ?? ''
      expect(pt).not.toMatch(/você é\b/i)
      expect(pt).not.toMatch(/vai acontecer|com certeza|previsão/i)
      expect(pt).toMatch(/reflet|observ|pensar|convite|espaço/i)
    }
  })
})
