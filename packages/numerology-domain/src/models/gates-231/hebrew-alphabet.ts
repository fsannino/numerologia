import type { HebrewLetter } from '../../trace/calculation-trace'

/**
 * As 22 letras do alfabeto hebraico com seus valores (mispar hechrachi) —
 * o alfabeto do Sefer Yetzirah. É um fato canônico documentado (dado, como o
 * quadrado Lo Shu). Os 231 portões são DERIVADOS deste alfabeto por combinação
 * (C(22,2)), nunca hardcoded — ver `gates.ts` e o teste que afirma 231.
 *
 * Nota: a transliteração latino→hebraico da Gematria cobre 21 destas letras;
 * tsadi (90) não recebe mapeamento latino, então nomes latinos nunca a ativam
 * — limitação conhecida, herdada de ADR-0008.
 */
export const HEBREW_ALPHABET: ReadonlyArray<HebrewLetter> = [
  { hebrew: 'א', value: 1, name: 'alef' },
  { hebrew: 'ב', value: 2, name: 'bet' },
  { hebrew: 'ג', value: 3, name: 'gimel' },
  { hebrew: 'ד', value: 4, name: 'dalet' },
  { hebrew: 'ה', value: 5, name: 'he' },
  { hebrew: 'ו', value: 6, name: 'vav' },
  { hebrew: 'ז', value: 7, name: 'zayin' },
  { hebrew: 'ח', value: 8, name: 'chet' },
  { hebrew: 'ט', value: 9, name: 'tet' },
  { hebrew: 'י', value: 10, name: 'yod' },
  { hebrew: 'כ', value: 20, name: 'kaf' },
  { hebrew: 'ל', value: 30, name: 'lamed' },
  { hebrew: 'מ', value: 40, name: 'mem' },
  { hebrew: 'נ', value: 50, name: 'nun' },
  { hebrew: 'ס', value: 60, name: 'samekh' },
  { hebrew: 'ע', value: 70, name: 'ayin' },
  { hebrew: 'פ', value: 80, name: 'pe' },
  { hebrew: 'צ', value: 90, name: 'tsadi' },
  { hebrew: 'ק', value: 100, name: 'qof' },
  { hebrew: 'ר', value: 200, name: 'resh' },
  { hebrew: 'ש', value: 300, name: 'shin' },
  { hebrew: 'ת', value: 400, name: 'tav' },
]
