import { ENGINE_VERSION } from '../../engine-version'
import type { LocalDate } from '../../value-objects/local-date'
import type { NumerologyValue } from '../../value-objects/numerology-value'
import { reduceToValue } from '../../value-objects/numerology-value'
import type { CalculationStep, CalculationTrace, DivergenceNote } from '../../trace/calculation-trace'
import { PYTHAGOREAN_RULES } from './rules'
import { karmicCheckStep, masterCheckStep, reductionStep, sumStep, text } from './trace-steps'

export const LIFE_PATH_REDUCTION_DIMENSION = 'life-path-reduction'

export type LifePathVariant = 'reduce-parts-then-sum' | 'sum-all-digits'
export const DEFAULT_LIFE_PATH_VARIANT: LifePathVariant = 'reduce-parts-then-sum'

type LifePathComputation = {
  readonly finalValue: NumerologyValue
  readonly steps: ReadonlyArray<CalculationStep>
}

function digitsOf(value: number): ReadonlyArray<number> {
  return [...String(value)].map(Number)
}

function computeReducePartsThenSum(date: LocalDate): LifePathComputation {
  const steps: CalculationStep[] = []
  const parts = [
    { label: text('dia', 'day'), raw: date.day },
    { label: text('mês', 'month'), raw: date.month },
    { label: text('ano', 'year'), raw: date.year },
  ]
  const reducedParts: number[] = []
  for (const part of parts) {
    const value = reduceToValue(part.raw, { preserveMasters: true })
    steps.push(
      reductionStep(
        text(`Redução do ${part.label['pt-BR']} (${part.raw})`, `Reduction of the ${part.label.en ?? ''} (${part.raw})`),
        value,
      ),
    )
    reducedParts.push(value.reduced)
  }
  const total = reducedParts.reduce((acc, value) => acc + value, 0)
  steps.push(
    sumStep(
      text('Soma das partes reduzidas', 'Sum of the reduced parts'),
      reducedParts,
      total,
      text(
        'Nesta variante (reduce-parts-then-sum), dia, mês e ano são reduzidos separadamente (preservando mestres) e depois somados.',
        'In this variant (reduce-parts-then-sum), day, month and year are reduced separately (preserving masters) and then summed.',
      ),
    ),
  )
  steps.push(karmicCheckStep([date.day, total]))
  steps.push(masterCheckStep(total))
  const finalValue = reduceToValue(total, { preserveMasters: true })
  steps.push(reductionStep(text('Redução final', 'Final reduction'), finalValue))
  return { finalValue, steps }
}

function computeSumAllDigits(date: LocalDate): LifePathComputation {
  const steps: CalculationStep[] = []
  const allDigits = [...digitsOf(date.day), ...digitsOf(date.month), ...digitsOf(date.year)]
  const total = allDigits.reduce((acc, value) => acc + value, 0)
  steps.push(
    sumStep(
      text('Soma de todos os dígitos da data', 'Sum of every digit of the date'),
      allDigits,
      total,
      text(
        'Nesta variante (sum-all-digits), todos os dígitos de dia, mês e ano são somados de uma só vez.',
        'In this variant (sum-all-digits), every digit of day, month and year is summed at once.',
      ),
    ),
  )
  steps.push(karmicCheckStep([date.day, total]))
  steps.push(masterCheckStep(total))
  const finalValue = reduceToValue(total, { preserveMasters: true })
  steps.push(reductionStep(text('Redução final', 'Final reduction'), finalValue))
  return { finalValue, steps }
}

const LIFE_PATH_COMPUTATIONS: Record<LifePathVariant, (date: LocalDate) => LifePathComputation> = {
  'reduce-parts-then-sum': computeReducePartsThenSum,
  'sum-all-digits': computeSumAllDigits,
}

