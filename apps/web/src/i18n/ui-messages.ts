import type { Locale } from '@numerus/shared-kernel'

/**
 * Dicionário da UI (a camada didática do domínio já viaja como
 * `LocalizedText` e é resolvida com `localize`). Conteúdo versionado — não
 * há string de produto hardcoded em componente.
 */
export type NumberLabel = { readonly title: string; readonly hint: string }

export type UiMessages = {
  readonly header: { readonly title: string; readonly tagline: string; readonly deviceBadge: string }
  readonly form: {
    readonly nameLabel: string
    readonly namePlaceholder: string
    readonly birthLabel: string
    readonly optionalTag: string
    readonly birthHint: string
    readonly referenceLabel: string
    readonly referenceTag: string
    readonly referenceHint: string
    readonly variantsSummary: string
    readonly variantsNote: string
    readonly calculate: string
  }
  readonly errors: {
    readonly emptyName: string
    readonly unsupportedCharacters: (characters: string) => string
    readonly invalidBirthDate: string
    readonly missingBirthDate: string
    readonly invalidReferenceDate: string
    readonly missingReferenceDate: string
    readonly referenceBeforeBirth: string
    readonly unknownModel: (model: string) => string
    readonly unsupportedNumber: (model: string, number: string) => string
    readonly unsupportedSubject: (model: string, subject: string) => string
    readonly unknownVariant: (option: string, dimension: string) => string
  }
  readonly results: {
    readonly chartTitle: string
    readonly engine: (version: string) => string
    readonly tableTitle: string
    readonly tableHint: string
    readonly seeSteps: string
    readonly rulesTitle: string
    readonly sourcePrefix: string
    readonly divergenceTitle: string
    readonly masterBadge: string
    readonly masterShort: string
    readonly debtBadge: (debt: number) => string
    readonly digitsBadge: (digits: string) => string
    readonly noDigits: string
    readonly noLetters: string
    readonly chainSr: (chain: string) => string
  }
  readonly timeline: {
    readonly range: (from: number, to: number) => string
    readonly rangeOpen: (from: number) => string
    readonly current: string
  }
  readonly numberLabels: Readonly<Record<string, NumberLabel>>
  readonly footer: string
}

