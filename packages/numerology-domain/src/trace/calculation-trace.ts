import type { LocalizedText } from '@numerus/shared-kernel'
import type { ModelId, NumberKind } from '../model-ids'
import type { NumerologyValue } from '../value-objects/numerology-value'

/**
 * Contrato central do produto (§3 da spec): o motor não retorna números —
 * retorna cálculos. É proibido existir caminho de código que produza um
 * valor final sem produzir o traço. O traço não é log: é parte do valor de
 * retorno do domínio.
 */

export type LetterMappingEntry = {
  readonly letter: string
  readonly value: number
}

/** União discriminada por `kind`: dá render type-safe sem casts na UI. */
export type CalculationStep =
  | {
      readonly kind: 'filter'
      readonly title: LocalizedText
      readonly explanation: LocalizedText
      readonly input: { readonly originalName: string }
      readonly output: { readonly words: ReadonlyArray<string> }
      readonly visual: 'text'
    }
  | {
      readonly kind: 'letter-mapping'
      readonly title: LocalizedText
      readonly explanation: LocalizedText
      readonly input: { readonly word: string }
      readonly output: { readonly entries: ReadonlyArray<LetterMappingEntry> }
      readonly visual: 'letter-table'
    }
  | {
      readonly kind: 'sum'
      readonly title: LocalizedText
      readonly explanation: LocalizedText
      readonly input: { readonly parcels: ReadonlyArray<number>; readonly label: LocalizedText }
      readonly output: { readonly total: number }
      readonly visual: 'sum'
    }
  | {
      readonly kind: 'reduction'
      readonly title: LocalizedText
      readonly explanation: LocalizedText
      readonly input: { readonly raw: number }
      readonly output: { readonly value: NumerologyValue }
      readonly visual: 'reduction-chain'
    }
  | {
      readonly kind: 'master-check'
      readonly title: LocalizedText
      readonly explanation: LocalizedText
      readonly input: { readonly candidate: number }
      readonly output: { readonly isMaster: boolean }
      readonly visual: 'text'
    }
  | {
      readonly kind: 'karmic-check'
      readonly title: LocalizedText
      readonly explanation: LocalizedText
      readonly input: { readonly inspectedTotals: ReadonlyArray<number> }
      readonly output: { readonly debtsFound: ReadonlyArray<number> }
      readonly visual: 'text'
    }

/** Regra da escola que justifica um passo — base do modo "por quê?" (§3.2). */
export type RuleReference = {
  readonly id: string
  readonly rule: LocalizedText
  readonly source: LocalizedText
}

/** Divergência entre escolas ou variantes de método (§2.4). */
export type DivergenceNote = {
  readonly id: string
  readonly note: LocalizedText
}

export type CalculationTrace = {
  readonly resultId: NumberKind
  readonly model: ModelId
  readonly engineVersion: string
  /** Variante de método usada em cada dimensão configurável (ADR-0003). */
  readonly variantSelections: Readonly<Record<string, string>>
  readonly finalValue: NumerologyValue
  readonly steps: ReadonlyArray<CalculationStep>
  readonly ruleRefs: ReadonlyArray<RuleReference>
  readonly divergenceNotes: ReadonlyArray<DivergenceNote>
}
