'use client'

import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Locale } from '@numerus/shared-kernel'
import { DEFAULT_LOCALE } from '@numerus/shared-kernel'

type LocaleContextValue = {
  readonly locale: Locale
  readonly setLocale: (locale: Locale) => void
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => undefined,
})

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE)
  return <LocaleContext.Provider value={{ locale, setLocale }}>{children}</LocaleContext.Provider>
}

export function useLocale(): LocaleContextValue {
  return useContext(LocaleContext)
}
