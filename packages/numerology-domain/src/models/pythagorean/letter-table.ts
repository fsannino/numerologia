/**
 * Tabela pitagórica: valores 1–9 pela posição alfabética (A=1 … I=9,
 * J=1 …, reiniciando a cada 9 letras). Mantida como tabela explícita —
 * ela é exibida ao usuário na camada educacional, não é um detalhe.
 */
export const PYTHAGOREAN_LETTER_VALUES: Readonly<Record<string, number>> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8,
}

export function pythagoreanValueOf(letter: string): number {
  const value = PYTHAGOREAN_LETTER_VALUES[letter]
  if (value === undefined) {
    // BirthName garante A–Z por invariante; chegar aqui é bug de programação.
    throw new RangeError(`Letra fora da tabela pitagórica: "${letter}"`)
  }
  return value
}
