'use client'

import { useId, useState } from 'react'
import type { FormEvent } from 'react'
import type { SignatureComparison, CompareSignaturesError } from '@numerus/numerology-application'
import { compareSignatures } from '@numerus/numerology-application'
import type { ModelId } from '@numerus/numerology-domain'
import { listModels } from '@numerus/numerology-domain'
import { localize } from '@numerus/shared-kernel'
import { useLocale } from '@/i18n/locale-context'
import type { UiMessages } from '@/i18n/ui-messages'
import { UI_MESSAGES } from '@/i18n/ui-messages'

function errorMessage(error: CompareSignaturesError, t: UiMessages): string {
  const cause = error.cause
  if (cause.code === 'invalid-name') {
    if (cause.cause.code === 'empty-name') return t.errors.emptyName
    return t.errors.unsupportedCharacters(
      [...new Set(cause.cause.characters.map((item) => `"${item.character}"`))].join(', '),
    )
  }
  if (cause.code === 'unknown-model') return t.errors.unknownModel(cause.model)
  return t.errors.emptyName
}

export function SignatureComparator() {
  const { locale } = useLocale()
  const t = UI_MESSAGES[locale]
  const registrationId = useId()
  const signatureId = useId()
  const [registrationName, setRegistrationName] = useState('')
  const [signatureName, setSignatureName] = useState('')
  const [selectedModels, setSelectedModels] = useState<ReadonlyArray<ModelId>>(['pythagorean'])
  const [comparison, setComparison] = useState<SignatureComparison | null>(null)
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
    const result = compareSignatures({ registrationName, signatureName, models: selectedModels })
    if (!result.ok) {
      setComparison(null)
      setError(errorMessage(result.error, t))
      return
    }
    setError(null)
    setComparison(result.value)
  }

  return (
    <section className="flex flex-col gap-6">
      <p className="text-sm text-slate-600">{t.signature.intro}</p>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        aria-label={t.signature.compare}
      >
        <div className="flex flex-col gap-1">
          <label htmlFor={registrationId} className="font-medium">
            {t.signature.registrationLabel}
          </label>
          <input
            id={registrationId}
            type="text"
            value={registrationName}
            onChange={(event) => setRegistrationName(event.target.value)}
            placeholder={t.form.namePlaceholder}
            autoComplete="off"
            className="rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor={signatureId} className="font-medium">
            {t.signature.signatureLabel}
          </label>
          <input
            id={signatureId}
            type="text"
            value={signatureName}
            onChange={(event) => setSignatureName(event.target.value)}
            placeholder={t.form.namePlaceholder}
            autoComplete="off"
            className="rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className="font-medium">{t.form.schoolsLabel}</legend>
          <div className="flex flex-wrap gap-3">
            {listModels().map((model) => (
              <label key={model.id} className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50">
                <input
                  type="checkbox"
                  checked={selectedModels.includes(model.id)}
                  onChange={() => toggleModel(model.id)}
                  className="accent-indigo-600"
                />
                {localize(model.metadata.name, locale)}
              </label>
            ))}
          </div>
        </fieldset>

        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          {t.signature.compare}
        </button>

        {error !== null && (
          <p role="alert" className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-900">
            {error}
          </p>
        )}
      </form>

      {comparison !== null && (
        <div className="flex flex-col gap-5" aria-label={t.modes.signature}>
          <p
            className={`rounded-lg px-4 py-3 text-sm font-medium ${
              comparison.changedCount > 0 ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
            }`}
          >
            {comparison.changedCount > 0 ? t.signature.changedSummary(comparison.changedCount) : t.signature.noChange}
          </p>

          {comparison.results.map((result) => {
            const model = listModels().find((entry) => entry.id === result.model)
            return (
              <section key={result.model} className="flex flex-col gap-2" aria-label={model ? localize(model.metadata.name, locale) : result.model}>
                {comparison.results.length > 1 && (
                  <h3 className="text-lg font-semibold text-indigo-900">
                    {model ? localize(model.metadata.name, locale) : result.model}
                  </h3>
                )}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr>
                        <th scope="col" className="border border-slate-300 bg-indigo-50 px-3 py-2 text-left font-semibold text-indigo-900">
                          {t.matrix.numberColumn}
                        </th>
                        <th scope="col" className="border border-slate-300 bg-indigo-50 px-3 py-2 font-semibold text-indigo-900">
                          {t.signature.registrationColumn}
                        </th>
                        <th scope="col" className="border border-slate-300 bg-indigo-50 px-3 py-2 font-semibold text-indigo-900">
                          {t.signature.signatureColumn}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.numbers.map((delta) => (
                        <tr key={delta.numberKind} className={delta.changed ? 'bg-amber-50' : undefined}>
                          <th scope="row" className="border border-slate-300 px-3 py-2 text-left font-medium">
                            {t.numberLabels[delta.numberKind]?.title ?? delta.numberKind}
                            {delta.changed && (
                              <span className="ml-2 rounded bg-amber-200 px-1.5 py-0.5 text-[11px] text-amber-900">
                                {t.signature.changedTag}
                              </span>
                            )}
                          </th>
                          <td className="border border-slate-300 px-3 py-2 text-center font-bold">
                            {delta.registration.finalValue.reduced}
                          </td>
                          <td className={`border border-slate-300 px-3 py-2 text-center font-bold ${delta.changed ? 'text-amber-900' : ''}`}>
                            {delta.signature.finalValue.reduced}
                            {delta.changed && <span aria-hidden> ↔</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )
          })}
        </div>
      )}
    </section>
  )
}
