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

/** Contagem de um dígito (1–9) na grade do nome (ADR-0006). */
export type DigitTallyEntry = {
  readonly digit: number
  readonly count: number
}

/** Uma "seta" (linha completa ou ausente) na grade Lo Shu. */
export type LoShuArrow = {
  /** Os três números que formam a linha, na ordem do quadrado. */
  readonly line: readonly [number, number, number]
  readonly kind: 'strength' | 'absence'
  readonly label: LocalizedText
}

/** Um período de uma linha do tempo numerológica (ADR-0007). */
export type TimelineSegment = {
  readonly label: LocalizedText
  readonly value: NumerologyValue
  readonly fromAge: number
  /** Ausente no último período (vale até o fim da vida). */
  readonly toAge?: number
  readonly isCurrent: boolean
}

/** União discriminada por `kind`: dá render type-safe sem casts na UI. */
export type CalculationStep =
  | {
      readonly kind: 'filter'
      readonly title: LocalizedText
      readonly explanation: LocalizedText
      /** Fonte do filtro: o nome original (normalização) ou uma palavra (vogais/consoantes). */
      readonly input: { readonly source: string }
      /** O que sobrou após o filtro: palavras de cálculo ou letras mantidas. */
      readonly output: { readonly kept: ReadonlyArray<string> }
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
      readonly kind: 'grid-analysis'
      readonly title: LocalizedText
      readonly explanation: LocalizedText
      readonly input: { readonly letterValues: ReadonlyArray<number> }
      readonly output: {
        readonly tally: ReadonlyArray<DigitTallyEntry>
        /** Dígitos que este número destaca: ausentes (lições) ou repetidos (tendências). */
        readonly highlighted: ReadonlyArray<number>
      }
      readonly visual: 'digit-grid'
    }
  | {
      readonly kind: 'transliteration'
      readonly title: LocalizedText
      readonly explanation: LocalizedText
      readonly input: { readonly name: string }
      readonly output: {
        readonly letters: ReadonlyArray<{
          readonly latin: string
          readonly options: ReadonlyArray<{ readonly hebrew: string; readonly value: number; readonly name: string }>
        }>
        readonly standardTotal: number
        readonly minTotal: number
        readonly maxTotal: number
        readonly combinationCount: number
        readonly standardHebrew: string
      }
      readonly visual: 'transliteration'
    }
  | {
      readonly kind: 'lo-shu-grid'
      readonly title: LocalizedText
      readonly explanation: LocalizedText
      readonly input: { readonly dateDigits: ReadonlyArray<number> }
      readonly output: {
        readonly tally: ReadonlyArray<DigitTallyEntry>
        readonly arrows: ReadonlyArray<LoShuArrow>
      }
      readonly visual: 'lo-shu'
    }
  | {
      readonly kind: 'timeline'
      readonly title: LocalizedText
      readonly explanation: LocalizedText
      readonly input: { readonly ageAtReference: number }
      readonly output: { readonly segments: ReadonlyArray<TimelineSegment> }
      readonly visual: 'timeline'
    }
  | {
      readonly kind: 'planetary-ruler'
      readonly title: LocalizedText
      readonly explanation: LocalizedText
      readonly input: { readonly number: number }
      readonly output: {
        /** Nome do planeta regente na tradição védica (localizado). */
        readonly planet: LocalizedText
        /** Nome sânscrito da graha (ex.: "Surya", "Chandra"). */
        readonly sanskrit: string
        /** Símbolo astronômico/astrológico da graha (ex.: "☉"). */
        readonly symbol: string
        /** Qualidades que o planeta simboliza na tradição — vocabulário de reflexão (§9). */
        readonly qualities: LocalizedText
      }
      readonly visual: 'planetary-ruler'
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