const PT: UiMessages = {
  header: {
    title: 'Numerus',
    tagline:
      'Numerologia multi-modelo, interativa e educacional. Todo número pode ser aberto: você vê a tabela usada, a soma, a redução e a regra que justificou cada passo.',
    deviceBadge: 'O cálculo roda 100% neste dispositivo — seu nome não é enviado a nenhum servidor.',
  },
  form: {
    nameLabel: 'Nome completo de nascimento',
    namePlaceholder: 'Ex.: Maria da Silva',
    birthLabel: 'Data de nascimento',
    optionalTag: '(opcional)',
    birthHint: 'Necessária apenas para os números derivados da data. Como todo o resto, nunca sai do seu dispositivo.',
    referenceLabel: 'Data de referência',
    referenceTag: '(para os números de tempo)',
    referenceHint: 'Ciclos, Pináculos, Desafios e Ano/Mês/Dia Pessoal são calculados para esta data — por padrão, hoje.',
    variantsSummary: 'Métodos de cálculo (variantes das escolas)',
    variantsNote: 'Escolas divergem nos métodos — por isso a escolha é sua, e cada resultado registra a variante usada.',
    calculate: 'Calcular mapa',
  },
  errors: {
    emptyName: 'Digite o nome completo de nascimento.',
    unsupportedCharacters: (characters) =>
      `O nome contém caracteres que a tabela pitagórica não converte: ${characters}. Nada foi descartado em silêncio — ajuste o nome ou aguarde o suporte a outros alfabetos.`,
    invalidBirthDate: 'A data de nascimento é inválida — confira dia, mês e ano.',
    missingBirthDate: 'Informe a data de nascimento para calcular os números derivados da data.',
    invalidReferenceDate: 'A data de referência é inválida — confira dia, mês e ano.',
    missingReferenceDate: 'Informe a data de referência para calcular os números de tempo.',
    referenceBeforeBirth: 'A data de referência não pode ser anterior ao nascimento.',
    unknownModel: (model) => `Escola ainda não disponível: ${model}.`,
    unsupportedNumber: (model, number) => `O modelo ${model} ainda não calcula "${number}".`,
    unsupportedSubject: (model, subject) => `O modelo ${model} não aceita o sujeito "${subject}".`,
    unknownVariant: (option, dimension) => `Variante desconhecida "${option}" para ${dimension}.`,
  },
  results: {
    chartTitle: 'Seu mapa pitagórico',
    engine: (version) => `engine v${version}`,
    tableTitle: 'Tabela de conversão usada',
    tableHint: 'As letras do nome estão destacadas na tabela.',
    seeSteps: 'Ver passo a passo e regras',
    rulesTitle: 'Por quê? As regras aplicadas',
    sourcePrefix: 'Fonte:',
    divergenceTitle: '⚖ Os métodos divergem aqui',
    masterBadge: '✦ Número mestre — não reduz',
    masterShort: '✦ Mestre',
    debtBadge: (debt) => `Dívida cármica ${debt}`,
    digitsBadge: (digits) => `Dígitos: ${digits}`,
    noDigits: 'Nenhum dígito destacado',
    noLetters: 'nenhuma letra',
    chainSr: (chain) => `Cadeia de redução: ${chain}.`,
  },
  timeline: {
    range: (from, to) => `dos ${from} aos ${to} anos`,
    rangeOpen: (from) => `dos ${from} anos em diante`,
    current: 'vigente',
  },
  numberLabels: {
    expression: { title: 'Expressão', hint: 'todas as letras do nome' },
    motivation: { title: 'Motivação (Alma)', hint: 'somente as vogais' },
    impression: { title: 'Impressão (Personalidade)', hint: 'somente as consoantes' },
    'key-number': { title: 'Número Chave', hint: 'primeiro nome' },
    'life-path': { title: 'Destino (Caminho de Vida)', hint: 'data de nascimento completa' },
    psychic: { title: 'Psíquico', hint: 'dia do nascimento' },
    mission: { title: 'Missão', hint: 'Expressão + Destino' },
    'karmic-lessons': { title: 'Lições Cármicas', hint: 'dígitos ausentes na grade do nome' },
    'hidden-tendencies': { title: 'Tendências Ocultas', hint: 'dígitos repetidos 3+ vezes' },
    subconscious: { title: 'Subconsciente', hint: 'dígitos distintos presentes' },
    'life-cycles': { title: 'Ciclos de Vida', hint: 'ciclo vigente na data de referência' },
    pinnacles: { title: 'Pináculos', hint: 'pináculo vigente na data de referência' },
    challenges: { title: 'Desafios', hint: 'desafio vigente na data de referência' },
    'personal-year': { title: 'Ano Pessoal', hint: 'vibração do ano de referência' },
    'personal-month': { title: 'Mês Pessoal', hint: 'vibração do mês de referência' },
    'personal-day': { title: 'Dia Pessoal', hint: 'vibração do dia de referência' },
  },
  footer:
    'O Numerus é uma ferramenta de estudo, autoconhecimento e entretenimento cultural. Não substitui aconselhamento médico, psicológico, jurídico ou financeiro. O sistema de conversão de nomes praticado hoje foi estruturado no fim do séc. XIX / início do XX (L. Dow Balliett, Juno Jordan), reivindicando a herança pitagórica — cada escola exibe sua origem histórica real.',
}

