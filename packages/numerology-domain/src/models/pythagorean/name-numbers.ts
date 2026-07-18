import type { LocalizedText } from '@numerus/shared-kernel'
import { ENGINE_VERSION } from '../../engine-version'
import type { BirthName } from '../../value-objects/birth-name'
import type { NumerologyValue } from '../../value-objects/numerology-value'
import { reduceToValue } from '../../value-objects/numerology-value'
import type { CalculationStep, CalculationTrace, DivergenceNote } from '../../trace/calculation-trace'
import { pythagoreanValueOf } from './letter-table'
import { PYTHAGOREAN_RULES } from './rules'
import type { LetterRole, YClassificationVariant } from './letter-classification'
import { DEFAULT_Y_CLASSIFICATION, classifyLetter } from './letter-classification'
import {
  karmicCheckStep,
  letterMappingStep,
  masterCheckStep,
  reductionStep,
  sumStep,
  text,
} from './trace-steps'

export const NAME_REDUCTION_DIMENSION = 'name-reduction'

export type NameReductionVariant = 'reduce-words-then-sum' | 'sum-all-then-reduce'
export const DEFAULT_NAME_REDUCTION: NameReductionVariant = 'reduce-words-then-sum'

export type NameNumberKind = 'expression' | 'motivation' | 'impression' | 'key-number'

export type NameNumberVariants = {
  readonly reduction: NameReductionVariant
  readonly yClassification: YClassificationVariant
}

type NameNumberDefinition = {
  readonly roleFilter?: LetterRole
  readonly firstWordOnly: boolean
  readonly label: LocalizedText
  readonly ruleRefs: ReadonlyArray<(typeof PYTHAGOREAN_RULES)[keyof typeof PYTHAGOREAN_RULES]>
}

const NAME_NUMBER_DEFINITIONS: Record<NameNumberKind, NameNumberDefinition> = {
  expression: {
    firstWordOnly: false,
    label: text('Expressão', 'Expression'),
    ruleRefs: [PYTHAGOREAN_RULES.letterTable, PYTHAGOREAN_RULES.expressionUsesAllLetters],
  },
  motivation: {
    roleFilter: 'vowel',
    firstWordOnly: false,
    label: text('Motivação (vogais)', 'Motivation (vowels)'),
    ruleRefs: [PYTHAGOREAN_RULES.letterTable, PYTHAGOREAN_RULES.motivationUsesVowels, PYTHAGOREAN_RULES.yClassification],
  },
  impression: {
    roleFilter: 'consonant',
    firstWordOnly: false,
    label: text('Impressão (consoantes)', 'Impression (consonants)'),
    ruleRefs: [PYTHAGOREAN_RULES.letterTable, PYTHAGOREAN_RULES.impressionUsesConsonants, PYTHAGOREAN_RULES.yClassification],
  },
  'key-number': {
    firstWordOnly: true,
    label: text('Número Chave (primeiro nome)', 'Key Number (first name)'),
    ruleRefs: [PYTHAGOREAN_RULES.letterTable, PYTHAGOREAN_RULES.keyNumberUsesFirstName],
  },
}

function normalizationStep(name: BirthName): CalculationStep {
  return {
    kind: 'filter',
    title: text('Normalização do nome', 'Name normalization'),
    explanation: text(
      'Acentos e cedilha são removidos (Á→A, Ç→C), apóstrofos unem letras, hífens separam palavras e as partículas ("de", "da"...) entram no cálculo — política documentada no ADR-0002.',
      'Diacritics are removed (Á→A, Ç→C), apostrophes join letters, hyphens split words and particles ("de", "da"...) are included — policy documented in ADR-0002.',
    ),
    input: { source: name.original },
    output: { kept: name.words },
    visual: 'text',
  }
}

function roleFilterStep(word: string, role: LetterRole, kept: ReadonlyArray<string>): CalculationStep {
  const roleName =
    role === 'vowel' ? text('vogais', 'vowels') : text('consoantes', 'consonants')
  return {
    kind: 'filter',
    title: text(
      `Seleção das ${roleName['pt-BR']} de "${word}"`,
      `Selecting the ${roleName.en ?? ''} of "${word}"`,
    ),
    explanation: word.includes('Y')
      ? text(
          'O Y é classificado conforme a variante escolhida (ADR-0004); as demais letras seguem A/E/I/O/U como vogais.',
          'Y is classified according to the chosen variant (ADR-0004); other letters follow A/E/I/O/U as vowels.',
        )
      : text(
          'A, E, I, O e U são vogais; todas as outras letras são consoantes.',
          'A, E, I, O and U are vowels; every other letter is a consonant.',
        ),
    input: { source: word },
    output: { kept },
    visual: 'text',
  }
}

