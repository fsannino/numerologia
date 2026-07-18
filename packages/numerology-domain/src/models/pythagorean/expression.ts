import type { LocalizedText } from '@numerus/shared-kernel'
import { ENGINE_VERSION } from '../../engine-version'
import type { BirthName } from '../../value-objects/birth-name'
import type { NumerologyValue } from '../../value-objects/numerology-value'
import { karmicDebtOf, reduceToValue, isMasterNumber } from '../../value-objects/numerology-value'
import type { CalculationStep, CalculationTrace, DivergenceNote, LetterMappingEntry } from '../../trace/calculation-trace'
import { pythagoreanValueOf } from './letter-table'
import { PYTHAGOREAN_RULES } from './rules'

export const EXPRESSION_REDUCTION_DIMENSION = 'expression-reduction'

export type ExpressionVariant = 'reduce-words-then-sum' | 'sum-all-then-reduce'
export const DEFAULT_EXPRESSION_VARIANT: ExpressionVariant = 'reduce-words-then-sum'

const text = (ptBR: string, en: string): LocalizedText => ({ 'pt-BR': ptBR, en })

function mapWord(word: string): ReadonlyArray<LetterMappingEntry> {
  return [...word].map((letter) => ({ letter, value: pythagoreanValueOf(letter) }))
}

function letterMappingStep(word: string, entries: ReadonlyArray<LetterMappingEntry>): CalculationStep {
  return {
    kind: 'letter-mapping',
    title: text(`Conversão das letras de "${word}"`, `Letter conversion for "${word}"`),
    explanation: text(
      'Cada letra é convertida pelo seu valor na tabela pitagórica (1–9).',
      'Each letter is converted using its value in the Pythagorean table (1–9).',
    ),
    input: { word },
    output: { entries },
    visual: 'letter-table',
  }
}

function sumStep(label: LocalizedText, parcels: ReadonlyArray<number>, total: number, explanation: LocalizedText): CalculationStep {
  return {
    kind: 'sum',
    title: label,
    explanation,
    input: { parcels, label },
    output: { total },
    visual: 'sum',
  }
}

function reductionStep(title: LocalizedText, value: NumerologyValue): CalculationStep {
  const chainText = value.chain.join(' → ')
  return {
    kind: 'reduction',
    title,
    explanation:
      value.chain.length === 1
        ? text('O total já está entre 1 e 9 (ou é um número mestre): não há o que reduzir.', 'The total is already 1–9 (or a master number): nothing to reduce.')
        : text(
            `Somamos os dígitos repetidamente até chegar a um número de 1 a 9 — parando antes se um mestre (11, 22, 33) aparecer: ${chainText}.`,
            `We repeatedly sum the digits until reaching 1–9 — stopping earlier if a master number (11, 22, 33) appears: ${chainText}.`,
          ),
    input: { raw: value.raw },
    output: { value },
    visual: 'reduction-chain',
  }
}

function masterCheckStep(candidate: number): CalculationStep {
  const isMaster = isMasterNumber(candidate)
  return {
    kind: 'master-check',
    title: text('Verificação de número mestre', 'Master number check'),
    explanation: isMaster
      ? text(`${candidate} é um número mestre — a redução para aqui.`, `${candidate} is a master number — reduction stops here.`)
      : text(`${candidate} não é 11, 22 nem 33; a redução pode prosseguir normalmente.`, `${candidate} is not 11, 22 or 33; reduction proceeds normally.`),
    input: { candidate },
    output: { isMaster },
    visual: 'text',
  }
}

function karmicCheckStep(inspectedTotals: ReadonlyArray<number>): CalculationStep {
  const debtsFound = inspectedTotals.filter((total) => karmicDebtOf(total) !== undefined)
  return {
    kind: 'karmic-check',
    title: text('Verificação de dívidas cármicas', 'Karmic debt check'),
    explanation:
      debtsFound.length > 0
        ? text(
            `Os totais brutos ${debtsFound.join(', ')} pertencem ao conjunto 13/14/16/19 e são marcados como dívida cármica antes de reduzir.`,
            `Raw totals ${debtsFound.join(', ')} belong to the 13/14/16/19 set and are flagged as karmic debt before reducing.`,
          )
        : text(
            'Nenhum total bruto inspecionado é 13, 14, 16 ou 19 — não há dívida cármica neste cálculo.',
            'No inspected raw total equals 13, 14, 16 or 19 — no karmic debt in this calculation.',
          ),
    input: { inspectedTotals },
    output: { debtsFound },
    visual: 'text',
  }
}

type ExpressionComputation = {
  readonly finalValue: NumerologyValue
  readonly steps: ReadonlyArray<CalculationStep>
}

