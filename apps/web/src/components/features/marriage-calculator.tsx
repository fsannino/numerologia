'use client'

import { useId, useState } from 'react'
import type { FormEvent } from 'react'
import type { MarriageChart, CalculateMarriageChartError } from '@numerus/numerology-application'
import { calculateMarriageChart } from '@numerus/numerology-application'
import type { ModelId } from '@numerus/numerology-domain'
import { listModels } from '@numerus/numerology-domain'
import { localize } from '@numerus/shared-kernel'
import { useLocale } from '@/i18n/locale-context'
import type { UiMessages } from '@/i18n/ui-messages'
import { UI_MESSAGES } from '@/i18n/ui-messages'
import { NumberResultCard } from './number-result-card'

function todayISO(): string {
  const now = new Date()
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

function errorMessage(error: CalculateMarriageChartError, t: UiMessages): string {
  if (error.code === 'invalid-wedding-date') return t.errors.invalidBirthDate
  const cause = error.cause.cause
  if (cause.code === 'invalid-name') {
    if (cause.cause.code === 'empty-name') return t.errors.emptyName
    return t.errors.unsupportedCharacters(
      [...new Set(cause.cause.characters.map((item) => `"${item.character}"`))].join(', '),
    )
  }
  if (cause.code === 'invalid-birth-date') return t.errors.invalidBirthDate
  return t.errors.emptyName
}

export function MarriageCalculator() {
  const { locale } = useLocale()
  const t = UI_MESSAGES[locale]
  const nameAId = useId()
  const nameBId = useId()
  const dateAId = useId()
  const dateBId = useId()
  const weddingId = useId()
  const [nameA, setNameA] = useState('')
  const [nameB, setNameB] = useState('')
  const [dateA, setDateA] = useState('')
  const [dateB, setDateB] = useState('')
  const [weddingDate, setWeddingDate] = useState('')
  const [selectedModels, setSelectedModels] = useState<ReadonlyArray<ModelId>>(['pythagorean'])
  const [chart, setChart] = useState<MarriageChart | null>(null)
  const [error, setError] = useState<string | null>(null)

  function toggleModel(id: ModelId) {
    setSelectedModels((current) => {
      if (current.includes(id)) {
        return current.length > 1 ? current.filter((model) => model !== id) : current
      }
      return listModels().map((model) => model.id).filter((model) => current.includes(model) || model === id)
    })
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = calculateMarriageChart({
      personA: { fullName: nameA, ...(dateA !== '' ? { birthDate: dateA } : {}) },
      personB: { fullName: nameB, ...(dateB !== '' ? { birthDate: dateB } : {}) },
      weddingDate,
      models: selectedModels,
      referenceDate: todayISO(),
    })
    if (!result.ok) {
      setChart(null)
      setError(errorMessage(result.error, t))
      return
    }
    setError(null)
    setChart(result.value)
  }

  return (
    <section className="flex flex-col gap-6">
      <p className="text-[15px] leading-relaxed text-anil">{t.marriage.intro}</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 border border-anil bg-giz p-6" aria-label={t.marriage.build}>
        <div className="grid gap-4 sm:grid-cols-2">
          <fieldset className="flex flex-col gap-2">
            <legend className="font-mono text-[10px] uppercase tracking-[0.14em] text-latao">{t.synastry.personALabel}</legend>
            <label htmlFor={nameAId} className="sr-only">{t.form.nameLabel}</label>
            <input id={nameAId} type="text" value={nameA} onChange={(event) => setNameA(event.target.value)} placeholder={t.form.nameLabel} autoComplete="off" className="border border-anil bg-papel px-3 py-2 font-mono text-sm text-tinta" />
            <label htmlFor={dateAId} className="sr-only">{t.form.birthLabel}</label>
            <input id={dateAId} type="date" value={dateA} onChange={(event) => setDateA(event.target.value)} className="border border-anil bg-papel px-3 py-2 font-mono text-sm text-tinta" />
          </fieldset>
          <fieldset className="flex flex-col gap-2">
            <legend className="font-mono text-[10px] uppercase tracking-[0.14em] text-latao">{t.synastry.personBLabel}</legend>
            <label htmlFor={nameBId} className="sr-only">{t.form.nameLabel}</label>
            <input id={nameBId} type="text" value={nameB} onChange={(event) => setNameB(event.target.value)} placeholder={t.form.nameLabel} autoComplete="off" className="border border-anil bg-papel px-3 py-2 font-mono text-sm text-tinta" />
            <label htmlFor={dateBId} className="sr-only">{t.form.birthLabel}</label>
            <input id={dateBId} type="date" value={dateB} onChange={(event) => setDateB(event.target.value)} className="border border-anil bg-papel px-3 py-2 font-mono text-sm text-tinta" />
          </fieldset>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor={weddingId} className="font-mono text-[10px] uppercase tracking-[0.14em] text-latao">{t.marriage.weddingDateLabel}</label>
          <input id={weddingId} type="date" value={weddingDate} onChange={(event) => setWeddingDate(event.target.value)} className="w-fit border border-anil bg-papel px-3 py-2 font-mono text-sm text-tinta" />
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className="font-mono text-[10px] uppercase tracking-[0.14em] text-latao">{t.form.schoolsLabel}</legend>
          <div className="flex flex-wrap gap-3">
            {listModels().map((model) => (
              <label key={model.id} className="flex cursor-pointer items-center gap-2 border border-anil bg-papel px-3 py-1.5 text-sm text-tinta has-[:checked]:bg-latao has-[:checked]:text-giz">
                <input type="checkbox" checked={selectedModels.includes(model.id)} onChange={() => toggleModel(model.id)} className="accent-latao" />
                {localize(model.metadata.name, locale)}
              </label>
            ))}
          </div>
        </fieldset>

        <button type="submit" className="w-fit bg-tinta px-6 py-2.5 font-mono text-[12px] uppercase tracking-[0.14em] text-giz transition hover:bg-anil">
          {t.marriage.build}
        </button>

        {error !== null && (
          <p role="alert" className="border-l-2 border-tinta bg-papel px-4 py-3 text-[15px] font-medium text-tinta">{error}</p>
        )}
      </form>

      {chart !== null && (
        <div className="flex flex-col gap-6" aria-label={t.modes.marriage}>
          <p className=" bg-papel px-4 py-3 text-sm leading-relaxed text-tinta">
            {t.synastry.reflectionDisclaimer}
          </p>

          <section className="flex flex-col gap-2" aria-label={t.marriage.unionOfMarriageTitle}>
            <h3 className="font-display text-2xl text-tinta">{t.marriage.unionOfMarriageTitle}</h3>
            <div className="grid gap-3">
              <NumberResultCard trace={chart.governingNumber} />
              {chart.marriagePersonalYear !== undefined && <NumberResultCard trace={chart.marriagePersonalYear} />}
            </div>
          </section>

          {chart.synastry.results.map((result) => {
            const model = listModels().find((entry) => entry.id === result.model)
            return (
              <section key={result.model} className="flex flex-col gap-2" aria-label={model ? localize(model.metadata.name, locale) : result.model}>
                <h4 className="text-sm font-semibold">
                  {t.marriage.coupleTitle}
                  {chart.synastry.results.length > 1 && model ? ` · ${localize(model.metadata.name, locale)}` : ''}
                </h4>
                <div className="grid gap-3">
                  {result.unionNumbers.map((trace) => (
                    <NumberResultCard key={`${result.model}-${trace.resultId}`} trace={trace} />
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </section>
  )
}
