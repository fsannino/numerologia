import type { LocalizedText } from '@numerus/shared-kernel'

const text = (ptBR: string, en: string, es: string): LocalizedText => ({ 'pt-BR': ptBR, en, es })

/**
 * Uma graha (planeta regente) da numerologia védica (Ank Jyotish). Cada
 * número 1–9 é regido por um corpo celeste; o significado do número, na
 * tradição, É o do planeta. As qualidades são vocabulário para reflexão,
 * nunca um veredito sobre a pessoa (§9).
 */
export type Planet = {
  readonly planet: LocalizedText
  readonly sanskrit: string
  readonly symbol: string
  readonly qualities: LocalizedText
}

/**
 * Regência planetária clássica dos dígitos 1–9 (Ank Jyotish). Rahu (4) e
 * Ketu (7) são os nodos lunares — sem símbolo planetário único, usam o
 * glifo tradicional do nodo ascendente/descendente.
 */
export const VEDIC_PLANETS: Readonly<Record<number, Planet>> = {
  1: {
    planet: text('Sol', 'Sun', 'Sol'),
    sanskrit: 'Surya',
    symbol: '☉',
    qualities: text('liderança e vitalidade', 'leadership and vitality', 'liderazgo y vitalidad'),
  },
  2: {
    planet: text('Lua', 'Moon', 'Luna'),
    sanskrit: 'Chandra',
    symbol: '☽',
    qualities: text('sensibilidade e intuição', 'sensitivity and intuition', 'sensibilidad e intuición'),
  },
  3: {
    planet: text('Júpiter', 'Jupiter', 'Júpiter'),
    sanskrit: 'Guru (Brihaspati)',
    symbol: '♃',
    qualities: text('sabedoria e expansão', 'wisdom and expansion', 'sabiduría y expansión'),
  },
  4: {
    planet: text('Rahu (nodo lunar norte)', 'Rahu (north lunar node)', 'Rahu (nodo lunar norte)'),
    sanskrit: 'Rahu',
    symbol: '☊',
    qualities: text('inovação e ruptura', 'innovation and disruption', 'innovación y ruptura'),
  },
  5: {
    planet: text('Mercúrio', 'Mercury', 'Mercurio'),
    sanskrit: 'Budha',
    symbol: '☿',
    qualities: text('comunicação e intelecto', 'communication and intellect', 'comunicación e intelecto'),
  },
  6: {
    planet: text('Vênus', 'Venus', 'Venus'),
    sanskrit: 'Shukra',
    symbol: '♀',
    qualities: text('harmonia e beleza', 'harmony and beauty', 'armonía y belleza'),
  },
  7: {
    planet: text('Ketu (nodo lunar sul)', 'Ketu (south lunar node)', 'Ketu (nodo lunar sur)'),
    sanskrit: 'Ketu',
    symbol: '☋',
    qualities: text('introspecção e espiritualidade', 'introspection and spirituality', 'introspección y espiritualidad'),
  },
  8: {
    planet: text('Saturno', 'Saturn', 'Saturno'),
    sanskrit: 'Shani',
    symbol: '♄',
    qualities: text('disciplina e estrutura', 'discipline and structure', 'disciplina y estructura'),
  },
  9: {
    planet: text('Marte', 'Mars', 'Marte'),
    sanskrit: 'Mangala',
    symbol: '♂',
    qualities: text('energia e coragem', 'energy and courage', 'energía y coraje'),
  },
}

/** A graha regente de um dígito 1–9. */
export function planetOf(digit: number): Planet {
  const planet = VEDIC_PLANETS[digit]
  if (planet === undefined) {
    throw new RangeError(`VEDIC_PLANETS espera um dígito reduzido 1–9, recebeu ${digit}`)
  }
  return planet
}
