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
      <p className="text-[15px] leading-relaxed text-anil">{t.signature.intro}</p>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 border border-anil bg-giz p-6"
        aria-label={t.signature.compare}
      >
        <div className="flex flex-col gap-1">
          <label htmlFor={registrationId} className="font-mono text-[10px] uppercase tracking-[0.14em] text-anil">
            {t.signature.registrationLabel}
          </label>
          <input
            id={registrationId}
            type="text"
            value={registrationName}
            onChange={(event) => setRegistrationName(event.target.value)}
            placeholder={t.form.namePlaceholder}
            autoComplete="off"
            className="border border-anil bg-papel px-3 py-2 font-mono text-sm text-tinta focus:outline-none focus:border-latao"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor={signatureId} className="font-mono text-[10px] uppercase tracking-[0.14em] text-anil">
            {t.signature.signatureLabel}
          </label>
          <input
            id={signatureId}
            type="text"
            value={signatureName}
            onChange={(event) => setSignatureName(event.target.value)}
            placeholder={t.form.namePlaceholder}
            autoComplete="off"
            className="border border-anil bg-papel px-3 py-2 font-mono text-sm text-tinta focus:outline-none focus:border-latao"
          />
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className="font-mono text-[10px] uppercase tracking-[0.14em] text-anil">{t.form.schoolsLabel}</legend>
          <div className="flex flex-wrap gap-3">
            {listModels().map((model) => (
              <label key={model.id} className="flex cursor-pointer items-center gap-2 border border-anil bg-papel px-3 py-1.5 text-sm text-tinta has-[:checked]:bg-latao has-[:checked]:text-papel">
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

        <button
          type="submit"
          className="w-fit bg-latao px-6 py-2.5 font-mono text-[12px] uppercase tracking-[0.14em] text-papel transition hover:opacity-90"
        >
          {t.signature.compare}
        </button>

        {error !== null && (
          <p role="alert" className="border-l-2 border-tinta bg-papel px-4 py-3 text-[15px] font-medium text-tinta">
            {error}
          </p>
        )}
      </form>

      {comparison !== null && (
        <div className="flex flex-col gap-5" aria-label={t.modes.signature}>
          <p
            className={` px-4 py-3 text-sm font-medium ${
              comparison.changedCount > 0 ? 'border-l-2 border-latao bg-papel text-tinta' : 'border-l-2 border-anil bg-papel text-tinta'
            }`}
          >
            {comparison.changedCount > 0 ? t.signature.changedSummary(comparison.changedCount) : t.signature.noChange}
          </p>

          {comparison.results.map((result) => {
            const model = listModels().find((entry) => entry.id === result.model)
            return (
              <section key={result.model} className="flex flex-col gap-2" aria-label={model ? localize(model.metadata.name, locale) : result.model}>
                {comparison.results.length > 1 && (
                  <h3 className="font-display text-2xl text-tinta">
                    {model ? localize(model.metadata.name, locale) : result.model}
                  </h3>
                )}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr>
                        <th scope="col" className="border border-anil bg-papel px-3 py-2 text-left font-mono text-[10px] uppercase tracking-[0.1em] text-anil">
                          {t.matrix.numberColumn}
                        </th>
                        <th scope="col" className="border border-anil bg-papel px-3 py-2 font-mono text-[10px] uppercase tracking-[0.1em] text-anil">
                          {t.signature.registrationColumn}
                        </th>
                        <th scope="col" className="border border-anil bg-papel px-3 py-2 font-mono text-[10px] uppercase tracking-[0.1em] text-anil">
                          {t.signature.signatureColumn}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.numbers.map((delta) => (
                        <tr key={delta.numberKind} className={delta.changed ? 'bg-papel' : undefined}>
                          <th scope="row" className="border border-anil px-3 py-2 text-left font-medium">
                            {t.numberLabels[delta.numberKind]?.title ?? delta.numberKind}
                            {delta.changed && (
                              <span className="ml-2 border border-latao px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-latao">
                                {t.signature.changedTag}
                              </span>
                            )}
                          </th>
                          <td className="border border-anil px-3 py-2 text-center font-bold">
                            {delta.registration.finalValue.reduced}
                          </td>
                          <td className={`border border-anil px-3 py-2 text-center font-bold ${delta.changed ? 'text-latao' : ''}`}>
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
