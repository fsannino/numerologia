import { describe, expect, it } from 'vitest'
import { unwrap } from '@numerus/shared-kernel'
import { normalizeName } from './name-normalization-policy'

describe('normalizeName (ADR-0002)', () => {
  it('remove acentos e cedilha e sobe para caixa alta', () => {
    expect(unwrap(normalizeName('João Conceição')).words).toEqual(['JOAO', 'CONCEICAO'])
  })

  it('colapsa espaços múltiplos e preserva o original aparado', () => {
    const result = unwrap(normalizeName('  Maria   Silva '))
    expect(result.original).toBe('Maria Silva')
    expect(result.words).toEqual(['MARIA', 'SILVA'])
  })

  it('trata hífen como separador de palavras', () => {
    expect(unwrap(normalizeName('Ana-Clara Souza')).words).toEqual(['ANA', 'CLARA', 'SOUZA'])
  })

  it('remove apóstrofo unindo as letras em uma palavra', () => {
    expect(unwrap(normalizeName("Ana D'Ávila")).words).toEqual(['ANA', 'DAVILA'])
    expect(unwrap(normalizeName('Ana D’Ávila')).words).toEqual(['ANA', 'DAVILA'])
  })

  it('mantém partículas no cálculo', () => {
    expect(unwrap(normalizeName('Pedro de Souza dos Santos')).words).toEqual([
      'PEDRO', 'DE', 'SOUZA', 'DOS', 'SANTOS',
    ])
  })

  it('rejeita nome vazio ou só de separadores', () => {
    expect(normalizeName('')).toMatchObject({ ok: false, error: { code: 'empty-name' } })
    expect(normalizeName('   ')).toMatchObject({ ok: false, error: { code: 'empty-name' } })
    expect(normalizeName("- ' -")).toMatchObject({ ok: false, error: { code: 'empty-name' } })
  })

  it('rejeita caractere não conversível com erro explícito, nunca descarte silencioso', () => {
    const withDigit = normalizeName('Maria 3 Silva')
    expect(withDigit.ok).toBe(false)
    if (!withDigit.ok && withDigit.error.code === 'unsupported-character') {
      expect(withDigit.error.characters).toEqual([{ character: '3', word: '3' }])
    }

    const nonLatin = normalizeName('María 李')
    expect(nonLatin.ok).toBe(false)
    if (!nonLatin.ok && nonLatin.error.code === 'unsupported-character') {
      expect(nonLatin.error.characters[0]?.character).toBe('李')
    }
  })
})
