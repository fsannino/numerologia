import type { CalculationTrace } from '@numerus/numerology-domain'
import { localize } from '@numerus/shared-kernel'
import { useLocale } from '@/i18n/locale-context'
import { UI_MESSAGES } from '@/i18n/ui-messages'
import { ReductionChain } from './reduction-chain'
import { TraceSteps } from './trace-steps'

/** Para números de grade, os dígitos destacados aparecem no próprio card. */
function highlightedDigitsOf(trace: CalculationTrace): ReadonlyArray<number> | null {
  if (trace.resultId !== 'karmic-lessons' && trace.resultId !== 'hidden-tendencies') {
    return null
  }
  const grid = trace.steps.find((step) => step.kind === 'grid-analysis')
  return grid?.kind === 'grid-analysis' ? grid.output.highlighted : null
}

/** Um número do mapa, com valor, flags e o traço completo expansível. */
export function NumberResultCard({ trace }: { trace: CalculationTrace }) {
  const { locale } = useLocale()
  const t = UI_MESSAGES[locale]
  const label = t.numberLabels[trace.resultId] ?? { title: trace.resultId, hint: '' }
  const highlightedDigits = highlightedDigitsOf(trace)
  return (
    <article className="rounded-xl border border-indigo-200 bg-white shadow-sm" aria-label={label.title}>
      <div className="flex items-center gap-4 p-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-2xl font-bold text-white">
          {trace.finalValue.reduced}
        </div>
        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="font-semibold text-indigo-950">{label.title}</h3>
          <p className="text-xs text-slate-500">{label.hint}</p>
          <div className="flex flex-wrap gap-1.5 text-xs">
            {highlightedDigits !== null && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 font-medium text-amber-900">
                {highlightedDigits.length > 0
                  ? t.results.digitsBadge(highlightedDigits.join(', '))
                  : t.results.noDigits}
              </span>
            )}
            {trace.finalValue.isMaster && (
              <span className="rounded-full bg-violet-200 px-2 py-0.5 font-medium text-violet-900">
                {t.results.masterShort}
              </span>
            )}
            {trace.finalValue.karmicDebt !== undefined && (
              <span className="rounded-full bg-rose-200 px-2 py-0.5 font-medium text-rose-900">
                {t.results.debtBadge(trace.finalValue.karmicDebt)}
              </span>
            )}
          </div>
        </div>
        <div className="ml-auto hidden sm:block">
          <ReductionChain value={trace.finalValue} />
        </div>
      </div>

      {trace.divergenceNotes.length > 0 && (
        <div className="mx-4 mb-3 rounded-lg border border-amber-300 bg-amber-50 p-3" role="note">
          <p className="mb-1 text-xs font-semibold text-amber-900">{t.results.divergenceTitle}</p>
          {trace.divergenceNotes.map((note) => (
            <p key={note.id} className="text-xs leading-relaxed text-amber-950">
              {localize(note.note, locale)}
            </p>
          ))}
        </div>
      )}

      <details className="border-t border-slate-100">
        <summary className="cursor-pointer px-4 py-2.5 text-sm font-medium text-indigo-700">
          {t.results.seeSteps}
        </summary>
        <div className="flex flex-col gap-4 px-4 pb-4">
          <TraceSteps steps={trace.steps} />
          <div>
            <h4 className="mb-2 text-sm font-semibold">{t.results.rulesTitle}</h4>
            <ul className="flex flex-col gap-2">
              {trace.ruleRefs.map((rule) => (
                <li key={rule.id} className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs leading-relaxed">{localize(rule.rule, locale)}</p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    {t.results.sourcePrefix} {localize(rule.source, locale)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </details>
    </article>
  )
}