function computeReduceWordsThenSum(name: BirthName): ExpressionComputation {
  const steps: CalculationStep[] = []
  const inspectedTotals: number[] = []
  const reducedWordValues: number[] = []

  for (const word of name.words) {
    const entries = mapWord(word)
    steps.push(letterMappingStep(word, entries))
    const values = entries.map((entry) => entry.value)
    const wordTotal = values.reduce((acc, value) => acc + value, 0)
    steps.push(
      sumStep(
        text(`Soma de "${word}"`, `Sum of "${word}"`),
        values,
        wordTotal,
        text('Somamos os valores das letras desta palavra.', 'We sum the letter values of this word.'),
      ),
    )
    inspectedTotals.push(wordTotal)
    const wordValue = reduceToValue(wordTotal, { preserveMasters: true })
    steps.push(reductionStep(text(`Redução de "${word}"`, `Reduction of "${word}"`), wordValue))
    reducedWordValues.push(wordValue.reduced)
  }

  const grandTotal = reducedWordValues.reduce((acc, value) => acc + value, 0)
  steps.push(
    sumStep(
      text('Soma das palavras reduzidas', 'Sum of the reduced words'),
      reducedWordValues,
      grandTotal,
      text(
        'Nesta variante (reduce-words-then-sum), somamos os valores já reduzidos de cada palavra.',
        'In this variant (reduce-words-then-sum), we sum the already-reduced value of each word.',
      ),
    ),
  )
  inspectedTotals.push(grandTotal)
  steps.push(karmicCheckStep(inspectedTotals))
  steps.push(masterCheckStep(grandTotal))
  const finalValue = reduceToValue(grandTotal, { preserveMasters: true })
  steps.push(reductionStep(text('Redução final', 'Final reduction'), finalValue))
  return { finalValue, steps }
}

function computeSumAllThenReduce(name: BirthName): ExpressionComputation {
  const steps: CalculationStep[] = []
  const allValues: number[] = []

  for (const word of name.words) {
    const entries = mapWord(word)
    steps.push(letterMappingStep(word, entries))
    allValues.push(...entries.map((entry) => entry.value))
  }

  const grandTotal = allValues.reduce((acc, value) => acc + value, 0)
  steps.push(
    sumStep(
      text('Soma de todas as letras', 'Sum of all letters'),
      allValues,
      grandTotal,
      text(
        'Nesta variante (sum-all-then-reduce), somamos todas as letras do nome de uma só vez.',
        'In this variant (sum-all-then-reduce), we sum every letter of the name at once.',
      ),
    ),
  )
  steps.push(karmicCheckStep([grandTotal]))
  steps.push(masterCheckStep(grandTotal))
  const finalValue = reduceToValue(grandTotal, { preserveMasters: true })
  steps.push(reductionStep(text('Redução final', 'Final reduction'), finalValue))
  return { finalValue, steps }
}

const COMPUTATIONS: Record<ExpressionVariant, (name: BirthName) => ExpressionComputation> = {
  'reduce-words-then-sum': computeReduceWordsThenSum,
  'sum-all-then-reduce': computeSumAllThenReduce,
}

function divergenceBetweenVariants(name: BirthName, chosen: ExpressionVariant): ReadonlyArray<DivergenceNote> {
  const other: ExpressionVariant = chosen === 'reduce-words-then-sum' ? 'sum-all-then-reduce' : 'reduce-words-then-sum'
  const chosenValue = COMPUTATIONS[chosen](name).finalValue
  const otherValue = COMPUTATIONS[other](name).finalValue
  if (chosenValue.reduced === otherValue.reduced && chosenValue.karmicDebt === otherValue.karmicDebt) {
    return []
  }
  return [
    {
      id: 'pythagorean/expression-variant-divergence',
      note: text(
        `As variantes de método divergem para este nome: "${chosen}" resulta em ${chosenValue.reduced}${chosenValue.karmicDebt ? ` (dívida ${chosenValue.karmicDebt})` : ''}, enquanto "${other}" resulta em ${otherValue.reduced}${otherValue.karmicDebt ? ` (dívida ${otherValue.karmicDebt})` : ''}. A causa é o momento da redução: reduzir cada palavra antes de somar preserva mestres por palavra e muda os totais intermediários.`,
        `The method variants diverge for this name: "${chosen}" yields ${chosenValue.reduced}${chosenValue.karmicDebt ? ` (debt ${chosenValue.karmicDebt})` : ''}, while "${other}" yields ${otherValue.reduced}${otherValue.karmicDebt ? ` (debt ${otherValue.karmicDebt})` : ''}. The cause is when reduction happens: reducing each word before summing preserves per-word masters and changes intermediate totals.`,
      ),
    },
  ]
}

/**
 * Calcula o número de Expressão pitagórico com traço educacional completo.
 * Nunca retorna só o número (§3.1) — o traço é o valor de retorno.
 */
export function calculateExpression(name: BirthName, variant: ExpressionVariant): CalculationTrace {
  const { finalValue, steps } = COMPUTATIONS[variant](name)

  const normalizationStep: CalculationStep = {
    kind: 'filter',
    title: text('Normalização do nome', 'Name normalization'),
    explanation: text(
      'Acentos e cedilha são removidos (Á→A, Ç→C), apóstrofos unem letras, hífens separam palavras e as partículas ("de", "da"...) entram no cálculo — política documentada no ADR-0002.',
      'Diacritics are removed (Á→A, Ç→C), apostrophes join letters, hyphens split words and particles ("de", "da"...) are included — policy documented in ADR-0002.',
    ),
    input: { originalName: name.original },
    output: { words: name.words },
    visual: 'text',
  }

  return {
    resultId: 'expression',
    model: 'pythagorean',
    engineVersion: ENGINE_VERSION,
    variantSelections: { [EXPRESSION_REDUCTION_DIMENSION]: variant },
    finalValue,
    steps: [normalizationStep, ...steps],
    ruleRefs: [
      PYTHAGOREAN_RULES.letterTable,
      PYTHAGOREAN_RULES.expressionUsesAllLetters,
      PYTHAGOREAN_RULES.masterNumbers,
      PYTHAGOREAN_RULES.karmicDebts,
    ],
    divergenceNotes: divergenceBetweenVariants(name, variant),
  }
}
