import type { LocalizedText } from '@numerus/shared-kernel'
import type { RuleReference } from '../../trace/calculation-trace'

const text = (ptBR: string, en: string): LocalizedText => ({ 'pt-BR': ptBR, en })

/**
 * Regras da escola pitagórica citáveis pelo traço (modo "por quê?", §3.2).
 * A origem histórica é declarada com honestidade epistêmica (§9): o sistema
 * moderno foi estruturado por L. Dow Balliett e Juno Jordan (séc. XIX–XX),
 * reivindicando a herança pitagórica.
 */
export const PYTHAGOREAN_RULES = {
  letterTable: {
    id: 'pythagorean/letter-table',
    rule: text(
      'Cada letra recebe um valor de 1 a 9 conforme sua posição no alfabeto latino, reiniciando a cada nove letras (A=1 … I=9, J=1 …).',
      'Each letter maps to 1–9 by its position in the Latin alphabet, restarting every nine letters (A=1 … I=9, J=1 …).',
    ),
    source: text(
      'Sistema moderno estruturado por L. Dow Balliett e Juno Jordan (fim do séc. XIX / início do XX), reivindicando a herança pitagórica.',
      'Modern system structured by L. Dow Balliett and Juno Jordan (late 19th / early 20th century), claiming the Pythagorean heritage.',
    ),
  },
  expressionUsesAllLetters: {
    id: 'pythagorean/expression-all-letters',
    rule: text(
      'O número de Expressão soma TODAS as letras do nome completo de nascimento — vogais e consoantes.',
      'The Expression number sums ALL letters of the full birth name — vowels and consonants.',
    ),
    source: text('Juno Jordan, "Numerology: The Romance in Your Name" (1965).', 'Juno Jordan, "Numerology: The Romance in Your Name" (1965).'),
  },
  masterNumbers: {
    id: 'pythagorean/master-numbers',
    rule: text(
      'Os números mestres 11, 22 e 33 não são reduzidos: a redução para quando um total atinge um deles.',
      'Master numbers 11, 22 and 33 are not reduced: reduction stops when a total reaches one of them.',
    ),
    source: text('Convenção consolidada na numerologia moderna (Balliett/Jordan).', 'Convention consolidated in modern numerology (Balliett/Jordan).'),
  },
  motivationUsesVowels: {
    id: 'pythagorean/motivation-vowels',
    rule: text(
      'O número de Motivação (Alma) soma apenas as VOGAIS do nome completo de nascimento.',
      'The Motivation (Soul Urge) number sums only the VOWELS of the full birth name.',
    ),
    source: text('Juno Jordan, "Numerology: The Romance in Your Name" (1965).', 'Juno Jordan, "Numerology: The Romance in Your Name" (1965).'),
  },
  impressionUsesConsonants: {
    id: 'pythagorean/impression-consonants',
    rule: text(
      'O número de Impressão (Personalidade) soma apenas as CONSOANTES do nome completo de nascimento.',
      'The Impression (Personality) number sums only the CONSONANTS of the full birth name.',
    ),
    source: text('Juno Jordan, "Numerology: The Romance in Your Name" (1965).', 'Juno Jordan, "Numerology: The Romance in Your Name" (1965).'),
  },
  keyNumberUsesFirstName: {
    id: 'pythagorean/key-number-first-name',
    rule: text(
      'O Número Chave soma todas as letras apenas do PRIMEIRO nome.',
      'The Key Number sums all letters of the FIRST name only.',
    ),
    source: text('Tradição numerológica moderna (Balliett/Jordan).', 'Modern numerological tradition (Balliett/Jordan).'),
  },
  yClassification: {
    id: 'pythagorean/y-classification',
    rule: text(
      'As escolas divergem sobre o Y: vogal, consoante, ou vogal apenas quando não há vogal plena vizinha. A classificação é uma variante explícita e fica registrada no traço (ADR-0004).',
      'Schools diverge on Y: vowel, consonant, or vowel only when no plain vowel is adjacent. The classification is an explicit variant recorded in the trace (ADR-0004).',
    ),
    source: text('Divergência documentada entre manuais modernos; não há regra única.', 'Divergence documented across modern manuals; there is no single rule.'),
  },
  lifePathFromBirthDate: {
    id: 'pythagorean/life-path',
    rule: text(
      'O Destino (Caminho de Vida) deriva da data de nascimento completa: dia, mês e ano.',
      'The Life Path derives from the full birth date: day, month and year.',
    ),
    source: text('Juno Jordan, "Numerology: The Romance in Your Name" (1965).', 'Juno Jordan, "Numerology: The Romance in Your Name" (1965).'),
  },
  psychicFromDay: {
    id: 'pythagorean/psychic-day',
    rule: text(
      'O Número Psíquico é a redução do DIA do nascimento, preservando mestres.',
      'The Psychic Number is the reduction of the birth DAY, preserving masters.',
    ),
    source: text('Uso difundido nas escolas modernas, com origem na tradição védica.', 'Widespread in modern schools, originating in the Vedic tradition.'),
  },
  missionFromExpressionAndLifePath: {
    id: 'pythagorean/mission',
    rule: text(
      'A Missão soma os valores reduzidos da Expressão e do Destino, e reduz o total preservando mestres.',
      'The Mission sums the reduced values of Expression and Life Path, then reduces the total preserving masters.',
    ),
    source: text('Tradição numerológica moderna (também chamada "Número da Realização").', 'Modern numerological tradition (also called "Maturity Number").'),
  },
  karmicLessonsFromMissingDigits: {
    id: 'pythagorean/karmic-lessons',
    rule: text(
      'As Lições Cármicas são os dígitos de 1 a 9 que NÃO aparecem entre os valores das letras do nome — apontam qualidades a desenvolver.',
      'Karmic Lessons are the digits 1–9 that do NOT appear among the letter values of the name — pointing to qualities to develop.',
    ),
    source: text('Juno Jordan, "Numerology: The Romance in Your Name" (1965).', 'Juno Jordan, "Numerology: The Romance in Your Name" (1965).'),
  },
  hiddenTendenciesFromRepetition: {
    id: 'pythagorean/hidden-tendencies',
    rule: text(
      'As Tendências Ocultas são os dígitos que se repetem três ou mais vezes entre os valores das letras do nome.',
      'Hidden Tendencies are the digits repeated three or more times among the letter values of the name.',
    ),
    source: text('Tradição numerológica moderna (também "Hidden Passion").', 'Modern numerological tradition (also "Hidden Passion").'),
  },
  subconsciousFromDistinctDigits: {
    id: 'pythagorean/subconscious',
    rule: text(
      'O número do Subconsciente é a quantidade de dígitos distintos (1–9) presentes no nome — equivalente a 9 menos o número de Lições Cármicas.',
      'The Subconscious number is the count of distinct digits (1–9) present in the name — equivalent to 9 minus the number of Karmic Lessons.',
    ),
    source: text('Tradição numerológica moderna (Balliett/Jordan).', 'Modern numerological tradition (Balliett/Jordan).'),
  },
  karmicDebts: {
    id: 'pythagorean/karmic-debts',
    rule: text(
      'Os totais brutos 13, 14, 16 e 19, quando aparecem antes de uma redução, são marcados como dívidas cármicas — inclusive as "ocultas" em totais intermediários.',
      'Raw totals 13, 14, 16 and 19 appearing before a reduction are flagged as karmic debts — including "hidden" ones in intermediate totals.',
    ),
    source: text('Tradição numerológica moderna; a detecção exige preservar o valor bruto antes de reduzir.', 'Modern numerological tradition; detection requires preserving the raw value before reducing.'),
  },
} as const satisfies Record<string, RuleReference>
