'use client'

import { useState } from 'react'
import type { Locale } from '@numerus/shared-kernel'
import { SUPPORTED_LOCALES } from '@numerus/shared-kernel'
import { LocaleProvider, useLocale } from '@/i18n/locale-context'
import { UI_MESSAGES } from '@/i18n/ui-messages'
import { ChartCalculator } from '@/components/features/chart-calculator'
import { SignatureComparator } from '@/components/features/signature-comparator'
import { SynastryCalculator } from '@/components/features/synastry-calculator'

const LOCALE_SHORT_NAMES: Readonly<Record<Locale, string>> = { 'pt-BR': 'PT', en: 'EN', es: 'ES' }

type Mode = 'chart' | 'signature' | 'synastry'

function Shell() {
  const { locale, setLocale } = useLocale()
  const t = UI_MESSAGES[locale]
  const [mode, setMode] = useState<Mode>('chart')
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-10">
      <header className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-indigo-900">{t.header.title}</h1>
          <nav aria-label="Idioma / Language / Idioma" className="flex gap-1">
            {SUPPORTED_LOCALES.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setLocale(option)}
                aria-pressed={locale === option}
                className={`rounded-lg px-2.5 py-1 text-sm font-medium transition ${
                  locale === option
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {LOCALE_SHORT_NAMES[option]}
              </button>
            ))}
          </nav>
        </div>
        <p className="text-slate-600">{t.header.tagline}</p>
        <p className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-900">
          <span aria-hidden>🔒</span> {t.header.deviceBadge}
        </p>
      </header>

      <nav aria-label={t.modes.chart} className="flex gap-2 border-b border-slate-200">
        {(['chart', 'signature', 'synastry'] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setMode(option)}
            aria-current={mode === option}
            className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium transition ${
              mode === option
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.modes[option]}
          </button>
        ))}
      </nav>

      {mode === 'chart' && <ChartCalculator />}
      {mode === 'signature' && <SignatureComparator />}
      {mode === 'synastry' && <SynastryCalculator />}

      <footer className="border-t border-slate-200 pt-4 text-xs leading-relaxed text-slate-500">
        <p>{t.footer}</p>
      </footer>
    </main>
  )
}

export function AppShell() {
  return (
    <LocaleProvider>
      <Shell />
    </LocaleProvider>
  )
}
