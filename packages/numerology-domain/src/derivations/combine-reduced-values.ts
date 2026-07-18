import type { LocalizedText } from '@numerus/shared-kernel'
import { ENGINE_VERSION } from '../engine-version'
import type { ModelId, NumberKind } from '../model-ids'
import type { CalculationStep, CalculationTrace, RuleReference } from '../trace/calculation-trace'
import { karmicCheckStep, masterCheckStep, reductionStep, sumStep } from '../trace/step-builders'
import { reduceToValue } from '../value-objects/numerology-value'

/**
 * Primitivo de domínio compartilhado: combina dois valores JÁ REDUZIDOS
 * (soma e reduz preservando mestres) e produz um traço completo. É a
 * aritmética comum a derivações de dois sujeitos — sinastria (união) e
 * empresa (harmonia). Cada chamador atribui a própria semântica
 * (`resultId`, rótulo, regras); a operação em si é o conhecimento único (R4).
 */
export function combineReducedValues(params: {
  readonly resultId: NumberKind
  readonly model: ModelId
  readonly label: LocalizedText
  readonly explanation: LocalizedText
  readonly reducedA: number
  readonly reducedB: number
  readonly ruleRefs: ReadonlyArray<RuleReference>
}): CalculationTrace {
  const total = params.reducedA + params.reducedB
  const steps: CalculationStep[] = [
    sumStep(params.label, [params.reducedA, params.reducedB], total, params.explanation),
    karmicCheckStep([total]),
    masterCheckStep(total),
  ]
  const finalValue = reduceToValue(total, { preserveMasters: true })
  steps.push(
    reductionStep(
      { 'pt-BR': 'Redução final', en: 'Final reduction', es: 'Reducción final' },
      finalValue,
    ),
  )
  return {
    resultId: params.resultId,
    model: params.model,
    engineVersion: ENGINE_VERSION,
    variantSelections: {},
    finalValue,
    steps,
    ruleRefs: params.ruleRefs,
    divergenceNotes: [],
  }
}
