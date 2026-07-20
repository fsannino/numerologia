import fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import type { HebrewLetter } from '../../trace/calculation-trace'
import { HEBREW_ALPHABET } from './hebrew-alphabet'
import { activatedGates, allGates, gateKey } from './gates'

describe('231 Portões — estrutura (propriedades)', () => {
  it('o alfabeto tem exatamente 22 letras, com valores distintos', () => {
    expect(HEBREW_ALPHABET).toHaveLength(22)
    expect(new Set(HEBREW_ALPHABET.map((l) => l.value)).size).toBe(22)
  })

  it('há exatamente 231 portões = C(22,2)', () => {
    expect(allGates()).toHaveLength(231)
    expect(allGates().length).toBe((22 * 21) / 2)
  })

  it('nenhum portão se repete e todos são pares não-ordenados de letras distintas', () => {
    const gates = allGates()
    const keys = gates.map(gateKey)
    expect(new Set(keys).size).toBe(gates.length) // sem repetição
    for (const gate of gates) {
      expect(gate.first.value).toBeLessThan(gate.second.value) // ordenado → não-ordenado canônico, e distintas
    }
  })

  it('todo portão é formado por letras do alfabeto', () => {
    const values = new Set(HEBREW_ALPHABET.map((l) => l.value))
    for (const gate of allGates()) {
      expect(values.has(gate.first.value)).toBe(true)
      expect(values.has(gate.second.value)).toBe(true)
    }
  })

  // Propriedade central: N letras DISTINTAS geram C(N,2) portões ativados.
  it('distinct-letter-pairs: N letras distintas → C(N,2) portões', () => {
    fc.assert(
      fc.property(fc.uniqueArray(fc.integer({ min: 0, max: 21 }), { minLength: 0, maxLength: 22 }), (indices) => {
        const sequence: ReadonlyArray<HebrewLetter> = indices.map((i) => HEBREW_ALPHABET[i] as HebrewLetter)
        const n = sequence.length
        expect(activatedGates(sequence, 'distinct-letter-pairs')).toHaveLength((n * (n - 1)) / 2)
      }),
    )
  })

  it('repetir uma letra na sequência não cria portões novos (letras distintas)', () => {
    const alef = HEBREW_ALPHABET[0] as HebrewLetter
    const bet = HEBREW_ALPHABET[1] as HebrewLetter
    // [alef, bet, alef, bet] tem só 2 letras distintas → 1 portão
    expect(activatedGates([alef, bet, alef, bet], 'distinct-letter-pairs')).toHaveLength(1)
    // adjacent: (alef,bet),(bet,alef),(alef,bet) → todos o mesmo portão {1,2} → 1
    expect(activatedGates([alef, bet, alef, bet], 'adjacent-pairs')).toHaveLength(1)
  })

  it('adjacent-pairs ignora letras iguais vizinhas (não há portão de letra consigo mesma)', () => {
    const alef = HEBREW_ALPHABET[0] as HebrewLetter
    expect(activatedGates([alef, alef], 'adjacent-pairs')).toHaveLength(0)
  })
})
