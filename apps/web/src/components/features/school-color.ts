import type { ModelId } from '@numerus/numerology-domain'

/**
 * Cor-identidade de cada escola (design.md §9). Diferencia visualmente as
 * escolas em símbolos, cabeçalhos de coluna e filetes de seção — o numeral do
 * resultado permanece SEMPRE em ouro (`latao`); a cor da escola nunca entra no
 * número. Não é semântica de canonicidade (essa vive no selo terracota).
 *
 * As classes são strings literais completas de propósito: o JIT do Tailwind v4
 * varre o código-fonte por nomes de utilitário e não veria `text-escola-${id}`.
 */
export const SCHOOL_TEXT: Readonly<Record<ModelId, string>> = {
  pythagorean: 'text-escola-pitagorico',
  chaldean: 'text-escola-caldeu',
  'lo-shu': 'text-escola-loshu',
  gematria: 'text-escola-gematria',
  vedic: 'text-escola-vedica',
  kabbalistic: 'text-escola-cabalistica',
  'gates-231': 'text-escola-portoes',
}

export const SCHOOL_BORDER: Readonly<Record<ModelId, string>> = {
  pythagorean: 'border-escola-pitagorico',
  chaldean: 'border-escola-caldeu',
  'lo-shu': 'border-escola-loshu',
  gematria: 'border-escola-gematria',
  vedic: 'border-escola-vedica',
  kabbalistic: 'border-escola-cabalistica',
  'gates-231': 'border-escola-portoes',
}

/** Só a borda superior — para o filete-acento no topo de cabeçalhos/seções. */
export const SCHOOL_BORDER_TOP: Readonly<Record<ModelId, string>> = {
  pythagorean: 'border-t-escola-pitagorico',
  chaldean: 'border-t-escola-caldeu',
  'lo-shu': 'border-t-escola-loshu',
  gematria: 'border-t-escola-gematria',
  vedic: 'border-t-escola-vedica',
  kabbalistic: 'border-t-escola-cabalistica',
  'gates-231': 'border-t-escola-portoes',
}
