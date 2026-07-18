'use client'

import { useId, useState } from 'react'
import type { FormEvent } from 'react'
import type { Chart, CalculateChartError } from '@numerus/numerology-application'
import { calculateChart } from '@numerus/numerology-application'
import type { NumberKind } from '@numerus/numerology-domain'
import { pythagoreanModel } from '@numerus/numerology-domain'
import { localize } from '@numerus/shared-kernel'
import { NumberResultCard } from './number-result-card'
import { PythagoreanTable } from './pythagorean-table'

const LOCALE = 'pt-BR'
const NAME_NUMBERS: ReadonlyArray<NumberKind> = [
  'expression',
  'motivation',
  'impression',
  'key-number',
  'karmic-lessons',
  'hidden-tendencies',
  'subconscious',
]
const DATE_NUMBERS: ReadonlyArray<NumberKind> = ['life-path', 'psychic', 'mission']

function errorMessage(error: CalculateChartError): string {
  switch (error.code) {
    case 'invalid-name':
      if (error.cause.code === 'empty-name') {
        return 'Digite o nome completo de nascimento.'
      }
      return `O nome contém caracteres que a tabela pitagórica não converte: ${[
        ...new Set(error.cause.characters.map((item) => `"${item.character}"`)),
      ].join(', ')}. Nada foi descartado em silêncio — ajuste o nome ou aguarde o suporte a outros alfabetos.`
    case 'invalid-birth-date':
      return 'A data de nascimento é inválida — confira dia, mês e ano.'
    case 'missing-birth-date':
      return 'Informe a data de nascimento para calcular Destino, Psíquico e Missão.'
    case 'unknown-model':
      return `Escola ainda não disponível: ${error.model}.`
    case 'unsupported-number':
      return `O modelo ${error.model} ainda não calcula "${error.number}".`
    case 'unsupported-subject':
      return `O modelo ${error.model} não aceita o sujeito "${error.subject}".`
    case 'unknown-variant':
      return `Variante desconhecida "${error.option}" para ${error.dimension}.`
  }
}

export function ChartCalculator() {
  const nameInputId = useId()
  const dateInputId = useId()
  const [fullName, setFullName] = useState('')
  const [birthDate, setBirthDate] = useState('')
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
    })
    if (!result.ok) {
      setChart(null)
      setError(errorMessage(result.error))
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
        aria-label="Calcular mapa numerológico"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor={nameInputId} className="font-medium">
            Nome completo de nascimento
          </label>
          <input
            id={nameInputId}
            type="text"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Ex.: Maria da Silva"
            autoComplete="off"
            className="rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor={dateInputId} className="font-medium">
            Data de nascimento <span className="font-normal text-slate-500">(opcional)</span>
          </label>
          <input
            id={dateInputId}
            type="date"
            value={birthDate}
            onChange={(event) => setBirthDate(event.target.value)}
            className="w-fit rounded-lg border border-slate-300 bg-white px-3 py-2"
          />
          <p className="text-xs text-slate-500">
            Necessária apenas para Destino, Psíquico e Missão. Como todo o resto, nunca sai do seu
            dispositivo.
          </p>
        </div>

        <details className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <summary className="cursor-pointer text-sm font-medium">
            Métodos de cálculo (variantes das escolas)
          </summary>
          <div className="mt-3 flex flex-col gap-3">
            {pythagoreanModel.metadata.variantDimensions.map((dimension) => {
              const selectId = `variant-${dimension.dimension}`
              return (
                <div key={dimension.dimension} className="flex flex-col gap-1">
                  <label htmlFor={selectId} className="text-sm font-medium">
                    {localize(dimension.label, LOCALE)}
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
                        {localize(option.label, LOCALE)}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500">
                    {localize(
                      dimension.options.find(
                        (option) =>
                          option.id === (variantSelections[dimension.dimension] ?? dimension.defaultOption),
                      )?.description ?? { 'pt-BR': '' },
                      LOCALE,
                    )}
                  </p>
                </div>
              )
            })}
            <p className="text-xs text-slate-500">
              Escolas divergem nos métodos — por isso a escolha é sua, e cada resultado registra a
              variante usada.
            </p>
          </div>
        </details>

        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          Calcular mapa
        </button>

        {error !== null && (
          <p role="alert" className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-900">
            {error}
          </p>
        )}
      </form>

      {traces.length > 0 && (
        <div className="flex flex-col gap-6" aria-label="Resultado do mapa">
          <section className="flex flex-col gap-3" aria-label="Números calculados">
            <h2 className="text-xl font-semibold text-indigo-950">
              Seu mapa pitagórico{' '}
              <span className="text-sm font-normal text-slate-500">
                · engine v{traces[0]?.engineVersion}
              </span>
            </h2>
            <div className="grid gap-3">
              {traces.map((trace) => (
                <NumberResultCard key={trace.resultId} trace={trace} />
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-3" aria-label="Tabela de conversão">
            <h3 className="text-lg font-semibold">Tabela de conversão usada</h3>
            <p className="text-sm text-slate-600">As letras do nome estão destacadas na tabela.</p>
            <PythagoreanTable highlight={highlightedLetters} />
          </section>
        </div>
      )}
    </section>
  )
}