type WordContribution = {
  readonly word: string
  readonly letters: ReadonlyArray<string>
  readonly steps: ReadonlyArray<CalculationStep>
  readonly rawTotal: number
}

function contributionOf(
  word: string,
  definition: NameNumberDefinition,
  variants: NameNumberVariants,
): WordContribution {
  const steps: CalculationStep[] = []
  let letters: ReadonlyArray<string> = [...word]
  if (definition.roleFilter !== undefined) {
    letters = [...word].filter(
      (_, index) => classifyLetter(word, index, variants.yClassification) === definition.roleFilter,
    )
    steps.push(roleFilterStep(word, definition.roleFilter, letters))
  }
  const entries = letters.map((letter) => ({ letter, value: pythagoreanValueOf(letter) }))
  if (entries.length > 0) {
    steps.push(letterMappingStep(word, entries))
  }
  const values = entries.map((entry) => entry.value)
  const rawTotal = values.reduce((acc, value) => acc + value, 0)
  steps.push(
    sumStep(
      text(`Soma de "${word}"`, `Sum of "${word}"`),
      values,
      rawTotal,
      text('Somamos os valores das letras consideradas desta palavra.', 'We sum the values of the considered letters of this word.'),
    ),
  )
  return { word, letters, steps, rawTotal }
}

type NameNumberComputation = {
  readonly finalValue: NumerologyValue
  readonly steps: ReadonlyArray<CalculationStep>
}

function compute(
  name: BirthName,
  kind: NameNumberKind,
  variants: NameNumberVariants,
): NameNumberComputation {
  const definition = NAME_NUMBER_DEFINITIONS[kind]
  const words = definition.firstWordOnly ? name.words.slice(0, 1) : name.words
  const contributions = words.map((word) => contributionOf(word, definition, variants))
  const steps: CalculationStep[] = contributions.flatMap((contribution) => [...contribution.steps])
  const inspectedTotals: number[] = []
  let grandTotal: number

  if (variants.reduction === 'reduce-words-then-sum' && contributions.length > 1) {
    const reducedValues: number[] = []
    for (const contribution of contributions) {
      inspectedTotals.push(contribution.rawTotal)
      const wordValue = reduceToValue(contribution.rawTotal, { preserveMasters: true })
      steps.push(reductionStep(text(`Redução de "${contribution.word}"`, `Reduction of "${contribution.word}"`), wordValue))
      reducedValues.push(wordValue.reduced)
    }
    grandTotal = reducedValues.reduce((acc, value) => acc + value, 0)
    steps.push(
      sumStep(
        text('Soma das palavras reduzidas', 'Sum of the reduced words'),
        reducedValues,
        grandTotal,
        text(
          'Nesta variante (reduce-words-then-sum), somamos os valores já reduzidos de cada palavra.',
          'In this variant (reduce-words-then-sum), we sum the already-reduced value of each word.',
        ),
      ),
    )
  } else if (contributions.length === 1) {
    // Palavra única: não há soma entre palavras — as variantes coincidem e a
    // redução final parte do total bruto da própria palavra.
    grandTotal = contributions[0]?.rawTotal ?? 0
  } else {
    const allValues = contributions.flatMap((contribution) =>
      contribution.letters.map((letter) => pythagoreanValueOf(letter)),
    )
    grandTotal = allValues.reduce((acc, value) => acc + value, 0)
    steps.push(
      sumStep(
        text('Soma de todas as letras consideradas', 'Sum of all considered letters'),
        allValues,
        grandTotal,
        text(
          'Nesta variante (sum-all-then-reduce), somamos todas as letras consideradas de uma só vez.',
          'In this variant (sum-all-then-reduce), we sum every considered letter at once.',
        ),
      ),
    )
  }

  inspectedTotals.push(grandTotal)
  steps.push(karmicCheckStep(inspectedTotals))
  steps.push(masterCheckStep(grandTotal))
  const finalValue = reduceToValue(grandTotal, { preserveMasters: true })
  steps.push(reductionStep(text('Redução final', 'Final reduction'), finalValue))
  return { finalValue, steps }
}

