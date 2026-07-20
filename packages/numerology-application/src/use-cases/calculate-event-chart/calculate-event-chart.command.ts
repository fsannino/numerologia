/**
 * Evento / data (§2.3): a vibração de uma data específica. Não tem nome nem
 * pessoa — só a data do evento (e uma data de referência opcional para o Ano
 * Pessoal do evento). Device-first: nada atravessa a rede.
 */
export type CalculateEventChartCommand = {
  readonly eventDate: string
  readonly variantSelections?: Readonly<Record<string, string>>
  /** ISO `YYYY-MM-DD`; para o Ano Pessoal do evento. */
  readonly referenceDate?: string
}
