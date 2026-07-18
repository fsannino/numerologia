import type { LocalizedText, Result } from '@numerus/shared-kernel'
import type { ModelId, NumberKind, SubjectKind } from '../model-ids'
import type { Subject } from '../entities/person-subject'
import type { LocalDate } from '../value-objects/local-date'
import type { CalculationTrace } from '../trace/calculation-trace'

export type VariantOption = {
  readonly id: string
  readonly label: LocalizedText
  readonly description: LocalizedText
}

/**
 * Diferenças de método DENTRO de uma escola são variantes explícitas
 * configuráveis, nunca `if` escondido (§4.3 da spec).
 */
export type VariantDimension = {
  readonly dimension: string
  readonly label: LocalizedText
  readonly options: ReadonlyArray<VariantOption>
  readonly defaultOption: string
}

export type ModelMetadata = {
  readonly name: LocalizedText
  readonly historicalOrigin: LocalizedText
  readonly sources: ReadonlyArray<string>
  readonly variantDimensions: ReadonlyArray<VariantDimension>
  /** Tabela letra→valor para exibição educacional (escolas de alfabeto latino). */
  readonly letterValues?: Readonly<Record<string, number>>
}

export type CalculationRequest = {
  readonly numbers: ReadonlyArray<NumberKind>
  readonly variantSelections?: Readonly<Record<string, string>>
  /**
   * Data de referência para números de tempo (ADR-0007). Entrada explícita:
   * o domínio nunca lê o relógio — a UI fornece "hoje" como default editável.
   */
  readonly referenceDate?: LocalDate
}

export type CalculationError =
  | { readonly code: 'unsupported-number'; readonly number: NumberKind; readonly model: ModelId }
  | { readonly code: 'unsupported-subject'; readonly subject: SubjectKind; readonly model: ModelId }
  | { readonly code: 'unknown-variant'; readonly dimension: string; readonly option: string }
  | { readonly code: 'missing-birth-date'; readonly number: NumberKind }
  | { readonly code: 'missing-reference-date'; readonly number: NumberKind }
  | { readonly code: 'reference-before-birth-date' }

/**
 * Port de escola numerológica (§4.3). Adicionar uma escola = criar um
 * diretório em `models/` e registrar no registry. Nada mais.
 */
export interface NumerologyModel {
  readonly id: ModelId
  readonly metadata: ModelMetadata
  readonly supportedSubjects: ReadonlySet<SubjectKind>
  readonly supportedNumbers: ReadonlySet<NumberKind>

  calculate(
    subject: Subject,
    request: CalculationRequest,
  ): Result<ReadonlyArray<CalculationTrace>, CalculationError>
}
