export type MasterNumber = 11 | 22 | 33
export type KarmicDebtNumber = 13 | 14 | 16 | 19

export const MASTER_NUMBERS: ReadonlySet<number> = new Set([11, 22, 33])
export const KARMIC_DEBT_NUMBERS: ReadonlySet<number> = new Set([13, 14, 16, 19])

/**
 * Cadeia de redução com cada etapa explícita: 62 → 8 vira [62, 8].
 * O primeiro elemento é sempre o valor bruto; o último, o reduzido.
 */
export type ReductionChain = ReadonlyArray<number>

/**
 * Valor numerológico completo. Guarda bruto + reduzido + cadeia + flags:
 * reduzir cedo demais destrói informação (dívidas cármicas ocultas) — é o
 * bug conceitual mais comum deste domínio (§4.4 da spec).
 */
export type NumerologyValue = {
  readonly raw: number
  readonly reduced: number
  readonly chain: ReductionChain
  readonly isMaster: boolean
  readonly karmicDebt?: KarmicDebtNumber
}

export function isMasterNumber(value: number): value is MasterNumber {
  return MASTER_NUMBERS.has(value)
}

export function karmicDebtOf(value: number): KarmicDebtNumber | undefined {
  return KARMIC_DEBT_NUMBERS.has(value) ? (value as KarmicDebtNumber) : undefined
}

export function sumDigits(value: number): number {
  let remaining = Math.abs(Math.trunc(value))
  let total = 0
  while (remaining > 0) {
    total += remaining % 10
    remaining = Math.trunc(remaining / 10)
  }
  return total
}

/**
 * Reduz um total à sua raiz (1–9), preservando números mestres quando a
 * regra da escola manda (`preserveMasters`). A dívida cármica é detectada
 * sobre o valor bruto, antes de qualquer redução.
 */
export function reduceToValue(
  raw: number,
  options: { readonly preserveMasters: boolean },
): NumerologyValue {
  if (!Number.isInteger(raw) || raw < 0) {
    throw new RangeError(`reduceToValue espera inteiro não-negativo, recebeu ${raw}`)
  }
  const chain: number[] = [raw]
  let current = raw
  while (current > 9 && !(options.preserveMasters && isMasterNumber(current))) {
    current = sumDigits(current)
    chain.push(current)
  }
  const debt = karmicDebtOf(raw)
  return {
    raw,
    reduced: current,
    chain,
    isMaster: isMasterNumber(current),
    ...(debt !== undefined ? { karmicDebt: debt } : {}),
  }
}
