import type { ModelId } from '@numerus/numerology-domain'

export type SynastryPerson = {
  readonly fullName: string
  /** ISO `YYYY-MM-DD`; opcional — habilita Destino/Missão da União e a comparação de Anos Pessoais. */
  readonly birthDate?: string
}

/**
 * Comando de sinastria (§2.3, item 2): dois mapas de pessoa produzem os
 * números da união e a comparação de Anos Pessoais.
 */
export type BuildSynastryCommand = {
  readonly personA: SynastryPerson
  readonly personB: SynastryPerson
  readonly models: ReadonlyArray<ModelId>
  readonly variantSelections?: Readonly<Record<string, string>>
  /** ISO `YYYY-MM-DD`; para a comparação de Anos Pessoais. */
  readonly referenceDate?: string
}
