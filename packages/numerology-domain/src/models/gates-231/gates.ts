import type { Gate, HebrewLetter } from '../../trace/calculation-trace'
import { HEBREW_ALPHABET } from './hebrew-alphabet'

export type GateActivationVariant = 'distinct-letter-pairs' | 'adjacent-pairs'
export const GATE_ACTIVATION_DIMENSION = 'gate-activation'
export const DEFAULT_GATE_ACTIVATION: GateActivationVariant = 'distinct-letter-pairs'

/** Ordena o par por valor: torna o portão não-ordenado canônico e comparável. */
function gateOf(a: HebrewLetter, b: HebrewLetter): Gate {
  return a.value <= b.value ? { first: a, second: b } : { first: b, second: a }
}

/** Chave estável de um portão (para dedup e comparação). */
export function gateKey(gate: Gate): string {
  return `${gate.first.value}-${gate.second.value}`
}

/**
 * Os 231 portões do Sefer Yetzirah 2:4: todas as combinações de PARES das 22
 * letras — C(22,2) = 231. Derivado do alfabeto, nunca hardcoded.
 */
export function allGates(): ReadonlyArray<Gate> {
  const gates: Gate[] = []
  for (let i = 0; i < HEBREW_ALPHABET.length; i += 1) {
    for (let j = i + 1; j < HEBREW_ALPHABET.length; j += 1) {
      // i<j garante par não-ordenado sem repetição e sem letra consigo mesma.
      gates.push(gateOf(HEBREW_ALPHABET[i] as HebrewLetter, HEBREW_ALPHABET[j] as HebrewLetter))
    }
  }
  return gates
}

function distinctByValue(letters: ReadonlyArray<HebrewLetter>): ReadonlyArray<HebrewLetter> {
  const seen = new Set<number>()
  const out: HebrewLetter[] = []
  for (const letter of letters) {
    if (!seen.has(letter.value)) {
      seen.add(letter.value)
      out.push(letter)
    }
  }
  return out
}

/**
 * Os portões que a sequência de letras (transliteração padrão do nome) ativa.
 * Modos são CONSTRUÇÕES CONTEMPORÂNEAS (não há fonte canônica para aplicar os
 * 231 portões a um nome):
 * - `distinct-letter-pairs`: todos os pares das letras distintas do nome → C(k,2).
 * - `adjacent-pairs`: pares de letras vizinhas na sequência (distintas), sem repetição.
 */
export function activatedGates(
  sequence: ReadonlyArray<HebrewLetter>,
  variant: GateActivationVariant,
): ReadonlyArray<Gate> {
  const byKey = new Map<string, Gate>()
  if (variant === 'distinct-letter-pairs') {
    const distinct = distinctByValue(sequence)
    for (let i = 0; i < distinct.length; i += 1) {
      for (let j = i + 1; j < distinct.length; j += 1) {
        const gate = gateOf(distinct[i] as HebrewLetter, distinct[j] as HebrewLetter)
        byKey.set(gateKey(gate), gate)
      }
    }
  } else {
    for (let k = 0; k + 1 < sequence.length; k += 1) {
      const a = sequence[k] as HebrewLetter
      const b = sequence[k + 1] as HebrewLetter
      if (a.value !== b.value) {
        const gate = gateOf(a, b)
        byKey.set(gateKey(gate), gate)
      }
    }
  }
  return [...byKey.values()]
}
