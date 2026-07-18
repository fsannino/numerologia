export type Locale = 'pt-BR' | 'en' | 'es'

export const SUPPORTED_LOCALES: ReadonlyArray<Locale> = ['pt-BR', 'en', 'es']
export const DEFAULT_LOCALE: Locale = 'pt-BR'

/**
 * Texto multi-idioma. `pt-BR` é obrigatório por ser o idioma-fonte do
 * conteúdo didático; os demais caem para ele quando ausentes.
 */
export type LocalizedText = {
  readonly 'pt-BR': string
  readonly en?: string
  readonly es?: string
}

export function localize(text: LocalizedText, locale: Locale): string {
  if (locale === 'pt-BR') return text['pt-BR']
  return text[locale] ?? text['pt-BR']
}

export const ptBR = (text: string): LocalizedText => ({ 'pt-BR': text })
