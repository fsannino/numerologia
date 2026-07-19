'use client'

import { useState } from 'react'
import type { Locale } from '@numerus/shared-kernel'
import { SUPPORTED_LOCALES } from '@numerus/shared-kernel'
import { LocaleProvider, useLocale } from '@/i18n/locale-context'
import { UI_MESSAGES } from '@/i18n/ui-messages'
import { ChartCalculator } from '@/components/features/chart-calculator'
import { SignatureComparator } from '@/components/features/signature-comparator'
import { SynastryCalculator } from '@/components/features/synastry-calculator'
import { CompanyCalculator } from '@/components/features/company-calculator'
import { MarriageCalculator } from '@/components/features/marriage-calculator'

const LOCALE_SHORT_NAMES: Readonly<Record<Locale, string>> = { 'pt-BR': 'PT', en: 'EN', es: 'ES' }

type Mode = 'chart' | 'signature' | 'synastry' | 'company' | 'marriage'

function Shell() {
  const { locale, setLocale } = useLocale()
  const t = UI_MESSAGES[locale]
  const [mode, setMode] = useState<Mode>('chart')
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-10 px-5 py-10 sm:px-8">
      <header className="flex flex-col gap-4 border-b border-anil pb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <h1 className="font-display text-5xl leading-none tracking-tight text-tinta">{t.header.title}</h1>
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-anil">
              a numerologia com a conta à mostra
            </span>
          </div>
          <nav aria-label="Idioma / Language / Idioma" className="flex gap-px border border-anil">
            {SUPPORTED_LOCALES.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setLocale(option)}
                aria-pressed={locale === option}
                className={`px-2.5 py-1 font-mono text-xs tracking-wide transition ${
                  locale === option ? 'bg-latao text-giz' : 'bg-giz text-anil hover:bg-papel'
                }`}
              >
                {LOCALE_SHORT_NAMES[option]}
              </button>
            ))}
          </nav>
        </div>
        <p className="max-w-[52ch] text-[15px] leading-relaxed text-anil">{t.header.tagline}</p>
        <p className="inline-flex w-fit items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-anil">
          <span aria-hidden>🔒</span> {t.header.deviceBadge}
        </p>
      </header>

      <nav aria-label={t.modes.chart} className="flex flex-wrap gap-x-1 gap-y-2 border-b border-anil">
        {(['chart', 'signature', 'synastry', 'company', 'marriage'] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setMode(option)}
            aria-current={mode === option}
            className={`-mb-px border-b-2 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.1em] transition ${
              mode === option
                ? 'border-latao text-tinta'
                : 'border-transparent text-anil hover:text-tinta'
            }`}
          >
            {t.modes[option]}
          </button>
        ))}
      </nav>

      {mode === 'chart' && <ChartCalculator />}
      {mode === 'signature' && <SignatureComparator />}
      {mode === 'synastry' && <SynastryCalculator />}
      {mode === 'company' && <CompanyCalculator />}
      {mode === 'marriage' && <MarriageCalculator />}

      <footer className="border-t border-anil pt-5 font-mono text-[11px] leading-relaxed tracking-wide text-anil">
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
