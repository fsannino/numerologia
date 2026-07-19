import type { LocalizedText } from '@numerus/shared-kernel'
import type { NumberKind } from '../model-ids'
import type {
  Interpretation,
  InterpretationProvider,
  InterpretationRequest,
} from '../ports/interpretation-provider'

/**
 * Provider de interpretação com CONTEÚDO CURADO (ADR/spec §9: reflexão, não
 * veredito). Composição honesta e bounded: uma reflexão por VIBRAÇÃO (valor
 * reduzido 1–9 + mestres) + um enquadramento por tipo de número. Os números
 * de grade/contagem recebem só o enquadramento (o escalar não é vibração).
 * Nenhuma linguagem determinista, de saúde, jurídica ou financeira.
 */

/** Texto curado sempre nos três idiomas — evita fallbacks (branches) mortos. */
type FullText = { readonly 'pt-BR': string; readonly en: string; readonly es: string }
const text = (ptBR: string, en: string, es: string): FullText => ({ 'pt-BR': ptBR, en, es })

/** Reflexão pela vibração do número reduzido (1–9) e pelos mestres. */
const VALUE_REFLECTION: Readonly<Record<number, FullText>> = {
  1: text(
    'O 1 costuma ser associado a iniciativa e autonomia — um convite a refletir sobre como você começa as coisas e afirma sua individualidade.',
    'The 1 is often associated with initiative and autonomy — an invitation to reflect on how you begin things and assert your individuality.',
    'El 1 suele asociarse con iniciativa y autonomía — una invitación a reflexionar sobre cómo empiezas las cosas y afirmas tu individualidad.',
  ),
  2: text(
    'O 2 é ligado à cooperação e à sensibilidade — um espaço para pensar sobre parcerias, escuta e o valor da paciência.',
    'The 2 relates to cooperation and sensitivity — a space to think about partnerships, listening and the value of patience.',
    'El 2 se vincula con la cooperación y la sensibilidad — un espacio para pensar en asociaciones, escucha y el valor de la paciencia.',
  ),
  3: text(
    'O 3 remete à expressão e à criatividade — um convite a observar como você comunica e compartilha o que sente.',
    'The 3 evokes expression and creativity — an invitation to notice how you communicate and share what you feel.',
    'El 3 remite a la expresión y la creatividad — una invitación a observar cómo comunicas y compartes lo que sientes.',
  ),
  4: text(
    'O 4 é associado a estrutura e método — um espaço para refletir sobre estabilidade, rotina e construção paciente.',
    'The 4 is associated with structure and method — a space to reflect on stability, routine and patient building.',
    'El 4 se asocia con la estructura y el método — un espacio para reflexionar sobre estabilidad, rutina y construcción paciente.',
  ),
  5: text(
    'O 5 evoca movimento e liberdade — um convite a pensar sobre mudança, versatilidade e como você lida com o inesperado.',
    'The 5 evokes movement and freedom — an invitation to think about change, versatility and how you handle the unexpected.',
    'El 5 evoca movimiento y libertad — una invitación a pensar en el cambio, la versatilidad y cómo manejas lo inesperado.',
  ),
  6: text(
    'O 6 está ligado ao cuidado e à responsabilidade — um espaço para observar seus vínculos, o lar e o senso de harmonia.',
    'The 6 relates to care and responsibility — a space to observe your bonds, home and sense of harmony.',
    'El 6 se vincula con el cuidado y la responsabilidad — un espacio para observar tus vínculos, el hogar y el sentido de armonía.',
  ),
  7: text(
    'O 7 remete à análise e à interioridade — um convite a refletir sobre estudo, silêncio e a busca por sentido.',
    'The 7 evokes analysis and inwardness — an invitation to reflect on study, silence and the search for meaning.',
    'El 7 remite al análisis y la interioridad — una invitación a reflexionar sobre el estudio, el silencio y la búsqueda de sentido.',
  ),
  8: text(
    'O 8 é associado a realização e gestão — um espaço para pensar sobre metas, recursos e o equilíbrio entre dar e receber.',
    'The 8 is associated with achievement and management — a space to think about goals, resources and the balance between giving and receiving.',
    'El 8 se asocia con la realización y la gestión — un espacio para pensar en metas, recursos y el equilibrio entre dar y recibir.',
  ),
  9: text(
    'O 9 evoca amplitude e compaixão — um convite a observar o que você encerra, o que solta e como olha para o todo.',
    'The 9 evokes breadth and compassion — an invitation to notice what you close, what you release and how you view the whole.',
    'El 9 evoca amplitud y compasión — una invitación a observar lo que cierras, lo que sueltas y cómo miras el conjunto.',
  ),
  11: text(
    'O 11 (mestre) costuma ser lido como sensibilidade intensificada — um espaço para refletir sobre intuição e inspiração, sem cobrança de "estar à altura".',
    'The 11 (master) is often read as heightened sensitivity — a space to reflect on intuition and inspiration, without pressure to "live up" to it.',
    'El 11 (maestro) suele leerse como sensibilidad intensificada — un espacio para reflexionar sobre intuición e inspiración, sin presión por "estar a la altura".',
  ),
  22: text(
    'O 22 (mestre) é associado à construção de longo alcance — um convite a pensar em visão prática e projetos que unem sonho e método.',
    'The 22 (master) is associated with far-reaching building — an invitation to think about practical vision and projects that unite dream and method.',
    'El 22 (maestro) se asocia con la construcción de largo alcance — una invitación a pensar en visión práctica y proyectos que unen sueño y método.',
  ),
  33: text(
    'O 33 (mestre) remete ao cuidado ampliado — um espaço para refletir sobre serviço, ensino e a expressão do afeto.',
    'The 33 (master) evokes expanded care — a space to reflect on service, teaching and the expression of affection.',
    'El 33 (maestro) remite al cuidado ampliado — un espacio para reflexionar sobre el servicio, la enseñanza y la expresión del afecto.',
  ),
}

