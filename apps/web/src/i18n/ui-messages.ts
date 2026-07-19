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
    readonly schoolsLabel: string
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
    readonly compoundBadge: (compound: number) => string
    readonly interpretationLabel: string
  }
  readonly timeline: {
    readonly range: (from: number, to: number) => string
    readonly rangeOpen: (from: number) => string
    readonly current: string
  }
  readonly matrix: {
    readonly title: string
    readonly numberColumn: string
    readonly notCalculated: string
    readonly divergenceCause: string
    readonly convergenceNote: string
  }
  readonly modes: { readonly chart: string; readonly signature: string; readonly synastry: string; readonly company: string; readonly marriage: string }
  readonly signature: {
    readonly intro: string
    readonly registrationLabel: string
    readonly signatureLabel: string
    readonly compare: string
    readonly changedSummary: (count: number) => string
    readonly noChange: string
    readonly changedTag: string
    readonly registrationColumn: string
    readonly signatureColumn: string
  }
  readonly synastry: {
    readonly intro: string
    readonly personALabel: string
    readonly personBLabel: string
    readonly build: string
    readonly unionTitle: string
    readonly personalYearTitle: string
    readonly convergenceNote: (count: number) => string
    readonly reflectionDisclaimer: string
  }
  readonly company: {
    readonly intro: string
    readonly legalNameLabel: string
    readonly tradeNameLabel: string
    readonly incorporationLabel: string
    readonly founderLabel: string
    readonly build: string
    readonly corporateTitle: string
    readonly brandTitle: string
    readonly harmonyTitle: string
  }
  readonly marriage: {
    readonly intro: string
    readonly weddingDateLabel: string
    readonly build: string
    readonly unionOfMarriageTitle: string
    readonly coupleTitle: string
  }
  readonly loShu: {
    readonly strengthArrow: string
    readonly absenceArrow: string
    readonly arrowsTitle: string
    readonly noArrows: string
    readonly emptyCell: string
  }
  readonly gematria: {
    readonly standardLabel: string
    readonly spectrumLabel: (min: number, max: number) => string
    readonly combinationsLabel: (count: number) => string
    readonly candidatesTitle: string
    readonly ambiguous: string
  }
  readonly vedic: {
    readonly qualitiesLabel: string
  }
  readonly kabbalistic: {
    readonly headline: (distinct: number) => string
    readonly subtitle: string
    readonly tableHeader: string
    readonly tableLabel: {
      readonly 'sequential-1-9': string
      readonly 'chaldean-like-1-8': string
    }
    readonly reductionLabel: {
      readonly decimal: string
      readonly 'modular-22': string
    }
    readonly own: string
    readonly coincides: { readonly pythagorean: string; readonly chaldean: string }
    readonly total: (raw: number) => string
    readonly whyMultiple: string
  }
  readonly provenance: {
    readonly title: string
    readonly canonicity: {
      readonly 'documented-tradition': string
      readonly 'modern-systematization': string
      readonly 'contemporary-construction': string
    }
    readonly standardization: {
      readonly standardized: string
      readonly 'variant-dependent': string
      readonly unstandardized: string
    }
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
    schoolsLabel: 'Escolas numerológicas',
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
    compoundBadge: (compound) => `Composto ${compound}`,
    interpretationLabel: 'Reflexão (conteúdo curado — não é veredito)',
  },
  timeline: {
    range: (from, to) => `dos ${from} aos ${to} anos`,
    rangeOpen: (from) => `dos ${from} anos em diante`,
    current: 'vigente',
  },
  matrix: {
    title: 'Matriz comparativa entre escolas',
    numberColumn: 'Número',
    notCalculated: 'não calcula',
    divergenceCause: 'Onde os valores divergem, a causa é a tabela de letras: 1–9 pela posição alfabética (pitagórica) × 1–8 por afinidade fonética, sem o 9 (caldaica) — e a caldaica não preserva números mestres na redução.',
    convergenceNote: 'Quando escolas independentes apontam o mesmo número, isso é convergência de método — não evidência.',
  },
  modes: { chart: 'Mapa completo', signature: 'Assinatura / delta', synastry: 'Casal / sinastria', company: 'Empresa', marriage: 'Casamento' },
  signature: {
    intro: 'Compare o nome de registro com o nome que você usa no dia a dia e veja o que muda quando você assina de outra forma.',
    registrationLabel: 'Nome de registro',
    signatureLabel: 'Nome de assinatura / dia a dia',
    compare: 'Comparar assinaturas',
    changedSummary: (count) => `${count} ${count === 1 ? 'número muda' : 'números mudam'} entre os dois nomes.`,
    noChange: 'Nenhum número do nome muda entre as duas formas.',
    changedTag: 'muda',
    registrationColumn: 'Registro',
    signatureColumn: 'Assinatura',
  },
  synastry: {
    intro: 'Dois mapas produzem os números da união. É vocabulário para reflexão sobre a relação — nunca um veredito de compatibilidade.',
    personALabel: 'Primeira pessoa',
    personBLabel: 'Segunda pessoa',
    build: 'Calcular sinastria',
    unionTitle: 'Números da união',
    personalYearTitle: 'Comparação de Anos Pessoais',
    convergenceNote: (count) => `${count} ${count === 1 ? 'número da união converge' : 'números da união convergem'} (as duas pessoas já compartilham o mesmo dígito). Convergência não é evidência de harmonia.`,
    reflectionDisclaimer: 'Estes números são pontos de partida para conversa e autoconhecimento a dois, não uma medida de compatibilidade nem uma previsão sobre o relacionamento.',
  },
  company: {
    intro: 'A razão social, o nome fantasia e a data de constituição produzem a identidade corporativa, a marca e a harmonia entre elas. Vocabulário para reflexão sobre a marca — não um veredito comercial.',
    legalNameLabel: 'Razão social',
    tradeNameLabel: 'Nome fantasia',
    incorporationLabel: 'Data de constituição',
    founderLabel: 'Nome de um sócio',
    build: 'Calcular mapa da empresa',
    corporateTitle: 'Identidade corporativa (razão social)',
    brandTitle: 'Marca (nome fantasia)',
    harmonyTitle: 'Harmonia e afinidade',
  },
  marriage: {
    intro: 'O casal e a data do casamento produzem o número regente da união e o Ano Pessoal do casamento. Vocabulário para reflexão sobre a união — não um veredito.',
    weddingDateLabel: 'Data do casamento',
    build: 'Calcular união formal',
    unionOfMarriageTitle: 'Números da união formal (data do casamento)',
    coupleTitle: 'Números da união do casal',
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
    'union-destiny': { title: 'Destino da União', hint: 'dos dois Destinos' },
    'union-soul': { title: 'Alma da União', hint: 'das duas Motivações' },
    'union-expression': { title: 'Expressão da União', hint: 'das duas Expressões' },
    'union-personality': { title: 'Personalidade da União', hint: 'das duas Impressões' },
    'union-mission': { title: 'Missão da União', hint: 'das duas Missões' },
    'union-key': { title: 'Chave da União', hint: 'dos dois Números Chave' },
    'brand-harmony': { title: 'Harmonia da Marca', hint: 'razão social + nome fantasia' },
    'founder-affinity': { title: 'Afinidade com o Sócio', hint: 'razão social + sócio' },
    'marriage-governing': { title: 'Número Regente da União', hint: 'Caminho de Vida da data do casamento' },
    'marriage-personal-year': { title: 'Ano Pessoal do Casamento', hint: 'ciclo atual da união' },
    'lo-shu-grid': { title: 'Grade Lo Shu', hint: 'números distintos presentes na data' },
    'gematria-value': { title: 'Valor Gematria', hint: 'transliteração padrão (há candidatas)' },
    'vedic-moolank': { title: 'Moolank (raiz)', hint: 'dia do nascimento · planeta regente' },
    'vedic-bhagyank': { title: 'Bhagyank (destino)', hint: 'data completa · planeta regente' },
    'kabbalistic-name': { title: 'Número do Nome (cabalístico)', hint: 'nº de leituras distintas · veja a matriz' },
  },
  vedic: {
    qualitiesLabel: 'Qualidades',
  },
  kabbalistic: {
    headline: (distinct) => `Este nome tem ${distinct} ${distinct === 1 ? 'leitura cabalística' : 'leituras cabalísticas distintas'} — veja de onde cada uma vem.`,
    subtitle: 'A escola trabalha só o nome (a data não entra).',
    tableHeader: 'Tabela de letras',
    tableLabel: { 'sequential-1-9': 'Sequencial 1–9', 'chaldean-like-1-8': 'Caldaica 1–8' },
    reductionLabel: { decimal: 'Redução decimal (1–9)', 'modular-22': 'Arcano (1–22)' },
    own: 'próprio',
    coincides: { pythagorean: '≡ Pitagórica', chaldean: '≡ Caldaica' },
    total: (raw) => `total ${raw}`,
    whyMultiple:
      'A adaptação da Cabala ao alfabeto latino não tem tabela única entre autores. Em vez de escolher uma em silêncio, o Numerus mostra todas e diz a origem de cada número. Onde coincide com o Pitagórico ou o Caldeu, a diferença está na interpretação, não no cálculo.',
  },
  provenance: {
    title: 'Lastro histórico desta escola',
    canonicity: {
      'documented-tradition': 'tradição documentada',
      'modern-systematization': 'sistematização moderna',
      'contemporary-construction': 'construção contemporânea',
    },
    standardization: {
      standardized: 'método padronizado',
      'variant-dependent': 'depende de variante',
      unstandardized: 'não padronizada',
    },
  },
  loShu: {
    strengthArrow: 'seta de força',
    absenceArrow: 'seta de ausência',
    arrowsTitle: 'Setas (linhas completas ou ausentes)',
    noArrows: 'Nenhuma linha completa ou totalmente ausente nesta data.',
    emptyCell: 'ausente',
  },
  gematria: {
    standardLabel: 'transliteração padrão',
    spectrumLabel: (min, max) => `espectro de valores: ${min} a ${max}`,
    combinationsLabel: (count) => `${count} combinações possíveis`,
    candidatesTitle: 'Candidatas por letra (a transliteração é uma reconstrução)',
    ambiguous: 'ambígua',
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
    schoolsLabel: 'Numerology schools',
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
    compoundBadge: (compound) => `Compound ${compound}`,
    interpretationLabel: 'Reflection (curated content — not a verdict)',
  },
  timeline: {
    range: (from, to) => `from age ${from} to ${to}`,
    rangeOpen: (from) => `from age ${from} onwards`,
    current: 'current',
  },
  matrix: {
    title: 'School comparison matrix',
    numberColumn: 'Number',
    notCalculated: 'not calculated',
    divergenceCause: 'Where values diverge, the cause is the letter table: 1–9 by alphabetical position (Pythagorean) × 1–8 by phonetic affinity, without 9 (Chaldean) — and the Chaldean school does not preserve master numbers when reducing.',
    convergenceNote: 'When independent schools point to the same number, that is convergence of method — not evidence.',
  },
  modes: { chart: 'Full chart', signature: 'Signature / delta', synastry: 'Couple / synastry', company: 'Company', marriage: 'Marriage' },
  signature: {
    intro: 'Compare your registration name with the name you use day to day and see what changes when you sign differently.',
    registrationLabel: 'Registration name',
    signatureLabel: 'Signature / everyday name',
    compare: 'Compare signatures',
    changedSummary: (count) => `${count} ${count === 1 ? 'number changes' : 'numbers change'} between the two names.`,
    noChange: 'No name number changes between the two forms.',
    changedTag: 'changes',
    registrationColumn: 'Registration',
    signatureColumn: 'Signature',
  },
  synastry: {
    intro: 'Two charts produce the union numbers. This is vocabulary for reflecting on the relationship — never a compatibility verdict.',
    personALabel: 'First person',
    personBLabel: 'Second person',
    build: 'Calculate synastry',
    unionTitle: 'Union numbers',
    personalYearTitle: 'Personal Year comparison',
    convergenceNote: (count) => `${count} union ${count === 1 ? 'number converges' : 'numbers converge'} (both people already share the same digit). Convergence is not evidence of harmony.`,
    reflectionDisclaimer: 'These numbers are starting points for conversation and shared self-knowledge, not a measure of compatibility nor a prediction about the relationship.',
  },
  company: {
    intro: 'The legal name, trade name and incorporation date produce the corporate identity, the brand and the harmony between them. Vocabulary for reflecting on the brand — not a commercial verdict.',
    legalNameLabel: 'Legal name',
    tradeNameLabel: 'Trade name',
    incorporationLabel: 'Incorporation date',
    founderLabel: "A founder's name",
    build: 'Calculate company chart',
    corporateTitle: 'Corporate identity (legal name)',
    brandTitle: 'Brand (trade name)',
    harmonyTitle: 'Harmony and affinity',
  },
  marriage: {
    intro: 'The couple and the wedding date produce the union governing number and the marriage Personal Year. Vocabulary for reflecting on the union — not a verdict.',
    weddingDateLabel: 'Wedding date',
    build: 'Calculate formal union',
    unionOfMarriageTitle: 'Formal union numbers (wedding date)',
    coupleTitle: "Couple's union numbers",
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
    'union-destiny': { title: 'Union Destiny', hint: 'from both Life Paths' },
    'union-soul': { title: 'Union Soul', hint: 'from both Motivations' },
    'union-expression': { title: 'Union Expression', hint: 'from both Expressions' },
    'union-personality': { title: 'Union Personality', hint: 'from both Impressions' },
    'union-mission': { title: 'Union Mission', hint: 'from both Missions' },
    'union-key': { title: 'Union Key', hint: 'from both Key Numbers' },
    'brand-harmony': { title: 'Brand Harmony', hint: 'legal name + trade name' },
    'founder-affinity': { title: 'Founder Affinity', hint: 'legal name + founder' },
    'marriage-governing': { title: 'Union Governing Number', hint: 'Life Path of the wedding date' },
    'marriage-personal-year': { title: 'Marriage Personal Year', hint: "the union's current cycle" },
    'lo-shu-grid': { title: 'Lo Shu grid', hint: 'distinct numbers present in the date' },
    'gematria-value': { title: 'Gematria value', hint: 'standard transliteration (candidates exist)' },
    'vedic-moolank': { title: 'Moolank (root)', hint: 'birth day · ruling planet' },
    'vedic-bhagyank': { title: 'Bhagyank (destiny)', hint: 'full date · ruling planet' },
    'kabbalistic-name': { title: 'Name Number (Kabbalistic)', hint: 'nº of distinct readings · see the matrix' },
  },
  vedic: {
    qualitiesLabel: 'Qualities',
  },
  kabbalistic: {
    headline: (distinct) => `This name has ${distinct} distinct Kabbalistic ${distinct === 1 ? 'reading' : 'readings'} — see where each comes from.`,
    subtitle: 'The school works only with the name (the date does not enter).',
    tableHeader: 'Letter table',
    tableLabel: { 'sequential-1-9': 'Sequential 1–9', 'chaldean-like-1-8': 'Chaldean 1–8' },
    reductionLabel: { decimal: 'Decimal reduction (1–9)', 'modular-22': 'Arcano (1–22)' },
    own: 'own',
    coincides: { pythagorean: '≡ Pythagorean', chaldean: '≡ Chaldean' },
    total: (raw) => `total ${raw}`,
    whyMultiple:
      'Adapting the Kabbalah to the Latin alphabet has no single table across authors. Instead of silently picking one, Numerus shows all and states the origin of each number. Where it matches the Pythagorean or Chaldean reading, the difference is in interpretation, not arithmetic.',
  },
  provenance: {
    title: 'Historical grounding of this school',
    canonicity: {
      'documented-tradition': 'documented tradition',
      'modern-systematization': 'modern systematization',
      'contemporary-construction': 'contemporary construction',
    },
    standardization: {
      standardized: 'standardized method',
      'variant-dependent': 'variant-dependent',
      unstandardized: 'unstandardized',
    },
  },
  loShu: {
    strengthArrow: 'arrow of strength',
    absenceArrow: 'arrow of absence',
    arrowsTitle: 'Arrows (complete or absent lines)',
    noArrows: 'No complete or fully-absent line in this date.',
    emptyCell: 'absent',
  },
  gematria: {
    standardLabel: 'standard transliteration',
    spectrumLabel: (min, max) => `value spectrum: ${min} to ${max}`,
    combinationsLabel: (count) => `${count} possible combinations`,
    candidatesTitle: 'Candidates per letter (transliteration is a reconstruction)',
    ambiguous: 'ambiguous',
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
    schoolsLabel: 'Escuelas numerológicas',
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
    compoundBadge: (compound) => `Compuesto ${compound}`,
    interpretationLabel: 'Reflexión (contenido curado — no es un veredicto)',
  },
  timeline: {
    range: (from, to) => `de los ${from} a los ${to} años`,
    rangeOpen: (from) => `desde los ${from} años en adelante`,
    current: 'vigente',
  },
  matrix: {
    title: 'Matriz comparativa entre escuelas',
    numberColumn: 'Número',
    notCalculated: 'no calcula',
    divergenceCause: 'Donde los valores divergen, la causa es la tabla de letras: 1–9 por posición alfabética (pitagórica) × 1–8 por afinidad fonética, sin el 9 (caldea) — y la escuela caldea no preserva números maestros al reducir.',
    convergenceNote: 'Cuando escuelas independientes señalan el mismo número, eso es convergencia de método — no evidencia.',
  },
  modes: { chart: 'Carta completa', signature: 'Firma / delta', synastry: 'Pareja / sinastría', company: 'Empresa', marriage: 'Matrimonio' },
  signature: {
    intro: 'Compara tu nombre de registro con el nombre que usas a diario y ve qué cambia cuando firmas de otra forma.',
    registrationLabel: 'Nombre de registro',
    signatureLabel: 'Nombre de firma / diario',
    compare: 'Comparar firmas',
    changedSummary: (count) => `${count} ${count === 1 ? 'número cambia' : 'números cambian'} entre los dos nombres.`,
    noChange: 'Ningún número del nombre cambia entre las dos formas.',
    changedTag: 'cambia',
    registrationColumn: 'Registro',
    signatureColumn: 'Firma',
  },
  synastry: {
    intro: 'Dos cartas producen los números de la unión. Es vocabulario para reflexionar sobre la relación — nunca un veredicto de compatibilidad.',
    personALabel: 'Primera persona',
    personBLabel: 'Segunda persona',
    build: 'Calcular sinastría',
    unionTitle: 'Números de la unión',
    personalYearTitle: 'Comparación de Años Personales',
    convergenceNote: (count) => `${count} ${count === 1 ? 'número de la unión converge' : 'números de la unión convergen'} (las dos personas ya comparten el mismo dígito). La convergencia no es evidencia de armonía.`,
    reflectionDisclaimer: 'Estos números son puntos de partida para la conversación y el autoconocimiento en pareja, no una medida de compatibilidad ni una predicción sobre la relación.',
  },
  company: {
    intro: 'La razón social, el nombre comercial y la fecha de constitución producen la identidad corporativa, la marca y la armonía entre ellas. Vocabulario para reflexionar sobre la marca — no un veredicto comercial.',
    legalNameLabel: 'Razón social',
    tradeNameLabel: 'Nombre comercial',
    incorporationLabel: 'Fecha de constitución',
    founderLabel: 'Nombre de un socio',
    build: 'Calcular carta de la empresa',
    corporateTitle: 'Identidad corporativa (razón social)',
    brandTitle: 'Marca (nombre comercial)',
    harmonyTitle: 'Armonía y afinidad',
  },
  marriage: {
    intro: 'La pareja y la fecha de la boda producen el número regente de la unión y el Año Personal del matrimonio. Vocabulario para reflexionar sobre la unión — no un veredicto.',
    weddingDateLabel: 'Fecha de la boda',
    build: 'Calcular unión formal',
    unionOfMarriageTitle: 'Números de la unión formal (fecha de la boda)',
    coupleTitle: 'Números de la unión de la pareja',
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
    'union-destiny': { title: 'Destino de la Unión', hint: 'de ambos Destinos' },
    'union-soul': { title: 'Alma de la Unión', hint: 'de ambas Motivaciones' },
    'union-expression': { title: 'Expresión de la Unión', hint: 'de ambas Expresiones' },
    'union-personality': { title: 'Personalidad de la Unión', hint: 'de ambas Impresiones' },
    'union-mission': { title: 'Misión de la Unión', hint: 'de ambas Misiones' },
    'union-key': { title: 'Clave de la Unión', hint: 'de ambos Números Clave' },
    'brand-harmony': { title: 'Armonía de la Marca', hint: 'razón social + nombre comercial' },
    'founder-affinity': { title: 'Afinidad con el Socio', hint: 'razón social + socio' },
    'marriage-governing': { title: 'Número Regente de la Unión', hint: 'Camino de Vida de la fecha de la boda' },
    'marriage-personal-year': { title: 'Año Personal del Matrimonio', hint: 'ciclo actual de la unión' },
    'lo-shu-grid': { title: 'Cuadrícula Lo Shu', hint: 'números distintos presentes en la fecha' },
    'gematria-value': { title: 'Valor Gematría', hint: 'transliteración estándar (hay candidatas)' },
    'vedic-moolank': { title: 'Moolank (raíz)', hint: 'día de nacimiento · planeta regente' },
    'vedic-bhagyank': { title: 'Bhagyank (destino)', hint: 'fecha completa · planeta regente' },
    'kabbalistic-name': { title: 'Número del Nombre (cabalístico)', hint: 'nº de lecturas distintas · ve la matriz' },
  },
  vedic: {
    qualitiesLabel: 'Cualidades',
  },
  kabbalistic: {
    headline: (distinct) => `Este nombre tiene ${distinct} ${distinct === 1 ? 'lectura cabalística' : 'lecturas cabalísticas distintas'} — mira de dónde viene cada una.`,
    subtitle: 'La escuela trabaja solo el nombre (la fecha no entra).',
    tableHeader: 'Tabla de letras',
    tableLabel: { 'sequential-1-9': 'Secuencial 1–9', 'chaldean-like-1-8': 'Caldea 1–8' },
    reductionLabel: { decimal: 'Reducción decimal (1–9)', 'modular-22': 'Arcano (1–22)' },
    own: 'propio',
    coincides: { pythagorean: '≡ Pitagórica', chaldean: '≡ Caldea' },
    total: (raw) => `total ${raw}`,
    whyMultiple:
      'Adaptar la Cábala al alfabeto latino no tiene una tabla única entre autores. En vez de elegir una en silencio, Numerus muestra todas y dice el origen de cada número. Donde coincide con el Pitagórico o el Caldeo, la diferencia está en la interpretación, no en el cálculo.',
  },
  provenance: {
    title: 'Base histórica de esta escuela',
    canonicity: {
      'documented-tradition': 'tradición documentada',
      'modern-systematization': 'sistematización moderna',
      'contemporary-construction': 'construcción contemporánea',
    },
    standardization: {
      standardized: 'método estandarizado',
      'variant-dependent': 'depende de variante',
      unstandardized: 'no estandarizada',
    },
  },
  loShu: {
    strengthArrow: 'flecha de fuerza',
    absenceArrow: 'flecha de ausencia',
    arrowsTitle: 'Flechas (líneas completas o ausentes)',
    noArrows: 'Ninguna línea completa o totalmente ausente en esta fecha.',
    emptyCell: 'ausente',
  },
  gematria: {
    standardLabel: 'transliteración estándar',
    spectrumLabel: (min, max) => `espectro de valores: ${min} a ${max}`,
    combinationsLabel: (count) => `${count} combinaciones posibles`,
    candidatesTitle: 'Candidatas por letra (la transliteración es una reconstrucción)',
    ambiguous: 'ambigua',
  },
  footer:
    'Numerus es una herramienta de estudio, autoconocimiento y entretenimiento cultural. No sustituye el consejo médico, psicológico, jurídico ni financiero. El sistema de conversión de nombres tal como se practica hoy fue estructurado a finales del s. XIX / inicios del XX (L. Dow Balliett, Juno Jordan), reivindicando la herencia pitagórica — cada escuela muestra su origen histórico real.',
}

export const UI_MESSAGES: Readonly<Record<Locale, UiMessages>> = {
  'pt-BR': PT,
  en: EN,
  es: ES,
}
