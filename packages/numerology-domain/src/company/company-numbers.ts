import type { ModelId } from '../model-ids'
import type { CalculationTrace } from '../trace/calculation-trace'
import { text } from '../trace/step-builders'
import { combineReducedValues } from '../derivations/combine-reduced-values'
import { COMPANY_RULES } from './company-rules'

/**
 * Números empresariais derivados (§2.3, item 4). Como a sinastria, reusam o
 * primitivo `combineReducedValues` sobre os números já calculados por
 * qualquer escola — nenhuma escola é tocada.
 */

/** Harmonia entre a Expressão da razão social e a do nome fantasia. */
export function calculateBrandHarmony(
  model: ModelId,
  legalExpression: number,
  tradeExpression: number,
): CalculationTrace {
  return combineReducedValues({
    resultId: 'brand-harmony',
    model,
    label: text('Harmonia da marca', 'Brand harmony', 'Armonía de la marca'),
    explanation: text(
      `Somamos a Expressão da razão social (${legalExpression}) e a do nome fantasia (${tradeExpression}) e reduzimos.`,
      `We sum the legal-name Expression (${legalExpression}) and the trade-name Expression (${tradeExpression}) and reduce.`,
      `Sumamos la Expresión de la razón social (${legalExpression}) y la del nombre comercial (${tradeExpression}) y reducimos.`,
    ),
    reducedA: legalExpression,
    reducedB: tradeExpression,
    ruleRefs: [COMPANY_RULES.brandHarmony],
  })
}

/** Afinidade entre a razão social e o mapa de um sócio. */
export function calculateFounderAffinity(
  model: ModelId,
  legalExpression: number,
  founderExpression: number,
): CalculationTrace {
  return combineReducedValues({
    resultId: 'founder-affinity',
    model,
    label: text('Afinidade com o sócio', 'Founder affinity', 'Afinidad con el socio'),
    explanation: text(
      `Somamos a Expressão da razão social (${legalExpression}) e a do sócio (${founderExpression}) e reduzimos.`,
      `We sum the legal-name Expression (${legalExpression}) and the founder's Expression (${founderExpression}) and reduce.`,
      `Sumamos la Expresión de la razón social (${legalExpression}) y la del socio (${founderExpression}) y reducimos.`,
    ),
    reducedA: legalExpression,
    reducedB: founderExpression,
    ruleRefs: [COMPANY_RULES.founderAffinity],
  })
}
