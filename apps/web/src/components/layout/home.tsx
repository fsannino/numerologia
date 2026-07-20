'use client'

import Link from 'next/link'
import type { ModelId } from '@numerus/numerology-domain'
import { calculateChart } from '@numerus/numerology-application'
import { listModels } from '@numerus/numerology-domain'
import type { Locale } from '@numerus/shared-kernel'
import { SUPPORTED_LOCALES, localize } from '@numerus/shared-kernel'
import { useLocale } from '@/i18n/locale-context'
import { UI_MESSAGES } from '@/i18n/ui-messages'
import { LiveExpression } from '@/components/features/live-expression'
import { SchoolProvenanceBadge } from '@/components/features/school-provenance-badge'

const LOCALE_SHORT_NAMES: Readonly<Record<Locale, string>> = { 'pt-BR': 'PT', en: 'EN', es: 'ES' }
const SCHOOL_SYMBOL: Readonly<Record<ModelId, string>> = {
  pythagorean: '1–9',
  chaldean: '1–8',
  'lo-shu': '▦',
  gematria: 'א',
  vedic: '☉',
  kabbalistic: '⚯',
  'gates-231': '╬',
}

/** As 4 leituras cabalísticas de um nome de exemplo — a divergência, ao vivo. */
function divergenceReadings() {
  const result = calculateChart({
    subject: { kind: 'person', fullName: 'Maria da Silva' },
    models: ['kabbalistic'],
    numbers: ['kabbalistic-name'],
  })
  if (!result.ok) return []
  const step = result.value.results[0]?.traces[0]?.steps.find((s) => s.kind === 'reading-matrix')
  return step?.kind === 'reading-matrix' ? step.output.readings : []
}

export function Home() {
  const { locale, setLocale } = useLocale()
  const t = UI_MESSAGES[locale]
  const h = t.home
  const readings = divergenceReadings()

  return (
    <div className="mx-auto flex max-w-5xl flex-col">
      {/* Header */}
      <header className="flex items-center justify-between gap-4 border-b border-anil px-5 py-5 sm:px-8">
        <span className="font-display text-3xl leading-none text-tinta">{t.header.title}</span>
        <nav aria-label="Idioma / Language / Idioma" className="flex gap-px border border-anil">
          {SUPPORTED_LOCALES.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setLocale(option)}
              aria-pressed={locale === option}
              className={`px-2.5 py-1 font-mono text-xs tracking-wide transition ${
                locale === option ? 'bg-latao text-papel' : 'bg-giz text-anil hover:bg-papel'
              }`}
            >
              {LOCALE_SHORT_NAMES[option]}
            </button>
          ))}
        </nav>
      </header>

      {/* Hero */}
      <section className="grid gap-px border-b border-anil bg-anil sm:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col justify-center gap-6 bg-papel px-5 py-14 sm:px-8">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-latao">{h.heroKicker}</span>
          <h1 className="font-display text-5xl leading-[1.02] text-tinta text-balance sm:text-6xl">{h.heroTitle}</h1>
          <p className="max-w-[46ch] text-[17px] leading-relaxed text-anil">{h.heroLede}</p>
          <p className="flex items-center gap-2 font-mono text-[11px] tracking-wide text-anil">
            <span aria-hidden>🔒</span> {t.header.deviceBadge}
          </p>
          <Link
            href="/mapa"
            className="w-fit bg-latao px-6 py-3 font-mono text-[12px] uppercase tracking-[0.16em] text-papel transition hover:opacity-90"
          >
            {h.cta} →
          </Link>
        </div>
        <LiveExpression />
      </section>

      {/* Escolas */}
      <section id="escolas" className="border-b border-anil px-5 py-14 sm:px-8">
        <h2 className="mb-8 font-display text-4xl text-tinta">{h.schoolsTitle}</h2>
        <div className="grid gap-px border border-anil bg-anil sm:grid-cols-2 lg:grid-cols-3">
          {listModels().map((model) => (
            <article key={model.id} className="flex flex-col gap-3 bg-giz p-5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-display text-3xl text-latao">{SCHOOL_SYMBOL[model.id]}</span>
                <SchoolProvenanceBadge metadata={model.metadata} />
              </div>
              <h3 className="font-display text-2xl text-tinta">{localize(model.metadata.name, locale)}</h3>
              <p className="text-[13.5px] leading-relaxed text-anil">{localize(model.metadata.historicalOrigin, locale)}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Manifesto */}
      <section className="grid gap-px border-b border-anil bg-anil sm:grid-cols-[0.4fr_0.6fr]">
        <div className="flex items-center justify-center bg-giz px-5 py-14">
          <span className="font-display text-8xl text-latao sm:text-9xl">8</span>
        </div>
        <div className="flex flex-col justify-center gap-4 bg-giz px-5 py-14 sm:px-8">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-latao">{h.manifestoKicker}</span>
          <p className="max-w-[48ch] font-display text-2xl leading-snug text-tinta sm:text-3xl">{h.manifestoText}</p>
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-tinta/60">{h.manifestoCaveat}</p>
        </div>
      </section>

      {/* Divergência */}
      <section id="divergencia" className="border-b border-anil px-5 py-14 sm:px-8">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-vermelhao">{h.divergenceKicker}</span>
        <h2 className="mt-3 max-w-[24ch] font-display text-4xl text-tinta text-balance">{h.divergenceTitle}</h2>
        {readings.length > 0 && (
          <div className="mt-8 grid gap-px border border-anil bg-anil sm:grid-cols-4">
            {readings.map((reading) => {
              const isArcano = reading.reduction === 'modular-22'
              return (
                <div key={`${reading.table}-${reading.reduction}`} className="flex flex-col items-center gap-2 bg-giz p-5">
                  <span className={`font-display text-5xl ${isArcano ? 'text-vermelhao' : 'text-tinta'}`}>
                    {reading.value}
                  </span>
                  <span className="text-center font-mono text-[9px] uppercase leading-tight tracking-[0.08em] text-anil">
                    {t.kabbalistic.tableLabel[reading.table]}
                    <br />
                    {t.kabbalistic.reductionLabel[reading.reduction]}
                  </span>
                </div>
              )
            })}
          </div>
        )}
        <p className="mt-6 max-w-[70ch] text-[15px] leading-relaxed text-anil">{h.divergenceNote}</p>
      </section>

      {/* Device-first + CTA */}
      <section className="flex flex-col items-start gap-5 bg-giz px-5 py-14 sm:px-8">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-latao">{h.deviceTitle}</span>
        <p className="max-w-[52ch] font-display text-2xl leading-snug text-tinta">{h.deviceText}</p>
        <Link
          href="/mapa"
          className="w-fit border border-latao px-6 py-3 font-mono text-[12px] uppercase tracking-[0.16em] text-latao transition hover:bg-latao hover:text-papel"
        >
          {h.cta} →
        </Link>
      </section>

      {/* Rodapé */}
      <footer className="flex flex-col gap-3 px-5 py-10 sm:px-8">
        <span className="font-display text-2xl text-tinta">{t.header.title}</span>
        <p className="max-w-[80ch] font-mono text-[11px] leading-relaxed tracking-wide text-anil">{t.footer}</p>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-anil">pt-BR · en · es</p>
      </footer>
    </div>
  )
}
