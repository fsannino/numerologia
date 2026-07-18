import type { CalculationStep } from '@numerus/numerology-domain'
import { localize } from '@numerus/shared-kernel'
import { ReductionChain } from './reduction-chain'

const LOCALE = 'pt-BR'

function StepBody({ step }: { step: CalculationStep }) {
  switch (step.kind) {
    case 'filter':
      return (
        <p className="font-mono text-sm">
          &quot;{step.input.source}&quot; <span className="text-slate-400">→</span>{' '}
          {step.output.kept.length > 0 ? step.output.kept.join(' · ') : <em>nenhuma letra</em>}
        </p>
      )
    case 'letter-mapping':
      return (
        <ul className="flex flex-wrap gap-1.5" aria-label={`Valores das letras de ${step.input.word}`}>
          {step.output.entries.map((entry, index) => (
            <li
              key={`${entry.letter}-${index}`}
              className="flex flex-col items-center rounded border border-indigo-200 bg-white px-2 py-1"
            >
              <span className="font-bold">{entry.letter}</span>
              <span className="text-sm text-indigo-700">{entry.value}</span>
            </li>
          ))}
        </ul>
      )
    case 'sum':
      return (
        <p className="font-mono text-sm">
          {step.input.parcels.join(' + ')} = <strong className="text-base">{step.output.total}</strong>
        </p>
      )
    case 'reduction':
      return <ReductionChain value={step.output.value} />
    case 'timeline':
      return (
        <ol className="flex flex-col gap-1.5" aria-label="Linha do tempo dos períodos">
          {step.output.segments.map((segment, index) => (
            <li
              key={index}
              className={`flex items-center gap-3 rounded-lg border px-3 py-2 ${
                segment.isCurrent ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 bg-white'
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-bold ${
                  segment.isCurrent ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {segment.value.reduced}
              </span>
              <div className="flex min-w-0 flex-col">
                <span className="text-sm font-medium">{localize(segment.label, LOCALE)}</span>
                <span className="text-xs text-slate-500">
                  {segment.toAge !== undefined
                    ? `dos ${segment.fromAge} aos ${segment.toAge} anos`
                    : `dos ${segment.fromAge} anos em diante`}
                  {segment.isCurrent ? ' · vigente' : ''}
                  {segment.value.isMaster ? ' · ✦ mestre' : ''}
                  {segment.value.karmicDebt !== undefined ? ` · dívida ${segment.value.karmicDebt}` : ''}
                </span>
              </div>
            </li>
          ))}
        </ol>
      )
    case 'grid-analysis':
      return (
        <ul className="grid grid-cols-3 gap-1.5 sm:grid-cols-9" aria-label="Grade de dígitos do nome">
          {step.output.tally.map((entry) => {
            const highlighted = step.output.highlighted.includes(entry.digit)
            return (
              <li
                key={entry.digit}
                className={`flex flex-col items-center rounded border px-2 py-1 ${
                  highlighted ? 'border-amber-400 bg-amber-100 font-semibold' : 'border-slate-200 bg-white text-slate-500'
                }`}
              >
                <span className="text-base">{entry.digit}</span>
                <span className="text-xs">{entry.count}×</span>
              </li>
            )
          })}
        </ul>
      )
    case 'master-check':
      return (
        <p className="text-sm">
          {step.output.isMaster ? (
            <span className="rounded bg-violet-100 px-2 py-0.5 font-semibold text-violet-900">
              {step.input.candidate} é número mestre ✦
            </span>
          ) : (
            <span className="text-slate-600">{step.input.candidate} não é número mestre.</span>
          )}
        </p>
      )
    case 'karmic-check':
      return (
        <p className="text-sm">
          {step.output.debtsFound.length > 0 ? (
            <span className="rounded bg-rose-100 px-2 py-0.5 font-semibold text-rose-900">
              Dívida cármica encontrada: {step.output.debtsFound.join(', ')}
            </span>
          ) : (
            <span className="text-slate-600">Nenhuma dívida cármica (13, 14, 16, 19) nos totais brutos.</span>
          )}
        </p>
      )
  }
}

/** Passo a passo educacional: cada etapa abre e mostra o que entrou e o que saiu. */
export function TraceSteps({ steps }: { steps: ReadonlyArray<CalculationStep> }) {
  return (
    <ol className="flex flex-col gap-2">
      {steps.map((step, index) => (
        <li key={index}>
          <details className="group rounded-lg border border-slate-200 bg-slate-50 open:bg-white" open={index === 0}>
            <summary className="flex cursor-pointer items-center gap-3 px-4 py-2.5">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                {index + 1}
              </span>
              <span className="font-medium">{localize(step.title, LOCALE)}</span>
            </summary>
            <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3">
              <p className="text-sm text-slate-600">{localize(step.explanation, LOCALE)}</p>
              <StepBody step={step} />
            </div>
          </details>
        </li>
      ))}
    </ol>
  )
}
