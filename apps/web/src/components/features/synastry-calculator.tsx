'use client'

import { useId, useState } from 'react'
import type { FormEvent } from 'react'
import type { Synastry, BuildSynastryError } from '@numerus/numerology-application'
import { buildSynastry } from '@numerus/numerology-application'
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

function errorMessage(error: BuildSynastryError, t: UiMessages): string {
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

export function SynastryCalculator() {
  const { locale } = useLocale()
  const t = UI_MESSAGES[locale]
  const nameAId = useId()
  const nameBId = useId()
  const dateAId = useId()
  const dateBId = useId()
  const [nameA, setNameA] = useState('')
  const [nameB, setNameB] = useState('')
  const [dateA, setDateA] = useState('')
  const [dateB, setDateB] = useState('')
  const [selectedModels, setSelectedModels] = useState<ReadonlyArray<ModelId>>(['pythagorean'])
  const [synastry, setSynastry] = useState<Synastry | null>(null)
  const [error, setError] = useState<string | null>(null)

  function toggleModel(id: ModelId) {
    setSelectedModels((current) => {
      if (current.includes(id)) {
        return current.length > 1 ? current.filter((model) => model !== id) : current
      }
      return listModels()
        .map((model) => model.id)
        .filter((model) => current.includes(model) || model === id)
    })
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = buildSynastry({
      personA: { fullName: nameA, ...(dateA !== '' ? { birthDate: dateA } : {}) },
      personB: { fullName: nameB, ...(dateB !== '' ? { birthDate: dateB } : {}) },
      models: selectedModels,
      referenceDate: todayISO(),
    })
    if (!result.ok) {
      setSynastry(null)
      setError(errorMessage(result.error, t))
      return
    }
    setError(null)
    setSynastry(result.value)
  }

  return (
    <section className="flex flex-col gap-6">
      <p className="text-[15px] leading-relaxed text-anil">{t.synastry.intro}</p>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 border border-anil bg-giz p-6"
        aria-label={t.synastry.build}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <fieldset className="flex flex-col gap-2">
            <legend className="font-mono text-[10px] uppercase tracking-[0.14em] text-anil">{t.synastry.personALabel}</legend>
            <label htmlFor={nameAId} className="sr-only">{t.form.nameLabel}</label>
            <input
              id={nameAId}
              type="text"
              value={nameA}
              onChange={(event) => setNameA(event.target.value)}
              placeholder={t.form.nameLabel}
              autoComplete="off"
              className="border border-anil bg-papel px-3 py-2 font-mono text-sm text-tinta"
            />
            <label htmlFor={dateAId} className="sr-only">{t.form.birthLabel}</label>
            <input id={dateAId} type="date" value={dateA} onChange={(event) => setDateA(event.target.value)} className="border border-anil bg-papel px-3 py-2 font-mono text-sm text-tinta" />
          </fieldset>
          <fieldset className="flex flex-col gap-2">
            <legend className="font-mono text-[10px] uppercase tracking-[0.14em] text-anil">{t.synastry.personBLabel}</legend>
            <label htmlFor={nameBId} className="sr-only">{t.form.nameLabel}</label>
            <input
              id={nameBId}
              type="text"
              value={nameB}
              onChange={(event) => setNameB(event.target.value)}
              placeholder={t.form.nameLabel}
              autoComplete="off"
              className="border border-anil bg-papel px-3 py-2 font-mono text-sm text-tinta"
            />
            <label htmlFor={dateBId} className="sr-only">{t.form.birthLabel}</label>
            <input id={dateBId} type="date" value={dateB} onChange={(event) => setDateB(event.target.value)} className="border border-anil bg-papel px-3 py-2 font-mono text-sm text-tinta" />
          </fieldset>
        </div>
        <p className="text-xs text-anil">{t.form.birthHint}</p>

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

        <button
          type="submit"
          className="w-fit bg-latao px-6 py-2.5 font-mono text-[12px] uppercase tracking-[0.14em] text-papel transition hover:opacity-90"
        >
          {t.synastry.build}
        </button>

        {error !== null && (
          <p role="alert" className="border-l-2 border-tinta bg-papel px-4 py-3 text-[15px] font-medium text-tinta">
            {error}
          </p>
        )}
      </form>

      {synastry !== null && (
        <div className="flex flex-col gap-6" aria-label={t.modes.synastry}>
          <p className=" bg-papel px-4 py-3 text-sm leading-relaxed text-tinta">
            {t.synastry.reflectionDisclaimer}
          </p>

          {synastry.results.map((result) => {
            const model = listModels().find((entry) => entry.id === result.model)
            return (
              <section key={result.model} className="flex flex-col gap-3" aria-label={model ? localize(model.metadata.name, locale) : result.model}>
                {synastry.results.length > 1 && (
                  <h3 className="font-display text-2xl text-tinta">
                    {model ? localize(model.metadata.name, locale) : result.model}
                  </h3>
                )}
                {result.convergences.length > 0 && (
                  <p className=" bg-papel px-4 py-2 text-xs text-latao">
                    {t.synastry.convergenceNote(result.convergences.length)}
                  </p>
                )}
                <h4 className="text-sm font-semibold">{t.synastry.unionTitle}</h4>
                <div className="grid gap-3">
                  {result.unionNumbers.map((trace) => (
                    <NumberResultCard key={`${result.model}-${trace.resultId}`} trace={trace} />
                  ))}
                </div>

                {result.personalYear !== undefined && (
                  <div className="flex flex-col gap-2">
                    <h4 className="text-sm font-semibold">{t.synastry.personalYearTitle}</h4>
                    <div className="flex flex-wrap gap-3">
                      {[
                        { name: synastry.personAName, trace: result.personalYear.personA },
                        { name: synastry.personBName, trace: result.personalYear.personB },
                      ].map((entry, index) => (
                        <div key={index} className="flex items-center gap-3  border border-anil bg-papel px-4 py-2">
                          <span className="flex h-10 w-10 items-center justify-center bg-giz font-display text-2xl text-tinta">
                            {entry.trace.finalValue.reduced}
                          </span>
                          <span className="text-sm font-medium">{entry.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )
          })}
        </div>
      )}
    </section>
  )
}
