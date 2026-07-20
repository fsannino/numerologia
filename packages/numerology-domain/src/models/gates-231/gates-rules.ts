import type { LocalizedText } from '@numerus/shared-kernel'
import type { RuleReference } from '../../trace/calculation-trace'

const text = (ptBR: string, en: string, es: string): LocalizedText => ({ 'pt-BR': ptBR, en, es })

/** Regras dos 231 Portões (Sefer Yetzirah). */
export const GATES_RULES = {
  gatesOfSeferYetzirah: {
    id: 'gates-231/sefer-yetzirah',
    rule: text(
      'Os 231 portões são todas as combinações de pares das 22 letras hebraicas — C(22,2) = 231 (Sefer Yetzirah 2:4). É uma estrutura cosmogônica sobre a combinação das letras na criação, não uma análise de nome pessoal.',
      'The 231 gates are all pairwise combinations of the 22 Hebrew letters — C(22,2) = 231 (Sefer Yetzirah 2:4). It is a cosmogonic structure about the combination of letters in creation, not a personal-name analysis.',
      'Las 231 puertas son todas las combinaciones de pares de las 22 letras hebreas — C(22,2) = 231 (Sefer Yetzirah 2:4). Es una estructura cosmogónica sobre la combinación de las letras en la creación, no un análisis de nombre personal.',
    ),
    source: text('Sefer Yetzirah 2:4.', 'Sefer Yetzirah 2:4.', 'Sefer Yetzirah 2:4.'),
  },
  applicationIsContemporary: {
    id: 'gates-231/contemporary-application',
    rule: text(
      'NÃO há fonte tradicional para derivar "os portões de um nome". Os modos de ativação (pares de letras distintas; pares vizinhos) são construções contemporâneas, expostas como estrutura — sem leitura por portão, que seria doutrina inventada (§9). Exibimos os portões, seus valores e a referência; nada mais.',
      'There is NO traditional source for deriving "the gates of a name". The activation modes (distinct-letter pairs; adjacent pairs) are contemporary constructions, shown as structure — with no per-gate reading, which would be invented doctrine (§9). We display the gates, their values and the reference; nothing more.',
      'NO hay fuente tradicional para derivar "las puertas de un nombre". Los modos de activación (pares de letras distintas; pares vecinos) son construcciones contemporáneas, mostradas como estructura — sin lectura por puerta, que sería doctrina inventada (§9). Mostramos las puertas, sus valores y la referencia; nada más.',
    ),
    source: text(
      'Postura epistêmica do produto (§9); a transliteração é reconstrução (ADR-0008).',
      'Product epistemic stance (§9); transliteration is a reconstruction (ADR-0008).',
      'Postura epistémica del producto (§9); la transliteración es una reconstrucción (ADR-0008).',
    ),
  },
} as const satisfies Record<string, RuleReference>
