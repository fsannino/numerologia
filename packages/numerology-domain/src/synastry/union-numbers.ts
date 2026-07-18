import type { LocalizedText } from '@numerus/shared-kernel'
import type { ModelId, NumberKind } from '../model-ids'
import type { CalculationTrace } from '../trace/calculation-trace'
import { text } from '../trace/step-builders'
import { combineReducedValues } from '../derivations/combine-reduced-values'
import { SYNASTRY_RULES } from './synastry-rules'

/**
 * Números da união (sinastria, §2.3): derivados dos números individuais de
 * duas pessoas. Serviço de domínio agnóstico de escola — combina os traços
 * que qualquer `NumerologyModel` já produz, sem tocar em nenhuma escola.
 */

export type UnionNumberKind =
  | 'union-destiny'
  | 'union-soul'
  | 'union-expression'
  | 'union-personality'
  | 'union-mission'
  | 'union-key'

/** Qual número individual alimenta cada número da união. */
export const UNION_SOURCE: Readonly<Record<UnionNumberKind, NumberKind>> = {
  'union-destiny': 'life-path',
  'union-soul': 'motivation',
  'union-expression': 'expression',
  'union-personality': 'impression',
  'union-mission': 'mission',
  'union-key': 'key-number',
}

const UNION_LABELS: Readonly<Record<UnionNumberKind, LocalizedText>> = {
  'union-destiny': text('Destino da União', 'Union Destiny', 'Destino de la Unión'),
  'union-soul': text('Alma da União', 'Union Soul', 'Alma de la Unión'),
  'union-expression': text('Expressão da União', 'Union Expression', 'Expresión de la Unión'),
  'union-personality': text('Personalidade da União', 'Union Personality', 'Personalidad de la Unión'),
  'union-mission': text('Missão da União', 'Union Mission', 'Misión de la Unión'),
  'union-key': text('Chave da União', 'Union Key', 'Clave de la Unión'),
}

/**
 * Calcula um número da união a partir dos valores reduzidos das duas pessoas.
 * `model` é a escola de origem (os dois números vêm da mesma escola).
 */
export function calculateUnionNumber(
  kind: UnionNumberKind,
  model: ModelId,
  reducedA: number,
  reducedB: number,
): CalculationTrace {
  const label = UNION_LABELS[kind]
  return combineReducedValues({
    resultId: kind,
    model,
    label,
    explanation: text(
      `${label['pt-BR']}: somamos o valor reduzido de cada pessoa (${reducedA} + ${reducedB}) e reduzimos o total.`,
      `${label.en ?? ''}: we sum each person's reduced value (${reducedA} + ${reducedB}) and reduce the total.`,
      `${label.es ?? ''}: sumamos el valor reducido de cada persona (${reducedA} + ${reducedB}) y reducimos el total.`,
    ),
    reducedA,
    reducedB,
    ruleRefs: [SYNASTRY_RULES.unionFromReducedValues, SYNASTRY_RULES.reflectionNotVerdict],
  })
}