function reductionDivergence(
  name: BirthName,
  kind: NameNumberKind,
  variants: NameNumberVariants,
): ReadonlyArray<DivergenceNote> {
  const other: NameReductionVariant =
    variants.reduction === 'reduce-words-then-sum' ? 'sum-all-then-reduce' : 'reduce-words-then-sum'
  const chosen = compute(name, kind, variants).finalValue
  const alternative = compute(name, kind, { ...variants, reduction: other }).finalValue
  if (chosen.reduced === alternative.reduced && chosen.karmicDebt === alternative.karmicDebt) {
    return []
  }
  return [
    {
      id: `pythagorean/${kind}-reduction-divergence`,
      note: text(
        `As variantes de redução divergem para este nome: "${variants.reduction}" resulta em ${chosen.reduced}${chosen.karmicDebt ? ` (dívida ${chosen.karmicDebt})` : ''}, enquanto "${other}" resulta em ${alternative.reduced}${alternative.karmicDebt ? ` (dívida ${alternative.karmicDebt})` : ''}. A causa é o momento da redução: reduzir cada palavra antes de somar preserva mestres por palavra e muda os totais intermediários.`,
        `The reduction variants diverge for this name: "${variants.reduction}" yields ${chosen.reduced}${chosen.karmicDebt ? ` (debt ${chosen.karmicDebt})` : ''}, while "${other}" yields ${alternative.reduced}${alternative.karmicDebt ? ` (debt ${alternative.karmicDebt})` : ''}. The cause is when reduction happens: reducing each word before summing preserves per-word masters and changes intermediate totals.`,
      ),
    },
  ]
}

function yDivergence(
  name: BirthName,
  kind: NameNumberKind,
  variants: NameNumberVariants,
): ReadonlyArray<DivergenceNote> {
  const definition = NAME_NUMBER_DEFINITIONS[kind]
  if (definition.roleFilter === undefined || !name.words.some((word) => word.includes('Y'))) {
    return []
  }
  const chosen = compute(name, kind, variants).finalValue
  const alternatives: YClassificationVariant[] = (
    ['y-by-context', 'y-always-vowel', 'y-always-consonant'] as const
  ).filter((option) => option !== variants.yClassification)
  const diverging = alternatives
    .map((option) => ({ option, value: compute(name, kind, { ...variants, yClassification: option }).finalValue }))
    .filter(({ value }) => value.reduced !== chosen.reduced)
  if (diverging.length === 0) {
    return []
  }
  const alternativesText = diverging
    .map(({ option, value }) => `"${option}" → ${value.reduced}`)
    .join('; ')
  return [
    {
      id: `pythagorean/${kind}-y-divergence`,
      note: text(
        `O nome contém Y, e as escolas divergem sobre classificá-lo como vogal ou consoante. Com "${variants.yClassification}" o resultado é ${chosen.reduced}; alternativas: ${alternativesText}.`,
        `The name contains Y, and schools diverge on classifying it as vowel or consonant. With "${variants.yClassification}" the result is ${chosen.reduced}; alternatives: ${alternativesText}.`,
      ),
    },
  ]
}

/**
 * Calcula um número do nome (Expressão, Motivação, Impressão ou Chave) com
 * traço educacional completo. Nunca retorna só o número (§3.1).
 */
export function calculateNameNumber(
  name: BirthName,
  kind: NameNumberKind,
  variants: NameNumberVariants,
): CalculationTrace {
  const definition = NAME_NUMBER_DEFINITIONS[kind]
  const { finalValue, steps } = compute(name, kind, variants)
  const variantSelections: Record<string, string> = { [NAME_REDUCTION_DIMENSION]: variants.reduction }
  if (definition.roleFilter !== undefined) {
    variantSelections['y-classification'] = variants.yClassification
  }
  return {
    resultId: kind,
    model: 'pythagorean',
    engineVersion: ENGINE_VERSION,
    variantSelections,
    finalValue,
    steps: [normalizationStep(name), ...steps],
    ruleRefs: [...definition.ruleRefs, PYTHAGOREAN_RULES.masterNumbers, PYTHAGOREAN_RULES.karmicDebts],
    divergenceNotes: [...reductionDivergence(name, kind, variants), ...yDivergence(name, kind, variants)],
  }
}

/** Wrapper de compatibilidade da Fatia 1. */
export function calculateExpression(name: BirthName, variant: NameReductionVariant): CalculationTrace {
  return calculateNameNumber(name, 'expression', {
    reduction: variant,
    yClassification: DEFAULT_Y_CLASSIFICATION,
  })
}