/** Enquadramento por tipo de número: o que aquele número observa. */
const KIND_FRAMING: Readonly<Partial<Record<NumberKind, FullText>>> = {
  expression: text('Na Expressão (todo o nome), ', 'In the Expression (the whole name), ', 'En la Expresión (todo el nombre), '),
  motivation: text('Na Motivação (o que te move, pelas vogais), ', 'In the Motivation (what moves you, from the vowels), ', 'En la Motivación (lo que te mueve, por las vocales), '),
  impression: text('Na Impressão (como você é percebido, pelas consoantes), ', 'In the Impression (how you are perceived, from the consonants), ', 'En la Impresión (cómo te perciben, por las consonantes), '),
  'key-number': text('No Número Chave (o primeiro nome), ', 'In the Key Number (the first name), ', 'En el Número Clave (el primer nombre), '),
  'life-path': text('No Destino (o caminho da data de nascimento), ', 'In the Life Path (the road from the birth date), ', 'En el Destino (el camino de la fecha de nacimiento), '),
  psychic: text('No Psíquico (o dia do nascimento), ', 'In the Psychic (the birth day), ', 'En el Psíquico (el día de nacimiento), '),
  mission: text('Na Missão (nome + data), ', 'In the Mission (name + date), ', 'En la Misión (nombre + fecha), '),
  'personal-year': text('No Ano Pessoal (o ciclo atual), ', 'In the Personal Year (the current cycle), ', 'En el Año Personal (el ciclo actual), '),
  'personal-month': text('No Mês Pessoal, ', 'In the Personal Month, ', 'En el Mes Personal, '),
  'personal-day': text('No Dia Pessoal, ', 'In the Personal Day, ', 'En el Día Personal, '),
  'union-destiny': text('No Destino da União, ', 'In the Union Destiny, ', 'En el Destino de la Unión, '),
  'union-soul': text('Na Alma da União, ', 'In the Union Soul, ', 'En el Alma de la Unión, '),
  'union-expression': text('Na Expressão da União, ', 'In the Union Expression, ', 'En la Expresión de la Unión, '),
  'union-personality': text('Na Personalidade da União, ', 'In the Union Personality, ', 'En la Personalidad de la Unión, '),
  'union-mission': text('Na Missão da União, ', 'In the Union Mission, ', 'En la Misión de la Unión, '),
  'union-key': text('Na Chave da União, ', 'In the Union Key, ', 'En la Clave de la Unión, '),
  'marriage-governing': text('No Número Regente da união, ', 'In the union Governing Number, ', 'En el Número Regente de la unión, '),
  'marriage-personal-year': text('No Ano Pessoal do casamento, ', 'In the marriage Personal Year, ', 'En el Año Personal del matrimonio, '),
  'brand-harmony': text('Na Harmonia da marca, ', 'In the Brand Harmony, ', 'En la Armonía de la marca, '),
  'founder-affinity': text('Na Afinidade com o sócio, ', 'In the Founder Affinity, ', 'En la Afinidad con el socio, '),
  'gematria-value': text('No valor Gematria (transliteração padrão — reconstrução), ', 'In the Gematria value (standard transliteration — a reconstruction), ', 'En el valor Gematría (transliteración estándar — una reconstrucción), '),
}

/** Números cujo escalar é vibração (1–9). Grade/contagem não entram aqui. */
const VIBRATION_KINDS: ReadonlySet<NumberKind> = new Set(Object.keys(KIND_FRAMING) as NumberKind[])

function lowerFirst(value: string): string {
  return value.charAt(0).toLowerCase() + value.slice(1)
}

function compose(framing: FullText, reflection: FullText): LocalizedText {
  return {
    'pt-BR': framing['pt-BR'] + lowerFirst(reflection['pt-BR']),
    en: framing.en + lowerFirst(reflection.en),
    es: framing.es + lowerFirst(reflection.es),
  }
}

export const curatedInterpretationProvider: InterpretationProvider = {
  interpret(request: InterpretationRequest): Interpretation | null {
    const framing = KIND_FRAMING[request.resultId]
    if (framing === undefined || !VIBRATION_KINDS.has(request.resultId)) {
      return null
    }
    const reflection = VALUE_REFLECTION[request.value.reduced]
    if (reflection === undefined) {
      return null
    }
    return { text: compose(framing, reflection), source: 'curated' }
  },
}