const EN: UiMessages = {
  header: {
    title: 'Numerus',
    tagline:
      'Multi-model, interactive, educational numerology. Every number can be opened: you see the table used, the sum, the reduction and the rule behind each step.',
    deviceBadge: 'Everything is computed on this device — your name is never sent to any server.',
  },
  form: {
    nameLabel: 'Full birth name',
    namePlaceholder: 'E.g.: Mary Smith',
    birthLabel: 'Birth date',
    optionalTag: '(optional)',
    birthHint: 'Only needed for date-derived numbers. Like everything else, it never leaves your device.',
    referenceLabel: 'Reference date',
    referenceTag: '(for the time numbers)',
    referenceHint: 'Cycles, Pinnacles, Challenges and Personal Year/Month/Day are computed for this date — today by default.',
    variantsSummary: 'Calculation methods (school variants)',
    variantsNote: 'Schools diverge on methods — so the choice is yours, and every result records the variant used.',
    calculate: 'Calculate chart',
  },
  errors: {
    emptyName: 'Enter the full birth name.',
    unsupportedCharacters: (characters) =>
      `The name contains characters the Pythagorean table cannot convert: ${characters}. Nothing was silently discarded — adjust the name or wait for support for other alphabets.`,
    invalidBirthDate: 'The birth date is invalid — check day, month and year.',
    missingBirthDate: 'Enter the birth date to calculate date-derived numbers.',
    invalidReferenceDate: 'The reference date is invalid — check day, month and year.',
    missingReferenceDate: 'Enter the reference date to calculate the time numbers.',
    referenceBeforeBirth: 'The reference date cannot be before the birth date.',
    unknownModel: (model) => `School not available yet: ${model}.`,
    unsupportedNumber: (model, number) => `The ${model} model does not calculate "${number}" yet.`,
    unsupportedSubject: (model, subject) => `The ${model} model does not accept the "${subject}" subject.`,
    unknownVariant: (option, dimension) => `Unknown variant "${option}" for ${dimension}.`,
  },
  results: {
    chartTitle: 'Your Pythagorean chart',
    engine: (version) => `engine v${version}`,
    tableTitle: 'Conversion table used',
    tableHint: 'The letters of the name are highlighted in the table.',
    seeSteps: 'See step by step and rules',
    rulesTitle: 'Why? The rules applied',
    sourcePrefix: 'Source:',
    divergenceTitle: '⚖ Methods diverge here',
    masterBadge: '✦ Master number — does not reduce',
    masterShort: '✦ Master',
    debtBadge: (debt) => `Karmic debt ${debt}`,
    digitsBadge: (digits) => `Digits: ${digits}`,
    noDigits: 'No highlighted digits',
    noLetters: 'no letters',
    chainSr: (chain) => `Reduction chain: ${chain}.`,
  },
  timeline: {
    range: (from, to) => `from age ${from} to ${to}`,
    rangeOpen: (from) => `from age ${from} onwards`,
    current: 'current',
  },
  numberLabels: {
    expression: { title: 'Expression', hint: 'every letter of the name' },
    motivation: { title: 'Motivation (Soul Urge)', hint: 'vowels only' },
    impression: { title: 'Impression (Personality)', hint: 'consonants only' },
    'key-number': { title: 'Key Number', hint: 'first name' },
    'life-path': { title: 'Life Path', hint: 'full birth date' },
    psychic: { title: 'Psychic', hint: 'birth day' },
    mission: { title: 'Mission', hint: 'Expression + Life Path' },
    'karmic-lessons': { title: 'Karmic Lessons', hint: 'digits missing from the name grid' },
    'hidden-tendencies': { title: 'Hidden Tendencies', hint: 'digits repeated 3+ times' },
    subconscious: { title: 'Subconscious', hint: 'distinct digits present' },
    'life-cycles': { title: 'Life Cycles', hint: 'cycle current at the reference date' },
    pinnacles: { title: 'Pinnacles', hint: 'pinnacle current at the reference date' },
    challenges: { title: 'Challenges', hint: 'challenge current at the reference date' },
    'personal-year': { title: 'Personal Year', hint: 'vibration of the reference year' },
    'personal-month': { title: 'Personal Month', hint: 'vibration of the reference month' },
    'personal-day': { title: 'Personal Day', hint: 'vibration of the reference day' },
  },
  footer:
    'Numerus is a tool for study, self-knowledge and cultural entertainment. It does not replace medical, psychological, legal or financial advice. The name-conversion system as practiced today was structured in the late 19th / early 20th century (L. Dow Balliett, Juno Jordan), claiming the Pythagorean heritage — each school displays its real historical origin.',
}

