'use client'

import { useId, useState } from 'react'
import type { FormEvent } from 'react'
import type { Chart, CalculateChartError } from '@numerus/numerology-application'
import { calculateChart } from '@numerus/numerology-application'
import type { NumberKind } from '@numerus/numerology-domain'
import { pythagoreanModel } from '@numerus/numerology-domain'
import { localize } from '@numerus/shared-kernel'
import { useLocale } from '@/i18n/locale-context'
import type { UiMessages } from '@/i18n/ui-messages'
import { UI_MESSAGES } from '@/i18n/ui-messages'
import { NumberResultCard } from './number-result-card'
import { PythagoreanTable } from './pythagorean-table'

const NAME_NUMBERS: ReadonlyArray<NumberKind> = [
  'expression',
  'motivation',
  'impression',
  'key-number',
  'karmic-lessons',
  'hidden-tendencies',
  'subconscious',
]
const DATE_NUMBERS: ReadonlyArray<NumberKind> = [
  'life-path',
  'psychic',
  'mission',
  'life-cycles',
  'pinnacles',
  'challenges',
  'personal-year',
  'personal-month',
  'personal-day',
]

/** "Hoje" calculado na UI — o domínio nunca lê o relógio (ADR-0007). */
function todayISO(): string {
  const now = new Date()
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

function errorMessage(error: CalculateChartError, t: UiMessages): string {
  switch (error.code) {
    case 'invalid-name':
      if (error.cause.code === 'empty-name') {
        return t.errors.emptyName
      }
      return t.errors.unsupportedCharacters(
        [...new Set(error.cause.characters.map((item) => `"${item.character}"`))].join(', '),
      )
    case 'invalid-birth-date':
      return t.errors.invalidBirthDate
    case 'missing-birth-date':
      return t.errors.missingBirthDate
    case 'invalid-reference-date':
      return t.errors.invalidReferenceDate
    case 'missing-reference-date':
      return t.errors.missingReferenceDate
    case 'reference-before-birth-date':
      return t.errors.referenceBeforeBirth
    case 'unknown-model':
      return t.errors.unknownModel(error.model)
    case 'unsupported-number':
      return t.errors.unsupportedNumber(error.model, error.number)
    case 'unsupported-subject':
      return t.errors.unsupportedSubject(error.model, error.subject)
    case 'unknown-variant':
      return t.errors.unknownVariant(error.option, error.dimension)
  }
}

export function ChartCalculator() {
  const { locale } = useLocale()
  const t = UI_MESSAGES[locale]
  const nameInputId = useId()
  const dateInputId = useId()
  const referenceInputId = useId()
  const [fullName, setFullName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [referenceDate, setReferenceDate] = useState(todayISO)
  const [variantSelections, setVariantSelections] = useState<Record<string, string>>({})
  const [chart, setChart] = useState<Chart | null>(null)
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const numbers = birthDate === '' ? NAME_NUMBERS : [...NAME_NUMBERS, ...DATE_NUMBERS]
    const result = calculateChart({
      subject: { kind: 'person', fullName, ...(birthDate !== '' ? { birthDate } : {}) },
      models: ['pythagorean'],
      numbers,
      variantSelections,
      ...(referenceDate !== '' ? { referenceDate } : {}),
    })
    if (!result.ok) {
      setChart(null)
      setError(errorMessage(result.error, t))
      return
    }
    setError(null)
    setChart(result.value)
  }

  const traces = chart?.results[0]?.traces ?? []
  const expressionTrace = traces.find((trace) => trace.resultId === 'expression')
  const highlightedLetters = new Set(
    expressionTrace?.steps.flatMap((step) =>
      step.kind === 'letter-mapping' ? step.output.entries.map((entry) => entry.letter) : [],
    ) ?? [],
  )

  return (
    <section className="flex flex-col gap-6">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        aria-label={t.form.calculate}
      >
        <div className="flex flex-col gap-1">
          <label htmlFor={nameInputId} className="font-medium">
            {t.form.nameLabel}
          </label>
          <input
            id={nameInputId}
            type="text"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder={t.form.namePlaceholder}
            autoComplete="off"
            className="rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor={dateInputId} className="font-medium">
            {t.form.birthLabel} <span className="font-normal text-slate-500">{t.form.optionalTag}</span>
          </label>
          <input
            id={dateInputId}
            type="date"
            value={birthDate}
            onChange={(event) => setBirthDate(event.target.value)}
            className="w-fit rounded-lg border border-slate-300 bg-white px-3 py-2"
          />
          <p className="text-xs text-slate-500">{t.form.birthHint}</p>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor={referenceInputId} className="font-medium">
            {t.form.referenceLabel}{' '}
            <span className="font-normal text-slate-500">{t.form.referenceTag}</span>
          </label>
          <input
            id={referenceInputId}
            type="date"
            value={referenceDate}
            onChange={(event) => setReferenceDate(event.target.value)}
            className="w-fit rounded-lg border border-slate-300 bg-white px-3 py-2"
          />
          <p className="text-xs text-slate-500">{t.form.referenceHint}</p>
        </div>

        <details className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <summary className="cursor-pointer text-sm font-medium">{t.form.variantsSummary}</summary>
          <div className="mt-3 flex flex-col gap-3">
            {pythagoreanModel.metadata.variantDimensions.map((dimension) => {
              const selectId = `variant-${dimension.dimension}`
              return (
                <div key={dimension.dimension} className="flex flex-col gap-1">
                  <label htmlFor={selectId} className="text-sm font-medium">
                    {localize(dimension.label, locale)}
                  </label>
                  <select
                    id={selectId}
                    value={variantSelections[dimension.dimension] ?? dimension.defaultOption}
                    onChange={(event) =>
                      setVariantSelections((current) => ({
                        ...current,
                        [dimension.dimension]: event.target.value,
                      }))
                    }
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                  >
                    {dimension.options.map((option) => (
                      <option key={option.id} value={option.id}>
                        {localize(option.label, locale)}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500">
                    {localize(
                      dimension.options.find(
                        (option) =>
                          option.id === (variantSelections[dimension.dimension] ?? dimension.defaultOption),
                      )?.description ?? { 'pt-BR': '' },
                      locale,
                    )}
                  </p>
                </div>
              )
            })}
            <p className="text-xs text-slate-500">{t.form.variantsNote}</p>
          </div>
        </details>

        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          {t.form.calculate}
        </button>

        {error !== null && (
          <p role="alert" className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-900">
            {error}
          </p>
        )}
      </form>

      {traces.length > 0 && (
        <div className="flex flex-col gap-6" aria-label={t.results.chartTitle}>
          <section className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold text-indigo-950">
              {t.results.chartTitle}{' '}
              <span className="text-sm font-normal text-slate-500">
                · {t.results.engine(traces[0]?.engineVersion ?? '')}
              </span>
            </h2>
            <div className="grid gap-3">
              {traces.map((trace) => (
                <NumberResultCard key={trace.resultId} trace={trace} />
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-3" aria-label={t.results.tableTitle}>
            <h3 className="text-lg font-semibold">{t.results.tableTitle}</h3>
            <p className="text-sm text-slate-600">{t.results.tableHint}</p>
            <PythagoreanTable highlight={highlightedLetters} />
          </section>
        </div>
      )}
    </section>
  )
}
