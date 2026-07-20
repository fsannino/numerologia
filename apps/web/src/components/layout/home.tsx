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
import { ProofOfDivergence } from '@/components/features/proof-of-divergence'
import { SchoolProvenanceBadge } from '@/components/features/school-provenance-badge'
import { SCHOOL_BORDER_TOP, SCHOOL_TEXT } from '@/components/features/school-color'

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

/** As leituras cabalísticas de um nome de exemplo — a divergência interna, ao vivo. */
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
      {/* Faixa de topo — escassez honesta (cópia; sem enforcement até haver billing) */}
      <div className="sticky top-0 z-20 flex items-center justify-center gap-2 border-b border-latao/40 bg-giz px-4 py-2 text-center">
        <span aria-hidden className="text-latao">✦</span>
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-latao">{h.topBanner}</span>
      </div>

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
        <div className="flex flex-col justify-center gap-5 bg-papel px-5 py-14 sm:px-8">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-latao">{h.heroKicker}</span>
          <h1 className="font-display text-5xl leading-[1.02] text-tinta text-balance sm:text-6xl">{h.heroTitle}</h1>
          <p className="max-w-[42ch] text-[17px] leading-relaxed text-tinta">{h.heroSubhead}</p>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-anil">{h.heroTagline}</p>
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

      {/* Prova imediata — sete escolas, sete números (o "momento uau") */}
      <ProofOfDivergence />

      {/* Por que discordam — a divergência interna de uma escola */}
      <section id="divergencia" className="border-b border-anil px-5 py-14 sm:px-8">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-vermelhao">{h.divergenceKicker}</span>
        <h2 className="mt-3 max-w-[24ch] font-display text-4xl text-tinta text-balance">{h.divergenceTitle}</h2>
        {readings.length > 0 && (
          <div className="mt-8 grid gap-px border border-anil bg-anil sm:grid-cols-4">
            {readings.map((reading) => {
              const isArcano = reading.reduction === 'modular-22'
              return (
                <div key={`${reading.table}-${reading.reduction}`} className="flex flex-col items-center gap-2 bg-giz p-5">
                  <span className={`font-display text-5xl ${isArcano ? 'text-vermelhao' : 'text-latao'}`}>
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

      {/* As escolas */}
      <section id="escolas" className="border-b border-anil px-5 py-14 sm:px-8">
        <h2 className="mb-8 font-display text-4xl text-tinta">{h.schoolsTitle}</h2>
        <div className="grid border-l border-t border-anil sm:grid-cols-2 lg:grid-cols-3">
          {listModels().map((model) => (
            <article
              key={model.id}
              className={`flex flex-col gap-3 border-r border-b border-t-2 border-anil ${SCHOOL_BORDER_TOP[model.id]} bg-giz p-5`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className={`font-display text-3xl ${SCHOOL_TEXT[model.id]}`}>{SCHOOL_SYMBOL[model.id]}</span>
                <SchoolProvenanceBadge metadata={model.metadata} />
              </div>
              <h3 className="font-display text-2xl text-tinta">{localize(model.metadata.name, locale)}</h3>
              <p className="text-[13.5px] leading-relaxed text-anil">{localize(model.metadata.historicalOrigin, locale)}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Duas trilhas */}
      <section id="trilhas" className="border-b border-anil px-5 py-14 sm:px-8">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-latao">{h.tracksKicker}</span>
        <h2 className="mt-3 mb-8 max-w-[24ch] font-display text-4xl text-tinta text-balance">{h.tracksTitle}</h2>
        <div className="grid gap-px border border-anil bg-anil sm:grid-cols-2">
          {/* Pessoal */}
          <article className="flex flex-col gap-4 bg-giz p-6">
            <h3 className="font-display text-2xl text-tinta">{h.trackPersonalTitle}</h3>
            <p className="max-w-[44ch] text-[15px] leading-relaxed text-anil">{h.trackPersonalText}</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-latao">{h.trackPersonalMeta}</p>
            <Link
              href="/mapa"
              className="mt-auto w-fit bg-latao px-6 py-2.5 font-mono text-[12px] uppercase tracking-[0.16em] text-papel transition hover:opacity-90"
            >
              {h.trackPersonalCta} →
            </Link>
          </article>
          {/* Profissional */}
          <article className="flex flex-col gap-4 bg-giz p-6">
            <h3 className="font-display text-2xl text-tinta">{h.trackProTitle}</h3>
            <p className="max-w-[44ch] text-[15px] leading-relaxed text-anil">{h.trackProText}</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-anil">{h.trackProMeta}</p>
            <Link
              href="/mapa"
              className="mt-auto w-fit border border-azul px-6 py-2.5 font-mono text-[12px] uppercase tracking-[0.16em] text-azul transition hover:bg-azul hover:text-papel"
            >
              {h.trackProCta} →
            </Link>
          </article>
        </div>
      </section>

      {/* Privacidade (encurtada) */}
      <section className="flex flex-col items-start gap-4 bg-giz px-5 py-12 sm:px-8">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-latao">{h.deviceTitle}</span>
        <p className="max-w-[60ch] font-display text-2xl leading-snug text-tinta">{h.deviceText}</p>
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
