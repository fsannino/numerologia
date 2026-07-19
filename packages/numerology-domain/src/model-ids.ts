export type ModelId =
  | 'pythagorean'
  | 'chaldean'
  | 'gematria'
  | 'gates-231'
  | 'vedic'
  | 'lo-shu'

/** Posições do quadrado mágico Lo Shu (4-9-2 / 3-5-7 / 8-1-6). */
export const LO_SHU_SQUARE: ReadonlyArray<ReadonlyArray<number>> = [
  [4, 9, 2],
  [3, 5, 7],
  [8, 1, 6],
]

export type NumberKind =
  | 'expression'
  | 'motivation'
  | 'impression'
  | 'key-number'
  | 'life-path'
  | 'psychic'
  | 'mission'
  | 'karmic-lessons'
  | 'hidden-tendencies'
  | 'subconscious'
  | 'life-cycles'
  | 'pinnacles'
  | 'challenges'
  | 'personal-year'
  | 'personal-month'
  | 'personal-day'
  | 'union-destiny'
  | 'union-soul'
  | 'union-expression'
  | 'union-personality'
  | 'union-mission'
  | 'union-key'
  | 'brand-harmony'
  | 'founder-affinity'
  | 'marriage-governing'
  | 'marriage-personal-year'
  | 'lo-shu-grid'
  | 'gematria-value'
  | 'vedic-moolank'
  | 'vedic-bhagyank'

export type SubjectKind =
  | 'person'
  | 'couple'
  | 'marriage'
  | 'company'
  | 'alternative-name'
  | 'event'
