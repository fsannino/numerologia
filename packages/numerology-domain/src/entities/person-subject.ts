import type { BirthName } from '../value-objects/birth-name'

/**
 * Pessoa como sujeito de cálculo (agregado distinto — §2.3 da spec).
 * A data de nascimento entra na Fase 2 junto com os números derivados de
 * data; pedi-la antes violaria a minimização de dados (LGPD, §5.1).
 */
export type PersonSubject = {
  readonly kind: 'person'
  readonly birthName: BirthName
}

export type Subject = PersonSubject

export const personSubject = (birthName: BirthName): PersonSubject => ({
  kind: 'person',
  birthName,
})
