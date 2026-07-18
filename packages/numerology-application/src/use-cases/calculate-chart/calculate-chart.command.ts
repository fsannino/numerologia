import type { ModelId, NumberKind } from '@numerus/numerology-domain'

/**
 * Comando de fronteira: recebe strings cruas da UI. A validação de domínio
 * (BirthName) acontece no handler — a UI nunca constrói VOs diretamente.
 */
export type CalculateChartCommand = {
  readonly subject: {
    readonly kind: 'person'
    readonly fullName: string
    /** ISO `YYYY-MM-DD`; opcional — exigida apenas para números derivados de data. */
    readonly birthDate?: string
  }
  readonly models: ReadonlyArray<ModelId>
  readonly numbers: ReadonlyArray<NumberKind>
  readonly variantSelections?: Readonly<Record<string, string>>
}
