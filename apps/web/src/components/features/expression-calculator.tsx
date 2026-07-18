'use client'

import { useId, useState } from 'react'
import type { FormEvent } from 'react'
import type { CalculationTrace, ExpressionVariant } from '@numerus/numerology-domain'
import { EXPRESSION_REDUCTION_DIMENSION, pythagoreanModel } from '@numerus/numerology-domain'
import type { CalculateChartError } from '@numerus/numerology-application'
import { calculateChart } from '@numerus/numerology-application'
import { localize } from '@numerus/shared-kernel'
import { PythagoreanTable } from './pythagorean-table'
import { ReductionChain } from './reduction-chain'
import { TraceSteps } from './trace-steps'

const LOCALE = 'pt-BR'

function errorMessage(error: CalculateChartError): string {
  switch (error.code) {
    case 'invalid-name':
      if (error.cause.code === 'empty-name') {
        return 'Digite o nome completo de nascimento.'
      }
      return `O nome contém caracteres que a tabela pitagórica não converte: ${[
        ...new Set(error.cause.characters.map((item) => `"${item.character}"`)),
      ].join(', ')}. Nada foi descartado em silêncio — ajuste o nome ou aguarde o suporte a outros alfabetos.`
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

export function ExpressionCalculator() {
  const nameInputId = useId()
  const variantSelectId = useId()
  const [fullName, setFullName] = useState('')
  const [variant, setVariant] = useState<ExpressionVariant>('reduce-words-then-sum')
  const [trace, setTrace] = useState<CalculationTrace | null>(null)
  const [error, setError] = useState<string | null>(null)

  const variantDimension = pythagoreanModel.metadata.variantDimensions[0]

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = calculateChart({
      subject: { kind: 'person', fullName },
      models: ['pythagorean'],
      numbers: ['expression'],
      variantSelections: { [EXPRESSION_REDUCTION_DIMENSION]: variant },
    })
    if (!result.ok) {
      setTrace(null)
      setError(errorMessage(result.error))
      return
    }
    setError(null)
    setTrace(result.value.results[0]?.traces[0] ?? null)
  }

  const highlightedLetters = new Set(
    trace?.steps.flatMap((step) =>
      step.kind === 'letter-mapping' ? step.output.entries.map((entry) => entry.letter) : [],
    ) ?? [],
  )

  return (
    <section className="flex flex-col gap-6">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        aria-label="Calcular número de Expressão"
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
          <label htmlFor={variantSelectId} className="font-medium">
            {variantDimension ? localize(variantDimension.label, LOCALE) : 'Método'}
          </label>
          <select
            id={variantSelectId}
            value={variant}
            onChange={(event) => setVariant(event.target.value as ExpressionVariant)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2"
          >
            {variantDimension?.options.map((option) => (
              <option key={option.id} value={option.id}>
                {localize(option.label, LOCALE)}
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-500">
            Escolas divergem no momento da redução — por isso o método é uma escolha sua, e o
            resultado registra qual foi usado.
          </p>
        </div>

        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          Calcular Expressão
        </button>

        {error !== null && (
          <p role="alert" className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-900">
            {error}
          </p>
        )}
      </form>

      {trace !== null && (
        <article className="flex flex-col gap-6" aria-label="Resultado do cálculo">
          <div className="flex items-center gap-5 rounded-xl border border-indigo-200 bg-indigo-50 p-6">
            <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-2xl bg-indigo-600 text-white">
              <span className="text-3xl font-bold">{trace.finalValue.reduced}</span>
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-semibold text-indigo-950">Número de Expressão</h2>
              <div className="flex flex-wrap gap-2 text-sm">
                {trace.finalValue.isMaster && (
                  <span className="rounded-full bg-violet-200 px-3 py-0.5 font-medium text-violet-900">
                    ✦ Número mestre — não reduz
                  </span>
                )}
                {trace.finalValue.karmicDebt !== undefined && (
                  <span className="rounded-full bg-rose-200 px-3 py-0.5 font-medium text-rose-900">
                    Dívida cármica {trace.finalValue.karmicDebt}
                  </span>
                )}
                <span className="rounded-full bg-slate-200 px-3 py-0.5 text-slate-700">
                  Escola pitagórica · engine v{trace.engineVersion}
                </span>
              </div>
              <ReductionChain value={trace.finalValue} />
            </div>
          </div>

          {trace.divergenceNotes.length > 0 && (
            <aside className="rounded-xl border border-amber-300 bg-amber-50 p-4" aria-label="Divergência entre métodos">
              <h3 className="mb-1 font-semibold text-amber-900">⚖ Os métodos divergem para este nome</h3>
              {trace.divergenceNotes.map((note) => (
                <p key={note.id} className="text-sm leading-relaxed text-amber-950">
                  {localize(note.note, LOCALE)}
                </p>
              ))}
            </aside>
          )}

          <section className="flex flex-col gap-3" aria-label="Tabela de conversão">
            <h3 className="text-lg font-semibold">Tabela de conversão usada</h3>
            <p className="text-sm text-slate-600">As letras do nome estão destacadas na tabela.</p>
            <PythagoreanTable highlight={highlightedLetters} />
          </section>

          <section className="flex flex-col gap-3" aria-label="Passo a passo do cálculo">
            <h3 className="text-lg font-semibold">Como chegamos a este número</h3>
            <TraceSteps steps={trace.steps} />
          </section>

          <section className="flex flex-col gap-2" aria-label="Regras da escola">
            <h3 className="text-lg font-semibold">Por quê? As regras aplicadas</h3>
            <ul className="flex flex-col gap-2">
              {trace.ruleRefs.map((rule) => (
                <li key={rule.id} className="rounded-lg border border-slate-200 bg-white p-4">
                  <p className="text-sm leading-relaxed">{localize(rule.rule, LOCALE)}</p>
                  <p className="mt-1 text-xs text-slate-500">Fonte: {localize(rule.source, LOCALE)}</p>
                </li>
              ))}
            </ul>
          </section>
        </article>
      )}
    </section>
  )
}
