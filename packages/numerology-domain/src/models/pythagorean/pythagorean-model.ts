import type { Result } from '@numerus/shared-kernel'
import { err, ok, ptBR } from '@numerus/shared-kernel'
import type { NumberKind, SubjectKind } from '../../model-ids'
import type { Subject } from '../../entities/person-subject'
import type { CalculationTrace } from '../../trace/calculation-trace'
import type { CalculationError, CalculationRequest, NumerologyModel } from '../../ports/numerology-model'
import type { ExpressionVariant } from './expression'
import { DEFAULT_EXPRESSION_VARIANT, EXPRESSION_REDUCTION_DIMENSION, calculateExpression } from './expression'

const SUPPORTED_SUBJECTS: ReadonlySet<SubjectKind> = new Set(['person'])
const SUPPORTED_NUMBERS: ReadonlySet<NumberKind> = new Set(['expression'])

const EXPRESSION_VARIANTS: ReadonlySet<string> = new Set([
  'reduce-words-then-sum',
  'sum-all-then-reduce',
])

function resolveExpressionVariant(
  request: CalculationRequest,
): Result<ExpressionVariant, CalculationError> {
  const selected = request.variantSelections?.[EXPRESSION_REDUCTION_DIMENSION]
  if (selected === undefined) {
    return ok(DEFAULT_EXPRESSION_VARIANT)
  }
  if (!EXPRESSION_VARIANTS.has(selected)) {
    return err({ code: 'unknown-variant', dimension: EXPRESSION_REDUCTION_DIMENSION, option: selected })
  }
  return ok(selected as ExpressionVariant)
}

export const pythagoreanModel: NumerologyModel = {
  id: 'pythagorean',
  metadata: {
    name: { 'pt-BR': 'Pitagórico', en: 'Pythagorean', es: 'Pitagórico' },
    historicalOrigin: {
      'pt-BR':
        'Sistema moderno estruturado no fim do séc. XIX / início do XX por L. Dow Balliett e Juno Jordan, reivindicando a herança de Pitágoras. É o modelo mais difundido no Ocidente.',
      en: 'Modern system structured in the late 19th / early 20th century by L. Dow Balliett and Juno Jordan, claiming the heritage of Pythagoras. The most widespread Western model.',
    },
    sources: [
      'L. Dow Balliett, "The Philosophy of Numbers" (1908)',
      'Juno Jordan, "Numerology: The Romance in Your Name" (1965)',
    ],
    variantDimensions: [
      {
        dimension: EXPRESSION_REDUCTION_DIMENSION,
        label: ptBR('Método de redução da Expressão'),
        options: [
          {
            id: 'reduce-words-then-sum',
            label: ptBR('Reduzir cada palavra antes de somar'),
            description: ptBR('Cada palavra do nome é reduzida (preservando mestres) e os resultados são somados. Método predominante.'),
          },
          {
            id: 'sum-all-then-reduce',
            label: ptBR('Somar todas as letras e reduzir uma vez'),
            description: ptBR('Todas as letras do nome são somadas em um único total, reduzido ao final.'),
          },
        ],
        defaultOption: DEFAULT_EXPRESSION_VARIANT,
      },
    ],
  },
  supportedSubjects: SUPPORTED_SUBJECTS,
  supportedNumbers: SUPPORTED_NUMBERS,

  calculate(subject: Subject, request: CalculationRequest): Result<ReadonlyArray<CalculationTrace>, CalculationError> {
    if (!SUPPORTED_SUBJECTS.has(subject.kind)) {
      return err({ code: 'unsupported-subject', subject: subject.kind, model: 'pythagorean' })
    }
    const unsupported = request.numbers.find((number) => !SUPPORTED_NUMBERS.has(number))
    if (unsupported !== undefined) {
      return err({ code: 'unsupported-number', number: unsupported, model: 'pythagorean' })
    }
    const variant = resolveExpressionVariant(request)
    if (!variant.ok) {
      return variant
    }
    const traces = request.numbers.map(() => calculateExpression(subject.birthName, variant.value))
    return ok(traces)
  },
}
