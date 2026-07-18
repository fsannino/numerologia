import type { BirthName } from '../value-objects/birth-name'
import type { LocalDate } from '../value-objects/local-date'

/**
 * Pessoa como sujeito de cálculo (agregado distinto — §2.3 da spec).
 * A data de nascimento é opcional por minimização (LGPD §5.1): só é exigida
 * quando um número derivado de data é pedido — e a ausência vira erro
 * explícito (`missing-birth-date`), nunca um cálculo parcial silencioso.
 */
export type PersonSubject = {
  readonly kind: 'person'
  readonly birthName: BirthName
  readonly birthDate?: LocalDate
}

export type Subject = PersonSubject

export const personSubject = (birthName: BirthName, birthDate?: LocalDate): PersonSubject => ({
  kind: 'person',
  birthName,
  ...(birthDate !== undefined ? { birthDate } : {}),
})
