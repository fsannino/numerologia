import { describe, expect, it } from 'vitest'
import fc from 'fast-check'
import { classifyLetter, lettersWithRole } from './letter-classification'

describe('classificação vogal/consoante (ADR-0004)', () => {
  it('A, E, I, O, U são sempre vogais; W é sempre consoante', () => {
    for (const variant of ['y-by-context', 'y-always-vowel', 'y-always-consonant'] as const) {
      expect(classifyLetter('AEIOU', 2, variant)).toBe('vowel')
      expect(classifyLetter('WANDA', 0, variant)).toBe('consonant')
    }
  })

  it('y-by-context: Y vizinho de vogal plena é consoante (YARA)', () => {
    expect(classifyLetter('YARA', 0, 'y-by-context')).toBe('consonant')
  })

  it('y-by-context: Y sem vogal plena vizinha é vogal (LYDIA)', () => {
    expect(classifyLetter('LYDIA', 1, 'y-by-context')).toBe('vowel')
  })

  it('variantes fixas ignoram o contexto', () => {
    expect(classifyLetter('YARA', 0, 'y-always-vowel')).toBe('vowel')
    expect(classifyLetter('LYDIA', 1, 'y-always-consonant')).toBe('consonant')
  })

  it('índice fora da palavra é bug de programação — falha alto', () => {
    expect(() => classifyLetter('ANA', 9, 'y-by-context')).toThrow(RangeError)
  })

  it('propriedade: vogais e consoantes particionam a palavra em qualquer variante', () => {
    fc.assert(
      fc.property(
        fc.stringMatching(/^[A-Z]{1,12}$/),
        fc.constantFrom('y-by-context' as const, 'y-always-vowel' as const, 'y-always-consonant' as const),
        (word, variant) => {
          const vowels = lettersWithRole(word, 'vowel', variant)
          const consonants = lettersWithRole(word, 'consonant', variant)
          return vowels.length + consonants.length === word.length
        },
      ),
    )
  })
})
