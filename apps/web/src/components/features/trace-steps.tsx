import type { CalculationStep } from '@numerus/numerology-domain'
import { LO_SHU_SQUARE } from '@numerus/numerology-domain'
import { localize } from '@numerus/shared-kernel'
import { useLocale } from '@/i18n/locale-context'
import { UI_MESSAGES } from '@/i18n/ui-messages'
import { ReductionChain } from './reduction-chain'
import { ReadingMatrix } from './reading-matrix'

function StepBody({ step }: { step: CalculationStep }) {
  const { locale } = useLocale()
  const t = UI_MESSAGES[locale]
  switch (step.kind) {
    case 'filter':
      return (
        <p className="font-mono text-sm">
          &quot;{step.input.source}&quot; <span className="text-slate-400">→</span>{' '}
          {step.output.kept.length > 0 ? step.output.kept.join(' · ') : <em>{t.results.noLetters}</em>}
        </p>
      )
    case 'letter-mapping':
      return (
        <ul className="flex flex-wrap gap-1.5" aria-label={localize(step.title, locale)}>
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
        <ol className="flex flex-col gap-1.5" aria-label={localize(step.title, locale)}>
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
                <span className="text-sm font-medium">{localize(segment.label, locale)}</span>
                <span className="text-xs text-slate-500">
                  {segment.toAge !== undefined
                    ? t.timeline.range(segment.fromAge, segment.toAge)
                    : t.timeline.rangeOpen(segment.fromAge)}
                  {segment.isCurrent ? ` · ${t.timeline.current}` : ''}
                  {segment.value.isMaster ? ` · ${t.results.masterShort}` : ''}
                  {segment.value.karmicDebt !== undefined ? ` · ${t.results.debtBadge(segment.value.karmicDebt)}` : ''}
                </span>
              </div>
            </li>
          ))}
        </ol>
      )
    case 'transliteration':
      return (
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded bg-indigo-100 px-2 py-0.5 font-medium text-indigo-900">
              {step.output.standardTotal} · {t.gematria.standardLabel}
            </span>
            <span dir="rtl" className="font-serif text-lg">{step.output.standardHebrew}</span>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-slate-600">
            <span>{t.gematria.spectrumLabel(step.output.minTotal, step.output.maxTotal)}</span>
            <span>· {t.gematria.combinationsLabel(step.output.combinationCount)}</span>
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold text-slate-700">{t.gematria.candidatesTitle}</p>
            <ul className="flex flex-wrap gap-2">
              {step.output.letters.map((letter, index) => (
                <li
                  key={index}
                  className={`rounded border px-2 py-1 text-xs ${
                    letter.options.length > 1 ? 'border-amber-300 bg-amber-50' : 'border-slate-200 bg-white'
                  }`}
                >
                  <span className="font-bold">{letter.latin}</span>
                  {letter.options.length > 1 && (
                    <span className="ml-1 text-[10px] text-amber-700">({t.gematria.ambiguous})</span>
                  )}
                  <span className="mt-0.5 flex flex-col">
                    {letter.options.map((option, optionIndex) => (
                      <span key={optionIndex}>
                        <span dir="rtl" className="font-serif">{option.hebrew}</span>{' '}
                        <span className="text-slate-500">{option.name} = {option.value}</span>
                      </span>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )
    case 'lo-shu-grid': {
      const countOf = (digit: number) =>
        step.output.tally.find((entry) => entry.digit === digit)?.count ?? 0
      return (
        <div className="flex flex-col gap-3">
          <table className="w-fit border-collapse" aria-label={localize(step.title, locale)}>
            <tbody>
              {LO_SHU_SQUARE.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((digit) => {
                    const count = countOf(digit)
                    return (
                      <td
                        key={digit}
                        className={`h-14 w-14 border border-slate-300 text-center align-middle ${
                          count > 0 ? 'bg-indigo-50 font-semibold text-indigo-900' : 'bg-slate-50 text-slate-300'
                        }`}
                      >
                        {count > 0 ? (
                          <span aria-label={`${digit}: ${count}`}>{String(digit).repeat(count)}</span>
                        ) : (
                          <span className="sr-only">{`${digit} ${t.loShu.emptyCell}`}</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <p className="mb-1 text-xs font-semibold text-slate-700">{t.loShu.arrowsTitle}</p>
            {step.output.arrows.length === 0 ? (
              <p className="text-xs text-slate-500">{t.loShu.noArrows}</p>
            ) : (
              <ul className="flex flex-col gap-1">
                {step.output.arrows.map((arrow, index) => (
                  <li key={index} className="text-xs">
                    <span
                      className={`rounded px-1.5 py-0.5 font-medium ${
                        arrow.kind === 'strength' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {arrow.line.join('-')} · {localize(arrow.label, locale)} ·{' '}
                      {arrow.kind === 'strength' ? t.loShu.strengthArrow : t.loShu.absenceArrow}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )
    }
    case 'grid-analysis':
      return (
        <ul className="grid grid-cols-3 gap-1.5 sm:grid-cols-9" aria-label={localize(step.title, locale)}>
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
    case 'reading-matrix':
      return <ReadingMatrix readings={step.output.readings} />
    case 'planetary-ruler':
      return (
        <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
          <span className="text-3xl leading-none" aria-hidden="true">
            {step.output.symbol}
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-amber-900">
              {localize(step.output.planet, locale)} · {step.output.sanskrit}
            </span>
            <span className="text-xs text-amber-800">
              {t.vedic.qualitiesLabel}: {localize(step.output.qualities, locale)}
            </span>
          </div>
        </div>
      )
    case 'master-check':
      // A frase completa já vem localizada em step.explanation; aqui só o destaque.
      return step.output.isMaster ? (
        <p className="text-sm">
          <span className="rounded bg-violet-100 px-2 py-0.5 font-semibold text-violet-900">
            {t.results.masterShort} {step.input.candidate}
          </span>
        </p>
      ) : null
    case 'karmic-check':
      return step.output.debtsFound.length > 0 ? (
        <p className="flex flex-wrap gap-1.5 text-sm">
          {step.output.debtsFound.map((debt, index) => (
            <span key={index} className="rounded bg-rose-100 px-2 py-0.5 font-semibold text-rose-900">
              {t.results.debtBadge(debt)}
            </span>
          ))}
        </p>
      ) : null
  }
}

/** Passo a passo educacional: cada etapa abre e mostra o que entrou e o que saiu. */
export function TraceSteps({ steps }: { steps: ReadonlyArray<CalculationStep> }) {
  const { locale } = useLocale()
  return (
    <ol className="flex flex-col gap-2">
      {steps.map((step, index) => (
        <li key={index}>
          <details className="group rounded-lg border border-slate-200 bg-slate-50 open:bg-white" open={index === 0}>
            <summary className="flex cursor-pointer items-center gap-3 px-4 py-2.5">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                {index + 1}
              </span>
              <span className="font-medium">{localize(step.title, locale)}</span>
            </summary>
            <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3">
              <p className="text-sm text-slate-600">{localize(step.explanation, locale)}</p>
              <StepBody step={step} />
            </div>
          </details>
        </li>
      ))}
    </ol>
  )
}
