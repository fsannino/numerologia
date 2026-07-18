/**
 * Classificação vogal/consoante — decisão de domínio documentada em ADR-0004.
 * A, E, I, O, U são sempre vogais; W é sempre consoante; o Y é ambíguo entre
 * as escolas e por isso é uma VARIANTE explícita, nunca um chute:
 *
 * - `y-by-context` (default): Y conta como vogal quando nenhum vizinho
 *   imediato na palavra é vogal plena (LYDIA → vogal; YARA → consoante).
 * - `y-always-vowel` / `y-always-consonant`: regras fixas de algumas escolas.
 */

export type YClassificationVariant = 'y-by-context' | 'y-always-vowel' | 'y-always-consonant'
export const DEFAULT_Y_CLASSIFICATION: YClassificationVariant = 'y-by-context'

export type LetterRole = 'vowel' | 'consonant'

const PLAIN_VOWELS: ReadonlySet<string> = new Set(['A', 'E', 'I', 'O', 'U'])

function isYVowelByContext(word: string, index: number): boolean {
  const previous = word[index - 1]
  const next = word[index + 1]
  const hasPlainVowelNeighbor =
    (previous !== undefined && PLAIN_VOWELS.has(previous)) ||
    (next !== undefined && PLAIN_VOWELS.has(next))
  return !hasPlainVowelNeighbor
}

export function classifyLetter(
  word: string,
  index: number,
  variant: YClassificationVariant,
): LetterRole {
  const letter = word[index]
  if (letter === undefined) {
    throw new RangeError(`Índice ${index} fora da palavra "${word}"`)
  }
  if (PLAIN_VOWELS.has(letter)) return 'vowel'
  if (letter !== 'Y') return 'consonant'
  switch (variant) {
    case 'y-always-vowel':
      return 'vowel'
    case 'y-always-consonant':
      return 'consonant'
    case 'y-by-context':
      return isYVowelByContext(word, index) ? 'vowel' : 'consonant'
  }
}

export function lettersWithRole(
  word: string,
  role: LetterRole,
  variant: YClassificationVariant,
): ReadonlyArray<string> {
  return [...word].filter((_, index) => classifyLetter(word, index, variant) === role)
}
