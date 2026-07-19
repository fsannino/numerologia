import type { LocalizedText } from '@numerus/shared-kernel'

/**
 * Transliteração latino→hebraico da Gematria (ADR-0008). Ambígua por
 * natureza: cada letra latina tem uma ou mais candidatas hebraicas, com
 * valor (mispar hechrachi) e nome. A primeira opção é a "padrão".
 */

export type HebrewCandidate = {
  readonly hebrew: string
  readonly value: number
  readonly name: string
}

const A = (hebrew: string, value: number, name: string): HebrewCandidate => ({ hebrew, value, name })

/** Letras ambíguas têm 2–3 candidatas; a primeira é a padrão. */
export const TRANSLITERATION: Readonly<Record<string, ReadonlyArray<HebrewCandidate>>> = {
  A: [A('א', 1, 'alef'), A('ע', 70, 'ayin')],
  B: [A('ב', 2, 'bet')],
  C: [A('כ', 20, 'kaf'), A('ק', 100, 'qof'), A('ס', 60, 'samekh')],
  D: [A('ד', 4, 'dalet')],
  E: [A('ה', 5, 'he'), A('א', 1, 'alef')],
  F: [A('פ', 80, 'pe')],
  G: [A('ג', 3, 'gimel')],
  H: [A('ה', 5, 'he'), A('ח', 8, 'chet')],
  I: [A('י', 10, 'yod')],
  J: [A('י', 10, 'yod')],
  K: [A('כ', 20, 'kaf'), A('ק', 100, 'qof')],
  L: [A('ל', 30, 'lamed')],
  M: [A('מ', 40, 'mem')],
  N: [A('נ', 50, 'nun')],
  O: [A('ו', 6, 'vav'), A('ע', 70, 'ayin')],
  P: [A('פ', 80, 'pe')],
  Q: [A('ק', 100, 'qof')],
  R: [A('ר', 200, 'resh')],
  S: [A('ס', 60, 'samekh'), A('שׁ', 300, 'shin')],
  T: [A('ת', 400, 'tav'), A('ט', 9, 'tet')],
  U: [A('ו', 6, 'vav')],
  V: [A('ו', 6, 'vav')],
  W: [A('ו', 6, 'vav')],
  X: [A('ס', 60, 'samekh'), A('ק', 100, 'qof')],
  Y: [A('י', 10, 'yod')],
  Z: [A('ז', 7, 'zayin')],
}

export type LetterTransliteration = {
  readonly latin: string
  readonly options: ReadonlyArray<HebrewCandidate>
}

export type TransliterationResult = {
  readonly letters: ReadonlyArray<LetterTransliteration>
  /** Total com a opção padrão (primeira) de cada letra. */
  readonly standardTotal: number
  /** Menor total possível (opção de menor valor por letra). */
  readonly minTotal: number
  /** Maior total possível (opção de maior valor por letra). */
  readonly maxTotal: number
  /** Número de combinações de transliteração possíveis. */
  readonly combinationCount: number
  /** String hebraica da transliteração padrão. */
  readonly standardHebrew: string
}

function candidatesFor(letter: string): ReadonlyArray<HebrewCandidate> {
  const options = TRANSLITERATION[letter]
  if (options === undefined || options.length === 0) {
    // BirthName garante A–Z; chegar aqui é bug de programação.
    throw new RangeError(`Letra sem transliteração: "${letter}"`)
  }
  return options
}

/**
 * Transliteração de um nome já normalizado (A–Z). Retorna todas as opções
 * por letra e os totais representativos — nunca escolhe em silêncio.
 */
export function transliterate(letters: ReadonlyArray<string>): TransliterationResult {
  const perLetter = letters.map((latin) => ({ latin, options: candidatesFor(latin) }))

  let standardTotal = 0
  let minTotal = 0
  let maxTotal = 0
  let combinationCount = 1
  let standardHebrew = ''
  for (const { options } of perLetter) {
    const values = options.map((option) => option.value)
    standardTotal += values[0] ?? 0
    minTotal += Math.min(...values)
    maxTotal += Math.max(...values)
    combinationCount *= options.length
    standardHebrew += options[0]?.hebrew ?? ''
  }

  return { letters: perLetter, standardTotal, minTotal, maxTotal, combinationCount, standardHebrew }
}

export const HEBREW_LETTER_NOTE: LocalizedText = {
  'pt-BR': 'A transliteração latino→hebraico é uma reconstrução: há várias leituras válidas.',
  en: 'Latin→Hebrew transliteration is a reconstruction: several valid readings exist.',
  es: 'La transliteración latino→hebreo es una reconstrucción: existen varias lecturas válidas.',
}
