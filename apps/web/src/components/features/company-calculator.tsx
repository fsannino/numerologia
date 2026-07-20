'use client'

import { useId, useState } from 'react'
import type { FormEvent } from 'react'
import type { CompanyChart, CalculateCompanyChartError } from '@numerus/numerology-application'
import { calculateCompanyChart } from '@numerus/numerology-application'
import type { ModelId } from '@numerus/numerology-domain'
import { listModels } from '@numerus/numerology-domain'
import { localize } from '@numerus/shared-kernel'
import { useLocale } from '@/i18n/locale-context'
import type { UiMessages } from '@/i18n/ui-messages'
import { UI_MESSAGES } from '@/i18n/ui-messages'
import { NumberResultCard } from './number-result-card'

function errorMessage(error: CalculateCompanyChartError, t: UiMessages): string {
  const cause = error.cause
  if (cause.code === 'invalid-name') {
    if (cause.cause.code === 'empty-name') return t.errors.emptyName
    return t.errors.unsupportedCharacters(
      [...new Set(cause.cause.characters.map((item) => `"${item.character}"`))].join(', '),
    )
  }
  if (cause.code === 'invalid-birth-date') return t.errors.invalidBirthDate
  if (cause.code === 'unknown-model') return t.errors.unknownModel(cause.model)
  return t.errors.emptyName
}

export function CompanyCalculator() {
  const { locale } = useLocale()
  const t = UI_MESSAGES[locale]
  const legalId = useId()
  const tradeId = useId()
  const dateId = useId()
  const founderId = useId()
  const [legalName, setLegalName] = useState('')
  const [tradeName, setTradeName] = useState('')
  const [incorporationDate, setIncorporationDate] = useState('')
  const [founderName, setFounderName] = useState('')
  const [selectedModels, setSelectedModels] = useState<ReadonlyArray<ModelId>>(['pythagorean'])
  const [chart, setChart] = useState<CompanyChart | null>(null)
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
    const result = calculateCompanyChart({
      legalName,
      tradeName,
      ...(incorporationDate !== '' ? { incorporationDate } : {}),
      ...(founderName !== '' ? { founderName } : {}),
      models: selectedModels,
    })
    if (!result.ok) {
      setChart(null)
      setError(errorMessage(result.error, t))
      return
    }
    setError(null)
    setChart(result.value)
  }

  const textField = (id: string, label: string, value: string, onChange: (value: string) => void) => (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="font-mono text-[10px] uppercase tracking-[0.14em] text-anil">{label}</label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete="off"
        className="border border-anil bg-papel px-3 py-2 font-mono text-sm text-tinta focus:outline-none focus:border-latao"
      />
    </div>
  )

  return (
    <section className="flex flex-col gap-6">
      <p className="text-[15px] leading-relaxed text-anil">{t.company.intro}</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 border border-anil bg-giz p-6" aria-label={t.company.build}>
        {textField(legalId, t.company.legalNameLabel, legalName, setLegalName)}
        {textField(tradeId, t.company.tradeNameLabel, tradeName, setTradeName)}
        <div className="flex flex-col gap-1">
          <label htmlFor={dateId} className="font-mono text-[10px] uppercase tracking-[0.14em] text-anil">
            {t.company.incorporationLabel} <span className="font-normal text-anil">{t.form.optionalTag}</span>
          </label>
          <input id={dateId} type="date" value={incorporationDate} onChange={(event) => setIncorporationDate(event.target.value)} className="w-fit border border-anil bg-papel px-3 py-2 font-mono text-sm text-tinta" />
        </div>
        {textField(founderId, `${t.company.founderLabel} ${t.form.optionalTag}`, founderName, setFounderName)}

        <fieldset className="flex flex-col gap-2">
          <legend className="font-mono text-[10px] uppercase tracking-[0.14em] text-anil">{t.form.schoolsLabel}</legend>
          <div className="flex flex-wrap gap-3">
            {listModels().map((model) => (
              <label key={model.id} className="flex cursor-pointer items-center gap-2 border border-anil bg-papel px-3 py-1.5 text-sm text-tinta has-[:checked]:bg-latao has-[:checked]:text-papel">
                <input type="checkbox" checked={selectedModels.includes(model.id)} onChange={() => toggleModel(model.id)} className="accent-latao" />
                {localize(model.metadata.name, locale)}
              </label>
            ))}
          </div>
        </fieldset>

        <button type="submit" className="w-fit bg-latao px-6 py-2.5 font-mono text-[12px] uppercase tracking-[0.14em] text-papel transition hover:opacity-90">
          {t.company.build}
        </button>

        {error !== null && (
          <p role="alert" className="border-l-2 border-tinta bg-papel px-4 py-3 text-[15px] font-medium text-tinta">{error}</p>
        )}
      </form>

      {chart !== null && (
        <div className="flex flex-col gap-6" aria-label={t.modes.company}>
          {chart.results.map((result) => {
            const model = listModels().find((entry) => entry.id === result.model)
            const harmonyCards = [result.brandHarmony, result.founderAffinity, result.corporateDestiny].filter(
              (trace): trace is NonNullable<typeof trace> => trace !== undefined,
            )
            return (
              <section key={result.model} className="flex flex-col gap-4" aria-label={model ? localize(model.metadata.name, locale) : result.model}>
                {chart.results.length > 1 && (
                  <h3 className="font-display text-2xl text-tinta">{model ? localize(model.metadata.name, locale) : result.model}</h3>
                )}
                <div className="flex flex-col gap-2">
                  <h4 className="text-sm font-semibold">{t.company.harmonyTitle}</h4>
                  <div className="grid gap-3">
                    {harmonyCards.map((trace) => (
                      <NumberResultCard key={`${result.model}-${trace.resultId}`} trace={trace} />
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className="text-sm font-semibold">{t.company.brandTitle}</h4>
                  <div className="grid gap-3">
                    {result.brandNumbers.map((trace) => (
                      <NumberResultCard key={`${result.model}-brand-${trace.resultId}`} trace={trace} />
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className="text-sm font-semibold">{t.company.corporateTitle}</h4>
                  <div className="grid gap-3">
                    {result.corporateNumbers.map((trace) => (
                      <NumberResultCard key={`${result.model}-corp-${trace.resultId}`} trace={trace} />
                    ))}
                  </div>
                </div>
              </section>
            )
          })}
        </div>
      )}
    </section>
  )
}
