/**
 * Tabela caldaica: valores 1–8 atribuídos por afinidade fonética/vibração;
 * o 9 é considerado sagrado e nenhuma letra o recebe (somas podem valer 9).
 * Mantida explícita — é exibida ao usuário na camada educacional.
 */
export const CHALDEAN_LETTER_VALUES: Readonly<Record<string, number>> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 8, G: 3, H: 5, I: 1,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 7, P: 8, Q: 1, R: 2,
  S: 3, T: 4, U: 6, V: 6, W: 6, X: 5, Y: 1, Z: 7,
}

export function chaldeanValueOf(letter: string): number {
  const value = CHALDEAN_LETTER_VALUES[letter]
  if (value === undefined) {
    // BirthName garante A–Z por invariante; chegar aqui é bug de programação.
    throw new RangeError(`Letra fora da tabela caldaica: "${letter}"`)
  }
  return value
}
