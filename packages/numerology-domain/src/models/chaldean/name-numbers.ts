import { ENGINE_VERSION } from '../../engine-version'
import type { BirthName } from '../../value-objects/birth-name'
import type { LetterRole, YClassificationVariant } from '../../value-objects/letter-classification'
import { classifyLetter } from '../../value-objects/letter-classification'
import { reduceToValue } from '../../value-objects/numerology-value'
import type { CalculationStep, CalculationTrace, DivergenceNote } from '../../trace/calculation-trace'
import { letterMappingStep, reductionStep, sumStep, text } from '../../trace/step-builders'
import { chaldeanValueOf } from './letter-table'
import { CHALDEAN_RULES } from './rules'

export type ChaldeanNameNumberKind = 'expression' | 'motivation' | 'impression' | 'key-number'

type Definition = {
  readonly roleFilter?: LetterRole
  readonly firstWordOnly: boolean
  readonly ruleRefs: ReadonlyArray<(typeof CHALDEAN_RULES)[keyof typeof CHALDEAN_RULES]>
}

const DEFINITIONS: Record<ChaldeanNameNumberKind, Definition> = {
  expression: { firstWordOnly: false, ruleRefs: [CHALDEAN_RULES.letterTable, CHALDEAN_RULES.nameNumbersScope] },
  motivation: { roleFilter: 'vowel', firstWordOnly: false, ruleRefs: [CHALDEAN_RULES.letterTable, CHALDEAN_RULES.nameNumbersScope] },
  impression: { roleFilter: 'consonant', firstWordOnly: false, ruleRefs: [CHALDEAN_RULES.letterTable, CHALDEAN_RULES.nameNumbersScope] },
  'key-number': { firstWordOnly: true, ruleRefs: [CHALDEAN_RULES.letterTable, CHALDEAN_RULES.nameNumbersScope] },
}

function normalizationStep(name: BirthName): CalculationStep {
  return {
    kind: 'filter',
    title: text('Normalização do nome', 'Name normalization', 'Normalización del nombre'),
    explanation: text(
      'Mesma política de normalização de todas as escolas latinas (ADR-0002): acentos removidos, apóstrofos unem letras, hífens separam palavras, partículas entram.',
      'Same normalization policy as every Latin-alphabet school (ADR-0002): diacritics removed, apostrophes join letters, hyphens split words, particles included.',
      'La misma política de normalización de todas las escuelas latinas (ADR-0002): acentos eliminados, apóstrofos unen letras, guiones separan palabras, partículas incluidas.',
    ),
    input: { source: name.original },
    output: { kept: name.words },
    visual: 'text',
  }
}

function consideredLetters(
  name: BirthName,
  definition: Definition,
  yClassification: YClassificationVariant,
): ReadonlyArray<{ readonly word: string; readonly letters: ReadonlyArray<string> }> {
  const words = definition.firstWordOnly ? name.words.slice(0, 1) : name.words
  return words.map((word) => ({
    word,
    letters:
      definition.roleFilter === undefined
        ? [...word]
        : [...word].filter((_, index) => classifyLetter(word, index, yClassification) === definition.roleFilter),
  }))
}

function yDivergence(
  name: BirthName,
  kind: ChaldeanNameNumberKind,
  yClassification: YClassificationVariant,
): ReadonlyArray<DivergenceNote> {
  if (DEFINITIONS[kind].roleFilter === undefined || !name.words.some((word) => word.includes('Y'))) {
    return []
  }
  const reducedFor = (option: YClassificationVariant) =>
    calculateChaldeanNameNumber(name, kind, option, { withDivergences: false }).finalValue.reduced
  const chosen = reducedFor(yClassification)
  const alternatives = (['y-by-context', 'y-always-vowel', 'y-always-consonant'] as const)
    .filter((option) => option !== yClassification)
    .map((option) => ({ option, reduced: reducedFor(option) }))
    .filter((entry) => entry.reduced !== chosen)
  if (alternatives.length === 0) return []
  const alternativesText = alternatives.map((entry) => `"${entry.option}" → ${entry.reduced}`).join('; ')
  return [
    {
      id: `chaldean/${kind}-y-divergence`,
      note: text(
        `O nome contém Y e a classificação escolhida ("${yClassification}") leva a ${chosen}; alternativas: ${alternativesText}.`,
        `The name contains Y and the chosen classification ("${yClassification}") yields ${chosen}; alternatives: ${alternativesText}.`,
        `El nombre contiene Y y la clasificación elegida ("${yClassification}") da ${chosen}; alternativas: ${alternativesText}.`,
      ),
    },
  ]
}

/**
 * Números do nome caldeus. O composto (total antes da redução) é dado de
 * saída de primeira classe — vive em `finalValue.raw` e no passo de soma.
 * A redução não preserva mestres (regra da escola).
 */
export function calculateChaldeanNameNumber(
  name: BirthName,
  kind: ChaldeanNameNumberKind,
  yClassification: YClassificationVariant,
  options: { readonly withDivergences: boolean } = { withDivergences: true },
): CalculationTrace {
  const definition = DEFINITIONS[kind]
  const contributions = consideredLetters(name, definition, yClassification)

  const steps: CalculationStep[] = [normalizationStep(name)]
  const allValues: number[] = []
  for (const contribution of contributions) {
    const entries = contribution.letters.map((letter) => ({ letter, value: chaldeanValueOf(letter) }))
    if (entries.length > 0) {
      steps.push(letterMappingStep(contribution.word, entries))
    }
    allValues.push(...entries.map((entry) => entry.value))
  }

  const compound = allValues.reduce((acc, value) => acc + value, 0)
  steps.push(
    sumStep(
      text(`Número composto: ${compound}`, `Compound number: ${compound}`, `Número compuesto: ${compound}`),
      allValues,
      compound,
      text(
        'Na escola caldaica, este composto é lido antes da redução — ele é parte do resultado, não etapa intermediária.',
        'In the Chaldean school this compound is read before reduction — it is part of the result, not an intermediate step.',
        'En la escuela caldea este compuesto se lee antes de la reducción — es parte del resultado, no una etapa intermedia.',
      ),
    ),
  )

  const finalValue = reduceToValue(compound, { preserveMasters: false })
  steps.push(reductionStep(text('Redução final (sem parada em mestres)', 'Final reduction (no stop at masters)', 'Reducción final (sin parada en maestros)'), finalValue))

  const variantSelections: Record<string, string> =
    definition.roleFilter !== undefined ? { 'y-classification': yClassification } : {}

  return {
    resultId: kind,
    model: 'chaldean',
    engineVersion: ENGINE_VERSION,
    variantSelections,
    finalValue,
    steps,
    ruleRefs: [...definition.ruleRefs, CHALDEAN_RULES.compoundIsFirstClass, CHALDEAN_RULES.noMasterPreservation],
    divergenceNotes: options.withDivergences ? yDivergence(name, kind, yClassification) : [],
  }
}
