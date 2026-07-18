import type { Result } from '@numerus/shared-kernel'
import { err, ok } from '@numerus/shared-kernel'

/**
 * Política de normalização de nomes — decisão de domínio documentada em
 * ADR-0002. Resumo: NFD sem marcas combinantes, caixa alta, hífen separa
 * palavras, apóstrofo une letras, partículas entram no cálculo, caractere
 * não conversível é ERRO explícito (nunca descarte silencioso).
 */

const COMBINING_MARKS = /\p{M}/gu
const APOSTROPHES = /['’ʼ]/g
const WORD_SEPARATORS = /[\s‐-―-]+/
const CALCULABLE_LETTER = /^[A-Z]$/

export type UnsupportedCharacter = {
  readonly character: string
  readonly word: string
}

export type NameNormalizationError =
  | { readonly code: 'empty-name' }
  | { readonly code: 'unsupported-character'; readonly characters: ReadonlyArray<UnsupportedCharacter> }

export type NormalizedName = {
  readonly original: string
  /** Palavras de cálculo, apenas A–Z, na ordem do nome. */
  readonly words: ReadonlyArray<string>
}

export function normalizeName(rawName: string): Result<NormalizedName, NameNormalizationError> {
  const original = rawName.trim().replace(/\s+/g, ' ')
  if (original === '') {
    return err({ code: 'empty-name' })
  }

  const stripped = original
    .normalize('NFD')
    .replace(COMBINING_MARKS, '')
    .replace(APOSTROPHES, '')
    .toUpperCase()

  const words = stripped.split(WORD_SEPARATORS).filter((word) => word !== '')
  if (words.length === 0) {
    return err({ code: 'empty-name' })
  }

  const unsupported: UnsupportedCharacter[] = []
  for (const word of words) {
    for (const character of word) {
      if (!CALCULABLE_LETTER.test(character)) {
        unsupported.push({ character, word })
      }
    }
  }
  if (unsupported.length > 0) {
    return err({ code: 'unsupported-character', characters: unsupported })
  }

  return ok({ original, words })
}
