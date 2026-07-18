import type { ModelId } from '@numerus/numerology-domain'

/**
 * Empresa (§2.3, item 4): agregado distinto de Pessoa. Razão social + nome
 * fantasia + data de constituição, com afinidade opcional a um sócio.
 */
export type CalculateCompanyChartCommand = {
  readonly legalName: string
  readonly tradeName: string
  /** ISO `YYYY-MM-DD`; opcional — habilita o Destino corporativo. */
  readonly incorporationDate?: string
  /** Nome de um sócio; opcional — habilita a afinidade. */
  readonly founderName?: string
  readonly models: ReadonlyArray<ModelId>
  readonly variantSelections?: Readonly<Record<string, string>>
}