const ES: UiMessages = {
  header: {
    title: 'Numerus',
    tagline:
      'Numerología multi-modelo, interactiva y educativa. Todo número puede abrirse: ves la tabla usada, la suma, la reducción y la regla que justificó cada paso.',
    deviceBadge: 'Todo se calcula en este dispositivo — tu nombre nunca se envía a ningún servidor.',
  },
  form: {
    nameLabel: 'Nombre completo de nacimiento',
    namePlaceholder: 'Ej.: María García',
    birthLabel: 'Fecha de nacimiento',
    optionalTag: '(opcional)',
    birthHint: 'Necesaria solo para los números derivados de la fecha. Como todo lo demás, nunca sale de tu dispositivo.',
    referenceLabel: 'Fecha de referencia',
    referenceTag: '(para los números de tiempo)',
    referenceHint: 'Ciclos, Pináculos, Desafíos y Año/Mes/Día Personal se calculan para esta fecha — por defecto, hoy.',
    variantsSummary: 'Métodos de cálculo (variantes de las escuelas)',
    variantsNote: 'Las escuelas divergen en los métodos — por eso la elección es tuya, y cada resultado registra la variante usada.',
    calculate: 'Calcular carta',
  },
  errors: {
    emptyName: 'Escribe el nombre completo de nacimiento.',
    unsupportedCharacters: (characters) =>
      `El nombre contiene caracteres que la tabla pitagórica no convierte: ${characters}. Nada se descartó en silencio — ajusta el nombre o espera el soporte para otros alfabetos.`,
    invalidBirthDate: 'La fecha de nacimiento es inválida — revisa día, mes y año.',
    missingBirthDate: 'Indica la fecha de nacimiento para calcular los números derivados de la fecha.',
    invalidReferenceDate: 'La fecha de referencia es inválida — revisa día, mes y año.',
    missingReferenceDate: 'Indica la fecha de referencia para calcular los números de tiempo.',
    referenceBeforeBirth: 'La fecha de referencia no puede ser anterior al nacimiento.',
    unknownModel: (model) => `Escuela aún no disponible: ${model}.`,
    unsupportedNumber: (model, number) => `El modelo ${model} aún no calcula "${number}".`,
    unsupportedSubject: (model, subject) => `El modelo ${model} no acepta el sujeto "${subject}".`,
    unknownVariant: (option, dimension) => `Variante desconocida "${option}" para ${dimension}.`,
  },
  results: {
    chartTitle: 'Tu carta pitagórica',
    engine: (version) => `engine v${version}`,
    tableTitle: 'Tabla de conversión usada',
    tableHint: 'Las letras del nombre están resaltadas en la tabla.',
    seeSteps: 'Ver paso a paso y reglas',
    rulesTitle: '¿Por qué? Las reglas aplicadas',
    sourcePrefix: 'Fuente:',
    divergenceTitle: '⚖ Los métodos divergen aquí',
    masterBadge: '✦ Número maestro — no se reduce',
    masterShort: '✦ Maestro',
    debtBadge: (debt) => `Deuda kármica ${debt}`,
    digitsBadge: (digits) => `Dígitos: ${digits}`,
    noDigits: 'Ningún dígito destacado',
    noLetters: 'ninguna letra',
    chainSr: (chain) => `Cadena de reducción: ${chain}.`,
  },
  timeline: {
    range: (from, to) => `de los ${from} a los ${to} años`,
    rangeOpen: (from) => `desde los ${from} años en adelante`,
    current: 'vigente',
  },
  numberLabels: {
    expression: { title: 'Expresión', hint: 'todas las letras del nombre' },
    motivation: { title: 'Motivación (Alma)', hint: 'solo las vocales' },
    impression: { title: 'Impresión (Personalidad)', hint: 'solo las consonantes' },
    'key-number': { title: 'Número Clave', hint: 'primer nombre' },
    'life-path': { title: 'Destino (Camino de Vida)', hint: 'fecha de nacimiento completa' },
    psychic: { title: 'Psíquico', hint: 'día de nacimiento' },
    mission: { title: 'Misión', hint: 'Expresión + Destino' },
    'karmic-lessons': { title: 'Lecciones Kármicas', hint: 'dígitos ausentes en la cuadrícula del nombre' },
    'hidden-tendencies': { title: 'Tendencias Ocultas', hint: 'dígitos repetidos 3+ veces' },
    subconscious: { title: 'Subconsciente', hint: 'dígitos distintos presentes' },
    'life-cycles': { title: 'Ciclos de Vida', hint: 'ciclo vigente en la fecha de referencia' },
    pinnacles: { title: 'Pináculos', hint: 'pináculo vigente en la fecha de referencia' },
    challenges: { title: 'Desafíos', hint: 'desafío vigente en la fecha de referencia' },
    'personal-year': { title: 'Año Personal', hint: 'vibración del año de referencia' },
    'personal-month': { title: 'Mes Personal', hint: 'vibración del mes de referencia' },
    'personal-day': { title: 'Día Personal', hint: 'vibración del día de referencia' },
  },
  footer:
    'Numerus es una herramienta de estudio, autoconocimiento y entretenimiento cultural. No sustituye el consejo médico, psicológico, jurídico ni financiero. El sistema de conversión de nombres tal como se practica hoy fue estructurado a finales del s. XIX / inicios del XX (L. Dow Balliett, Juno Jordan), reivindicando la herencia pitagórica — cada escuela muestra su origen histórico real.',
}

export const UI_MESSAGES: Readonly<Record<Locale, UiMessages>> = {
  'pt-BR': PT,
  en: EN,
  es: ES,
}
