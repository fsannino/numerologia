import type { LocalizedText } from '@numerus/shared-kernel'
import type { RuleReference } from '../../trace/calculation-trace'

const text = (ptBR: string, en: string, es: string): LocalizedText => ({ 'pt-BR': ptBR, en, es })

/** Regras da Numerologia Cabalística (adaptação latina). */
export const KABBALISTIC_RULES = {
  nameOnly: {
    id: 'kabbalistic/name-only',
    rule: text(
      'A numerologia cabalística trabalha apenas o nome — a data de nascimento não entra. A Cabala considera o nome a expressão sonora da alma. É a diferença mais nítida em relação às escolas pitagórica e caldaica.',
      'Kabbalistic numerology works only with the name — the birth date does not enter. The Kabbalah regards the name as the sonic expression of the soul. It is the sharpest difference from the Pythagorean and Chaldean schools.',
      'La numerología cabalística trabaja solo con el nombre — la fecha de nacimiento no entra. La Cábala considera el nombre la expresión sonora del alma. Es la diferencia más nítida frente a las escuelas pitagórica y caldea.',
    ),
    source: text(
      'Tradição cabalística; obras de divulgação em pt-BR (Trevisani, C. Rosa).',
      'Kabbalistic tradition; popular works (Trevisani, C. Rosa).',
      'Tradición cabalística; obras de divulgación (Trevisani, C. Rosa).',
    ),
  },
  unstandardizedTable: {
    id: 'kabbalistic/unstandardized-table',
    rule: text(
      'A adaptação da Cabala ao alfabeto latino NÃO tem tabela única entre autores: circulam a sequencial 1–9 (igual à pitagórica) e a de afinidade fonética 1–8 (como a caldaica). O produto expõe as duas leituras em vez de escolher uma em silêncio — a escolha silenciosa seria uma mentira embutida.',
      'Adapting the Kabbalah to the Latin alphabet has NO single table across authors: the sequential 1–9 (same as Pythagorean) and the phonetic 1–8 (like Chaldean) both circulate. The product exposes both readings instead of silently picking one — a silent pick would be an embedded lie.',
      'Adaptar la Cábala al alfabeto latino NO tiene una tabla única entre autores: circulan la secuencial 1–9 (igual a la pitagórica) y la de afinidad fonética 1–8 (como la caldea). El producto expone ambas lecturas en vez de elegir una en silencio.',
    ),
    source: text(
      'Comparação de fontes de divulgação; postura epistêmica do produto (§9).',
      'Comparison of popular sources; product epistemic stance (§9).',
      'Comparación de fuentes de divulgación; postura epistémica del producto (§9).',
    ),
  },
  arcanoReduction: {
    id: 'kabbalistic/arcano-reduction',
    rule: text(
      'Além da redução decimal (1–9, preservando mestres), a cabalística admite a redução "arcano": em vez de fechar em 1–9, fecha em 1–22 — os 22 caminhos da Árvore da Vida / arcanos maiores. Fórmula ((total − 1) mod 22) + 1. É uma sistematização moderna, exibida apenas como número, sem significado (não há fonte de leitura por arcano).',
      'Besides the decimal reduction (1–9, keeping masters), the Kabbalistic school admits the "arcano" reduction: instead of closing at 1–9, it closes at 1–22 — the 22 paths of the Tree of Life / major arcana. Formula ((total − 1) mod 22) + 1. It is a modern systematization, shown only as a number, with no meaning (there is no per-arcano reading source).',
      'Además de la reducción decimal (1–9, preservando maestros), la cabalística admite la reducción "arcano": en vez de cerrar en 1–9, cierra en 1–22 — los 22 caminos del Árbol de la Vida / arcanos mayores. Fórmula ((total − 1) mod 22) + 1. Es una sistematización moderna, mostrada solo como número, sin significado.',
    ),
    source: text(
      'Discussão de método (sistematização contemporânea); Sefer Yetzirah para os 22 caminhos.',
      'Method discussion (contemporary systematization); Sefer Yetzirah for the 22 paths.',
      'Discusión de método (sistematización contemporánea); Sefer Yetzirah para los 22 caminos.',
    ),
  },
} as const satisfies Record<string, RuleReference>
