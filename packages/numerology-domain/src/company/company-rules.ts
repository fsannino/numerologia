import type { LocalizedText } from '@numerus/shared-kernel'
import type { RuleReference } from '../trace/calculation-trace'

const text = (ptBR: string, en: string, es: string): LocalizedText => ({ 'pt-BR': ptBR, en, es })

/** Regras da numerologia empresarial (§2.3, item 4). */
export const COMPANY_RULES = {
  brandExpression: {
    id: 'company/brand-expression',
    rule: text(
      'A Expressão da marca é a Expressão do nome fantasia; a identidade corporativa vem da razão social. Os dois são calculados separadamente com as mesmas regras de nome.',
      'The brand Expression is the Expression of the trade name; the corporate identity comes from the legal name. Both are computed separately with the same name rules.',
      'La Expresión de la marca es la Expresión del nombre comercial; la identidad corporativa viene de la razón social. Ambos se calculan por separado con las mismas reglas de nombre.',
    ),
    source: text(
      'Adaptação empresarial da numerologia de nomes moderna.',
      'Business adaptation of modern name numerology.',
      'Adaptación empresarial de la numerología de nombres moderna.',
    ),
  },
  brandHarmony: {
    id: 'company/brand-harmony',
    rule: text(
      'A harmonia soma os valores reduzidos da Expressão da razão social e da Expressão do nome fantasia e reduz o total. É vocabulário para reflexão sobre a coerência da marca — não um veredito comercial (§9).',
      'Harmony sums the reduced Expression of the legal name and of the trade name and reduces the total. It is vocabulary for reflecting on brand coherence — not a commercial verdict (§9).',
      'La armonía suma los valores reducidos de la Expresión de la razón social y del nombre comercial y reduce el total. Es vocabulario para reflexionar sobre la coherencia de la marca — no un veredicto comercial (§9).',
    ),
    source: text(
      'Prática consolidada na numerologia empresarial moderna; postura epistêmica do produto (§9).',
      'Consolidated practice in modern business numerology; product epistemic stance (§9).',
      'Práctica consolidada en la numerología empresarial moderna; postura epistémica del producto (§9).',
    ),
  },
  founderAffinity: {
    id: 'company/founder-affinity',
    rule: text(
      'A afinidade com o sócio soma os valores reduzidos da Expressão da razão social e da Expressão do sócio. Ponto de reflexão sobre alinhamento, não previsão de sucesso.',
      "Founder affinity sums the reduced Expression of the legal name and of the founder's name. A reflection point on alignment, not a success prediction.",
      'La afinidad con el socio suma los valores reducidos de la Expresión de la razón social y de la Expresión del socio. Punto de reflexión sobre alineación, no predicción de éxito.',
    ),
    source: text(
      'Prática consolidada na numerologia empresarial moderna; postura epistêmica do produto (§9).',
      'Consolidated practice in modern business numerology; product epistemic stance (§9).',
      'Práctica consolidada en la numerología empresarial moderna; postura epistémica del producto (§9).',
    ),
  },
} as const satisfies Record<string, RuleReference>
