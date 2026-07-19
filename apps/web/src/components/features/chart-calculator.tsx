'use client'

import { useId, useState } from 'react'
import type { FormEvent } from 'react'
import type { Chart, CalculateChartError, ChartModelResult } from '@numerus/numerology-application'
import { calculateChart } from '@numerus/numerology-application'
import type { ModelId, NumberKind } from '@numerus/numerology-domain'
import { listModels } from '@numerus/numerology-domain'
import { localize } from '@numerus/shared-kernel'
import { useLocale } from '@/i18n/locale-context'
import type { UiMessages } from '@/i18n/ui-messages'
import { UI_MESSAGES } from '@/i18n/ui-messages'
import { ComparisonMatrix } from './comparison-matrix'
import { LetterValuesTable } from './letter-values-table'
import { NumberResultCard } from './number-result-card'
import { SchoolProvenanceBadge } from './school-provenance-badge'

const NAME_NUMBERS: ReadonlyArray<NumberKind> = [
  'expression',
  'motivation',
  'impression',
  'key-number',
  'karmic-lessons',
  'hidden-tendencies',
  'subconscious',
  'gematria-value',
  'kabbalistic-name',
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
  'lo-shu-grid',
  'vedic-moolank',
  'vedic-bhagyank',
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

function lettersUsedIn(result: ChartModelResult): ReadonlySet<string> {
  return new Set(
    result.traces.flatMap((trace) =>
      trace.steps.flatMap((step) =>
        step.kind === 'letter-mapping' ? step.output.entries.map((entry) => entry.letter) : [],
      ),
    ),
  )
}

/** As dimensões de variante da união dos modelos selecionados, sem repetição. */
function variantDimensionsFor(models: ReadonlyArray<ModelId>) {
  const seen = new Set<string>()
  return listModels()
    .filter((model) => models.includes(model.id))
    .flatMap((model) => model.metadata.variantDimensions)
    .filter((dimension) => {
      if (seen.has(dimension.dimension)) return false
      seen.add(dimension.dimension)
      return true
    })
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
  const [selectedModels, setSelectedModels] = useState<ReadonlyArray<ModelId>>(['pythagorean'])
  const [variantSelections, setVariantSelections] = useState<Record<string, string>>({})
  const [chart, setChart] = useState<Chart | null>(null)
  const [error, setError] = useState<string | null>(null)

  function toggleModel(id: ModelId) {
    setSelectedModels((current) => {
      if (current.includes(id)) {
        // Sempre ao menos uma escola selecionada.
        return current.length > 1 ? current.filter((model) => model !== id) : current
      }
      return listModels()
        .map((model) => model.id)
        .filter((model) => current.includes(model) || model === id)
    })
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const numbers = birthDate === '' ? NAME_NUMBERS : [...NAME_NUMBERS, ...DATE_NUMBERS]
    const result = calculateChart({
      subject: { kind: 'person', fullName, ...(birthDate !== '' ? { birthDate } : {}) },
      models: selectedModels,
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

  const results = chart?.results ?? []
  const engineVersion = results[0]?.traces[0]?.engineVersion ?? ''

  return (
    <section className="flex flex-col gap-6">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 border border-anil bg-giz p-6"
        aria-label={t.form.calculate}
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor={nameInputId} className="font-mono text-[10px] uppercase tracking-[0.14em] text-latao">
            {t.form.nameLabel}
          </label>
          <input
            id={nameInputId}
            type="text"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder={t.form.namePlaceholder}
            autoComplete="off"
            className="border-0 border-b border-anil bg-transparent px-1 py-2 font-mono text-lg tracking-wide text-tinta placeholder:text-anil/50 focus:outline-none focus:border-latao"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={dateInputId} className="font-mono text-[10px] uppercase tracking-[0.14em] text-latao">
            {t.form.birthLabel} <span className="text-anil">{t.form.optionalTag}</span>
          </label>
          <input
            id={dateInputId}
            type="date"
            value={birthDate}
            onChange={(event) => setBirthDate(event.target.value)}
            className="w-fit border border-anil bg-papel px-3 py-2 font-mono text-sm text-tinta"
          />
          <p className="text-[13px] leading-relaxed text-anil">{t.form.birthHint}</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={referenceInputId} className="font-mono text-[10px] uppercase tracking-[0.14em] text-latao">
            {t.form.referenceLabel} <span className="text-anil">{t.form.referenceTag}</span>
          </label>
          <input
            id={referenceInputId}
            type="date"
            value={referenceDate}
            onChange={(event) => setReferenceDate(event.target.value)}
            className="w-fit border border-anil bg-papel px-3 py-2 font-mono text-sm text-tinta"
          />
          <p className="text-[13px] leading-relaxed text-anil">{t.form.referenceHint}</p>
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-latao">{t.form.schoolsLabel}</legend>
          <div className="flex flex-wrap gap-2">
            {listModels().map((model) => (
              <label key={model.id} className="flex cursor-pointer items-center gap-2 border border-anil bg-papel px-3 py-1.5 text-sm text-tinta has-[:checked]:bg-latao has-[:checked]:text-giz">
                <input
                  type="checkbox"
                  checked={selectedModels.includes(model.id)}
                  onChange={() => toggleModel(model.id)}
                  className="accent-latao"
                />
                {localize(model.metadata.name, locale)}
              </label>
            ))}
          </div>
        </fieldset>

        <details className="border border-anil bg-papel p-3">
          <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-[0.1em] text-anil">{t.form.variantsSummary}</summary>
          <div className="mt-3 flex flex-col gap-3">
            {variantDimensionsFor(selectedModels).map((dimension) => {
              const selectId = `variant-${dimension.dimension}`
              return (
                <div key={dimension.dimension} className="flex flex-col gap-1">
                  <label htmlFor={selectId} className="font-mono text-[10px] uppercase tracking-[0.12em] text-anil">
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
                    className="border border-anil bg-giz px-3 py-2 font-mono text-sm text-tinta"
                  >
                    {dimension.options.map((option) => (
                      <option key={option.id} value={option.id}>
                        {localize(option.label, locale)}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-anil">
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
            <p className="text-[13px] leading-relaxed text-anil">{t.form.variantsNote}</p>
          </div>
        </details>

        <button
          type="submit"
          className="w-fit bg-tinta px-6 py-2.5 font-mono text-[12px] uppercase tracking-[0.14em] text-giz transition hover:bg-anil"
        >
          {t.form.calculate}
        </button>

        {error !== null && (
          <p role="alert" className="border-l-2 border-tinta bg-papel px-4 py-3 text-[15px] font-medium text-tinta">
            {error}
          </p>
        )}
      </form>

      {results.length > 0 && (
        <div className="flex flex-col gap-10" aria-label={t.results.chartTitle}>
          <h2 className="flex flex-wrap items-baseline gap-x-3 border-b border-anil pb-2 font-display text-3xl text-tinta">
            {t.results.chartTitle}
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-anil">· {t.results.engine(engineVersion)}</span>
          </h2>

          {results.length > 1 && <ComparisonMatrix results={results} />}

          {results.filter((result) => result.traces.length > 0).map((result) => {
            const model = listModels().find((entry) => entry.id === result.model)
            return (
              <section key={result.model} className="flex flex-col gap-3" aria-label={model ? localize(model.metadata.name, locale) : result.model}>
                <div className="flex flex-wrap items-center gap-3">
                  {results.length > 1 && (
                    <h3 className="font-display text-2xl text-tinta">
                      {model ? localize(model.metadata.name, locale) : result.model}
                    </h3>
                  )}
                  {model && <SchoolProvenanceBadge metadata={model.metadata} />}
                </div>
                <div className="grid gap-3">
                  {result.traces.map((trace) => (
                    <NumberResultCard key={`${result.model}-${trace.resultId}`} trace={trace} />
                  ))}
                </div>
                {model?.metadata.letterValues !== undefined && (
                  <div className="flex flex-col gap-2">
                    <h4 className="font-mono text-[10px] uppercase tracking-[0.12em] text-latao">{t.results.tableTitle}</h4>
                    <p className="text-[13px] text-anil">{t.results.tableHint}</p>
                    <LetterValuesTable values={model.metadata.letterValues} highlight={lettersUsedIn(result)} />
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
