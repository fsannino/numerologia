import type { LocalizedText } from '@numerus/shared-kernel'
import type { ModelId, NumberKind } from '../model-ids'
import type { NumerologyValue } from '../value-objects/numerology-value'

/**
 * Port de interpretação (§11, decisão 3). Definido desde já **sem** adapter
 * de LLM — a v2 pluga um `InterpretationProvider` de IA sem refatorar. A
 * interpretação é uma camada SEPARADA do cálculo: o traço produz números;
 * o provider produz reflexão sobre eles.
 */

export type InterpretationRequest = {
  readonly model: ModelId
  readonly resultId: NumberKind
  readonly value: NumerologyValue
}

export type Interpretation = {
  /** Texto de reflexão, i18n. Nunca veredito nem previsão (§9). */
  readonly text: LocalizedText
  /** Origem — sempre rotulada na UI. Curado hoje; `ai` na Fase 10. */
  readonly source: 'curated' | 'ai'
}

export interface InterpretationProvider {
  /** Retorna a interpretação, ou `null` se não houver texto para este número. */
  interpret(request: InterpretationRequest): Interpretation | null
}
