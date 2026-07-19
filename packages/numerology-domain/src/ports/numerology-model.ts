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

/**
 * Grau de lastro histórico de uma escola. Um produto que trata todas as
 * escolas como igualmente estabelecidas mente por omissão — a honestidade
 * aqui é diferencial, não ressalva (§9).
 */
export type Canonicity =
  /** Tradição com fonte textual/histórica documentada (ex.: Gematria, Lo Shu). */
  | 'documented-tradition'
  /** Sistematização moderna (fim séc. XIX/XX) reivindicando herança antiga (pitagórica, caldaica). */
  | 'modern-systematization'
  /** Construção contemporânea sem autoridade textual (ex.: aplicar 231 Portões a um nome). */
  | 'contemporary-construction'

/** O quão padronizado é o método entre fontes. */
export type Standardization =
  /** Fontes convergem no método e nos valores. */
  | 'standardized'
  /** Método definido, mas com variantes conhecidas e explícitas (ex.: transliteração da Gematria). */
  | 'variant-dependent'
  /** Sem tabela/método único que as fontes sustentem (ex.: cabalística latina). */
  | 'unstandardized'

export type ModelMetadata = {
  readonly name: LocalizedText
  readonly historicalOrigin: LocalizedText
  readonly sources: ReadonlyArray<string>
  readonly variantDimensions: ReadonlyArray<VariantDimension>
  /**
   * Honestidade estrutural (§9): quão documentada e quão padronizada é a
   * escola. A UI exibe — não esconde — esse metadado.
   */
  readonly canonicity: Canonicity
  readonly standardization: Standardization
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
