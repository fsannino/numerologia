import type { ModelId } from '@numerus/numerology-domain'
import type { SynastryPerson } from '../build-synastry/build-synastry.command'

/**
 * Casamento / união formal (§2.3, item 3): casal + data do casamento.
 * Calcula o número regente da união e o Ano Pessoal do casamento, além
 * dos números da união do casal.
 */
export type CalculateMarriageChartCommand = {
  readonly personA: SynastryPerson
  readonly personB: SynastryPerson
  readonly weddingDate: string
  readonly models: ReadonlyArray<ModelId>
  readonly variantSelections?: Readonly<Record<string, string>>
  /** ISO `YYYY-MM-DD`; para o Ano Pessoal do casamento e a comparação de Anos Pessoais. */
  readonly referenceDate?: string
}
