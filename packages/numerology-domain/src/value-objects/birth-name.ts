import type { Result } from '@numerus/shared-kernel'
import { err, ok } from '@numerus/shared-kernel'
import type { NameNormalizationError, NormalizedName } from './name-normalization-policy'
import { normalizeName } from './name-normalization-policy'

export type BirthNameError = NameNormalizationError

/**
 * Nome completo de nascimento, já normalizado pela política do ADR-0002.
 * Invariante: `words` contém só A–Z e nunca é vazio.
 */
export class BirthName {
  private constructor(
    readonly original: string,
    readonly words: ReadonlyArray<string>,
  ) {}

  static create(rawName: string): Result<BirthName, BirthNameError> {
    const normalized: Result<NormalizedName, NameNormalizationError> = normalizeName(rawName)
    if (!normalized.ok) {
      return err(normalized.error)
    }
    return ok(new BirthName(normalized.value.original, normalized.value.words))
  }

  get allLetters(): ReadonlyArray<string> {
    return this.words.flatMap((word) => [...word])
  }
}
