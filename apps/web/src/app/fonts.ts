import { IBM_Plex_Mono, Instrument_Serif, Literata } from 'next/font/google'

/**
 * Fontes self-hosted via next/font (build-time): nenhuma chamada de CDN em
 * runtime — coerente com device-first e o CSP com nonce (design.md §3/§8).
 * Display = numerais e títulos; Leitura = texto corrido; Dados = traços de
 * cálculo, chips e labels.
 */
export const displayFont = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-instrument',
  display: 'swap',
})

export const bodyFont = Literata({
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-literata',
  display: 'swap',
})

export const monoFont = IBM_Plex_Mono({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-plex',
  display: 'swap',
})