function lifePathDivergence(date: LocalDate, chosen: LifePathVariant): ReadonlyArray<DivergenceNote> {
  const other: LifePathVariant = chosen === 'reduce-parts-then-sum' ? 'sum-all-digits' : 'reduce-parts-then-sum'
  const chosenValue = LIFE_PATH_COMPUTATIONS[chosen](date).finalValue
  const otherValue = LIFE_PATH_COMPUTATIONS[other](date).finalValue
  if (chosenValue.reduced === otherValue.reduced && chosenValue.karmicDebt === otherValue.karmicDebt) {
    return []
  }
  return [
    {
      id: 'pythagorean/life-path-variant-divergence',
      note: text(
        `As variantes de método divergem para esta data: "${chosen}" resulta em ${chosenValue.reduced}${chosenValue.karmicDebt ? ` (dívida ${chosenValue.karmicDebt})` : ''}, enquanto "${other}" resulta em ${otherValue.reduced}${otherValue.karmicDebt ? ` (dívida ${otherValue.karmicDebt})` : ''}. Reduzir as partes antes preserva mestres de dia/mês/ano; somar todos os dígitos muda o total intermediário — é isso que faz dívidas cármicas aparecerem em um método e não no outro.`,
        `The method variants diverge for this date: "${chosen}" yields ${chosenValue.reduced}${chosenValue.karmicDebt ? ` (debt ${chosenValue.karmicDebt})` : ''}, while "${other}" yields ${otherValue.reduced}${otherValue.karmicDebt ? ` (debt ${otherValue.karmicDebt})` : ''}. Reducing the parts first preserves day/month/year masters; summing all digits changes the intermediate total — which is why karmic debts appear in one method and not the other.`,
      ),
    },
  ]
}

/** Destino / Caminho de Vida, com variante explícita (ADR-0005). */
export function calculateLifePath(date: LocalDate, variant: LifePathVariant): CalculationTrace {
  const { finalValue, steps } = LIFE_PATH_COMPUTATIONS[variant](date)
  return {
    resultId: 'life-path',
    model: 'pythagorean',
    engineVersion: ENGINE_VERSION,
    variantSelections: { [LIFE_PATH_REDUCTION_DIMENSION]: variant },
    finalValue,
    steps,
    ruleRefs: [PYTHAGOREAN_RULES.lifePathFromBirthDate, PYTHAGOREAN_RULES.masterNumbers, PYTHAGOREAN_RULES.karmicDebts],
    divergenceNotes: lifePathDivergence(date, variant),
  }
}

/** Número Psíquico: redução do dia do nascimento. */
export function calculatePsychic(date: LocalDate): CalculationTrace {
  const steps: CalculationStep[] = []
  steps.push(karmicCheckStep([date.day]))
  steps.push(masterCheckStep(date.day))
  const finalValue = reduceToValue(date.day, { preserveMasters: true })
  steps.push(reductionStep(text(`Redução do dia do nascimento (${date.day})`, `Reduction of the birth day (${date.day})`), finalValue))
  return {
    resultId: 'psychic',
    model: 'pythagorean',
    engineVersion: ENGINE_VERSION,
    variantSelections: {},
    finalValue,
    steps,
    ruleRefs: [PYTHAGOREAN_RULES.psychicFromDay, PYTHAGOREAN_RULES.masterNumbers, PYTHAGOREAN_RULES.karmicDebts],
    divergenceNotes: [],
  }
}

/**
 * Missão: soma dos valores reduzidos da Expressão e do Destino. Recebe os
 * dois valores já calculados — e portanto herda as variantes usadas neles,
 * registradas em `inheritedSelections`.
 */
export function calculateMission(
  expression: NumerologyValue,
  lifePath: NumerologyValue,
  inheritedSelections: Readonly<Record<string, string>>,
): CalculationTrace {
  const steps: CalculationStep[] = []
  const total = expression.reduced + lifePath.reduced
  steps.push(
    sumStep(
      text('Expressão + Destino', 'Expression + Life Path'),
      [expression.reduced, lifePath.reduced],
      total,
      text(
        'A Missão nasce da soma dos valores reduzidos da Expressão (nome) e do Destino (data).',
        'The Mission comes from summing the reduced values of Expression (name) and Life Path (date).',
      ),
    ),
  )
  steps.push(karmicCheckStep([total]))
  steps.push(masterCheckStep(total))
  const finalValue = reduceToValue(total, { preserveMasters: true })
  steps.push(reductionStep(text('Redução final', 'Final reduction'), finalValue))
  return {
    resultId: 'mission',
    model: 'pythagorean',
    engineVersion: ENGINE_VERSION,
    variantSelections: inheritedSelections,
    finalValue,
    steps,
    ruleRefs: [PYTHAGOREAN_RULES.missionFromExpressionAndLifePath, PYTHAGOREAN_RULES.masterNumbers, PYTHAGOREAN_RULES.karmicDebts],
    divergenceNotes: [],
  }
}
