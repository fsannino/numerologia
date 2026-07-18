import type { LocalizedText } from '@numerus/shared-kernel'
import type { RuleReference } from '../../trace/calculation-trace'

const text = (ptBR: string, en: string, es: string): LocalizedText => ({ 'pt-BR': ptBR, en, es })

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
      'Cada letra recibe un valor del 1 al 9 según su posición en el alfabeto latino, reiniciando cada nueve letras (A=1 … I=9, J=1 …).',
    ),
    source: text(
      'Sistema moderno estruturado por L. Dow Balliett e Juno Jordan (fim do séc. XIX / início do XX), reivindicando a herança pitagórica.',
      'Modern system structured by L. Dow Balliett and Juno Jordan (late 19th / early 20th century), claiming the Pythagorean heritage.',
      'Sistema moderno estructurado por L. Dow Balliett y Juno Jordan (finales del s. XIX / inicios del XX), reivindicando la herencia pitagórica.',
    ),
  },
  expressionUsesAllLetters: {
    id: 'pythagorean/expression-all-letters',
    rule: text(
      'O número de Expressão soma TODAS as letras do nome completo de nascimento — vogais e consoantes.',
      'The Expression number sums ALL letters of the full birth name — vowels and consonants.',
      'El número de Expresión suma TODAS las letras del nombre completo de nacimiento — vocales y consonantes.',
    ),
    source: text(
      'Juno Jordan, "Numerology: The Romance in Your Name" (1965).',
      'Juno Jordan, "Numerology: The Romance in Your Name" (1965).',
      'Juno Jordan, "Numerology: The Romance in Your Name" (1965).',
    ),
  },
  motivationUsesVowels: {
    id: 'pythagorean/motivation-vowels',
    rule: text(
      'O número de Motivação (Alma) soma apenas as VOGAIS do nome completo de nascimento.',
      'The Motivation (Soul Urge) number sums only the VOWELS of the full birth name.',
      'El número de Motivación (Alma) suma solo las VOCALES del nombre completo de nacimiento.',
    ),
    source: text(
      'Juno Jordan, "Numerology: The Romance in Your Name" (1965).',
      'Juno Jordan, "Numerology: The Romance in Your Name" (1965).',
      'Juno Jordan, "Numerology: The Romance in Your Name" (1965).',
    ),
  },
  impressionUsesConsonants: {
    id: 'pythagorean/impression-consonants',
    rule: text(
      'O número de Impressão (Personalidade) soma apenas as CONSOANTES do nome completo de nascimento.',
      'The Impression (Personality) number sums only the CONSONANTS of the full birth name.',
      'El número de Impresión (Personalidad) suma solo las CONSONANTES del nombre completo de nacimiento.',
    ),
    source: text(
      'Juno Jordan, "Numerology: The Romance in Your Name" (1965).',
      'Juno Jordan, "Numerology: The Romance in Your Name" (1965).',
      'Juno Jordan, "Numerology: The Romance in Your Name" (1965).',
    ),
  },
  keyNumberUsesFirstName: {
    id: 'pythagorean/key-number-first-name',
    rule: text(
      'O Número Chave soma todas as letras apenas do PRIMEIRO nome.',
      'The Key Number sums all letters of the FIRST name only.',
      'El Número Clave suma todas las letras solo del PRIMER nombre.',
    ),
    source: text(
      'Tradição numerológica moderna (Balliett/Jordan).',
      'Modern numerological tradition (Balliett/Jordan).',
      'Tradición numerológica moderna (Balliett/Jordan).',
    ),
  },
  yClassification: {
    id: 'pythagorean/y-classification',
    rule: text(
      'As escolas divergem sobre o Y: vogal, consoante, ou vogal apenas quando não há vogal plena vizinha. A classificação é uma variante explícita e fica registrada no traço (ADR-0004).',
      'Schools diverge on Y: vowel, consonant, or vowel only when no plain vowel is adjacent. The classification is an explicit variant recorded in the trace (ADR-0004).',
      'Las escuelas divergen sobre la Y: vocal, consonante, o vocal solo cuando no hay vocal plena vecina. La clasificación es una variante explícita registrada en la traza (ADR-0004).',
    ),
    source: text(
      'Divergência documentada entre manuais modernos; não há regra única.',
      'Divergence documented across modern manuals; there is no single rule.',
      'Divergencia documentada entre manuales modernos; no existe una regla única.',
    ),
  },
  lifePathFromBirthDate: {
    id: 'pythagorean/life-path',
    rule: text(
      'O Destino (Caminho de Vida) deriva da data de nascimento completa: dia, mês e ano.',
      'The Life Path derives from the full birth date: day, month and year.',
      'El Destino (Camino de Vida) deriva de la fecha de nacimiento completa: día, mes y año.',
    ),
    source: text(
      'Juno Jordan, "Numerology: The Romance in Your Name" (1965).',
      'Juno Jordan, "Numerology: The Romance in Your Name" (1965).',
      'Juno Jordan, "Numerology: The Romance in Your Name" (1965).',
    ),
  },
  psychicFromDay: {
    id: 'pythagorean/psychic-day',
    rule: text(
      'O Número Psíquico é a redução do DIA do nascimento, preservando mestres.',
      'The Psychic Number is the reduction of the birth DAY, preserving masters.',
      'El Número Psíquico es la reducción del DÍA de nacimiento, preservando maestros.',
    ),
    source: text(
      'Uso difundido nas escolas modernas, com origem na tradição védica.',
      'Widespread in modern schools, originating in the Vedic tradition.',
      'Uso difundido en las escuelas modernas, con origen en la tradición védica.',
    ),
  },
  missionFromExpressionAndLifePath: {
    id: 'pythagorean/mission',
    rule: text(
      'A Missão soma os valores reduzidos da Expressão e do Destino, e reduz o total preservando mestres.',
      'The Mission sums the reduced values of Expression and Life Path, then reduces the total preserving masters.',
      'La Misión suma los valores reducidos de la Expresión y el Destino, y reduce el total preservando maestros.',
    ),
    source: text(
      'Tradição numerológica moderna (também chamada "Número da Realização").',
      'Modern numerological tradition (also called "Maturity Number").',
      'Tradición numerológica moderna (también llamada "Número de la Madurez").',
    ),
  },
  karmicLessonsFromMissingDigits: {
    id: 'pythagorean/karmic-lessons',
    rule: text(
      'As Lições Cármicas são os dígitos de 1 a 9 que NÃO aparecem entre os valores das letras do nome — apontam qualidades a desenvolver.',
      'Karmic Lessons are the digits 1–9 that do NOT appear among the letter values of the name — pointing to qualities to develop.',
      'Las Lecciones Kármicas son los dígitos del 1 al 9 que NO aparecen entre los valores de las letras del nombre — señalan cualidades a desarrollar.',
    ),
    source: text(
      'Juno Jordan, "Numerology: The Romance in Your Name" (1965).',
      'Juno Jordan, "Numerology: The Romance in Your Name" (1965).',
      'Juno Jordan, "Numerology: The Romance in Your Name" (1965).',
    ),
  },
  hiddenTendenciesFromRepetition: {
    id: 'pythagorean/hidden-tendencies',
    rule: text(
      'As Tendências Ocultas são os dígitos que se repetem três ou mais vezes entre os valores das letras do nome.',
      'Hidden Tendencies are the digits repeated three or more times among the letter values of the name.',
      'Las Tendencias Ocultas son los dígitos que se repiten tres o más veces entre los valores de las letras del nombre.',
    ),
    source: text(
      'Tradição numerológica moderna (também "Hidden Passion").',
      'Modern numerological tradition (also "Hidden Passion").',
      'Tradición numerológica moderna (también "Hidden Passion").',
    ),
  },
  subconsciousFromDistinctDigits: {
    id: 'pythagorean/subconscious',
    rule: text(
      'O número do Subconsciente é a quantidade de dígitos distintos (1–9) presentes no nome — equivalente a 9 menos o número de Lições Cármicas.',
      'The Subconscious number is the count of distinct digits (1–9) present in the name — equivalent to 9 minus the number of Karmic Lessons.',
      'El número del Subconsciente es la cantidad de dígitos distintos (1–9) presentes en el nombre — equivalente a 9 menos el número de Lecciones Kármicas.',
    ),
    source: text(
      'Tradição numerológica moderna (Balliett/Jordan).',
      'Modern numerological tradition (Balliett/Jordan).',
      'Tradición numerológica moderna (Balliett/Jordan).',
    ),
  },
  lifeCyclesFromDateParts: {
    id: 'pythagorean/life-cycles',
    rule: text(
      'Os três Ciclos de Vida vêm do mês (formativo), do dia (produtivo) e do ano (colheita) reduzidos; o primeiro ciclo vai até a idade 36 menos o Caminho de Vida, o segundo dura 27 anos e o terceiro segue até o fim.',
      'The three Life Cycles come from the reduced month (formative), day (productive) and year (harvest); the first cycle lasts until age 36 minus the Life Path, the second lasts 27 years and the third runs to the end.',
      'Los tres Ciclos de Vida vienen del mes (formativo), el día (productivo) y el año (cosecha) reducidos; el primer ciclo dura hasta la edad 36 menos el Camino de Vida, el segundo dura 27 años y el tercero sigue hasta el final.',
    ),
    source: text(
      'Juno Jordan, "Numerology: The Romance in Your Name" (1965).',
      'Juno Jordan, "Numerology: The Romance in Your Name" (1965).',
      'Juno Jordan, "Numerology: The Romance in Your Name" (1965).',
    ),
  },
  pinnaclesFromDateParts: {
    id: 'pythagorean/pinnacles',
    rule: text(
      'Os quatro Pináculos: P1 = dia+mês, P2 = dia+ano, P3 = P1+P2, P4 = mês+ano (partes reduzidas, mestres preservados). P1 vai até 36 menos o Caminho de Vida; P2 e P3 duram 9 anos cada; P4 segue até o fim.',
      'The four Pinnacles: P1 = day+month, P2 = day+year, P3 = P1+P2, P4 = month+year (reduced parts, masters preserved). P1 lasts until 36 minus the Life Path; P2 and P3 last 9 years each; P4 runs to the end.',
      'Los cuatro Pináculos: P1 = día+mes, P2 = día+año, P3 = P1+P2, P4 = mes+año (partes reducidas, maestros preservados). P1 dura hasta 36 menos el Camino de Vida; P2 y P3 duran 9 años cada uno; P4 sigue hasta el final.',
    ),
    source: text(
      'Juno Jordan, "Numerology: The Romance in Your Name" (1965).',
      'Juno Jordan, "Numerology: The Romance in Your Name" (1965).',
      'Juno Jordan, "Numerology: The Romance in Your Name" (1965).',
    ),
  },
  challengesFromDateParts: {
    id: 'pythagorean/challenges',
    rule: text(
      'Os quatro Desafios são diferenças absolutas dos componentes totalmente reduzidos: D1 = |mês−dia|, D2 = |dia−ano|, D3 = |D1−D2|, D4 = |mês−ano|. O resultado vai de 0 a 8 — o desafio 0 existe e não há números mestres em desafios.',
      'The four Challenges are absolute differences of the fully reduced components: C1 = |month−day|, C2 = |day−year|, C3 = |C1−C2|, C4 = |month−year|. Results range 0–8 — challenge 0 exists and there are no master numbers in challenges.',
      'Los cuatro Desafíos son diferencias absolutas de los componentes totalmente reducidos: D1 = |mes−día|, D2 = |día−año|, D3 = |D1−D2|, D4 = |mes−año|. El resultado va de 0 a 8 — el desafío 0 existe y no hay números maestros en desafíos.',
    ),
    source: text(
      'Tradição numerológica moderna (Balliett/Jordan).',
      'Modern numerological tradition (Balliett/Jordan).',
      'Tradición numerológica moderna (Balliett/Jordan).',
    ),
  },
  personalTimeFromReference: {
    id: 'pythagorean/personal-time',
    rule: text(
      'Ano Pessoal = dia e mês de nascimento + ano de referência (partes reduzidas); Mês Pessoal = Ano Pessoal + mês de referência; Dia Pessoal = Mês Pessoal + dia de referência. Totalmente reduzidos (1–9): o ciclo de nove anos fecha (ADR-0007).',
      'Personal Year = birth day and month + reference year (reduced parts); Personal Month = Personal Year + reference month; Personal Day = Personal Month + reference day. Fully reduced (1–9): the nine-year cycle closes (ADR-0007).',
      'Año Personal = día y mes de nacimiento + año de referencia (partes reducidas); Mes Personal = Año Personal + mes de referencia; Día Personal = Mes Personal + día de referencia. Totalmente reducidos (1–9): el ciclo de nueve años se cierra (ADR-0007).',
    ),
    source: text(
      'Tradição numerológica moderna (Balliett/Jordan).',
      'Modern numerological tradition (Balliett/Jordan).',
      'Tradición numerológica moderna (Balliett/Jordan).',
    ),
  },
  masterNumbers: {
    id: 'pythagorean/master-numbers',
    rule: text(
      'Os números mestres 11, 22 e 33 não são reduzidos: a redução para quando um total atinge um deles.',
      'Master numbers 11, 22 and 33 are not reduced: reduction stops when a total reaches one of them.',
      'Los números maestros 11, 22 y 33 no se reducen: la reducción se detiene cuando un total alcanza uno de ellos.',
    ),
    source: text(
      'Convenção consolidada na numerologia moderna (Balliett/Jordan).',
      'Convention consolidated in modern numerology (Balliett/Jordan).',
      'Convención consolidada en la numerología moderna (Balliett/Jordan).',
    ),
  },
  karmicDebts: {
    id: 'pythagorean/karmic-debts',
    rule: text(
      'Os totais brutos 13, 14, 16 e 19, quando aparecem antes de uma redução, são marcados como dívidas cármicas — inclusive as "ocultas" em totais intermediários.',
      'Raw totals 13, 14, 16 and 19 appearing before a reduction are flagged as karmic debts — including "hidden" ones in intermediate totals.',
      'Los totales brutos 13, 14, 16 y 19, cuando aparecen antes de una reducción, se marcan como deudas kármicas — incluidas las "ocultas" en totales intermedios.',
    ),
    source: text(
      'Tradição numerológica moderna; a detecção exige preservar o valor bruto antes de reduzir.',
      'Modern numerological tradition; detection requires preserving the raw value before reducing.',
      'Tradición numerológica moderna; la detección exige preservar el valor bruto antes de reducir.',
    ),
  },
} as const satisfies Record<string, RuleReference>
