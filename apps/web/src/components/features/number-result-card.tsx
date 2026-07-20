import type { CalculationTrace } from '@numerus/numerology-domain'
import { curatedInterpretationProvider } from '@numerus/numerology-domain'
import { localize } from '@numerus/shared-kernel'
import { useLocale } from '@/i18n/locale-context'
import { UI_MESSAGES } from '@/i18n/ui-messages'
import { ReductionChain } from './reduction-chain'
import { ReadingMatrix } from './reading-matrix'
import { TraceSteps } from './trace-steps'

/** Para números de grade, os dígitos destacados aparecem no próprio card. */
function highlightedDigitsOf(trace: CalculationTrace): ReadonlyArray<number> | null {
  if (trace.resultId !== 'karmic-lessons' && trace.resultId !== 'hidden-tendencies') {
    return null
  }
  const grid = trace.steps.find((step) => step.kind === 'grid-analysis')
  return grid?.kind === 'grid-analysis' ? grid.output.highlighted : null
}

const CHIP = 'border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em]'

/** Um número do mapa, com valor, flags e a conta completa expansível. */
export function NumberResultCard({ trace }: { trace: CalculationTrace }) {
  const { locale } = useLocale()
  const t = UI_MESSAGES[locale]
  const label = t.numberLabels[trace.resultId] ?? { title: trace.resultId, hint: '' }
  const highlightedDigits = highlightedDigitsOf(trace)
  const interpretation = curatedInterpretationProvider.interpret({
    model: trace.model,
    resultId: trace.resultId,
    value: trace.finalValue,
  })
  const matrixStep = trace.steps.find((step) => step.kind === 'reading-matrix')
  const stepsForTrace = trace.steps.filter((step) => step.kind !== 'reading-matrix')
  return (
    <article className="border border-anil bg-giz" aria-label={label.title}>
      <div className="flex items-center gap-4 p-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center border border-anil bg-papel font-display text-5xl leading-none text-latao tabular-nums">
          {trace.finalValue.reduced}
        </div>
        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="font-display text-2xl leading-tight text-tinta">{label.title}</h3>
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-anil">{label.hint}</p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {trace.model === 'chaldean' && trace.finalValue.raw !== trace.finalValue.reduced && (
              <span className={`${CHIP} border-anil text-anil`}>{t.results.compoundBadge(trace.finalValue.raw)}</span>
            )}
            {highlightedDigits !== null && (
              <span className={`${CHIP} border-anil text-anil`}>
                {highlightedDigits.length > 0 ? t.results.digitsBadge(highlightedDigits.join(', ')) : t.results.noDigits}
              </span>
            )}
            {trace.finalValue.isMaster && (
              <span className={`${CHIP} border-latao text-latao`}>{t.results.masterShort}</span>
            )}
            {trace.finalValue.karmicDebt !== undefined && (
              <span className={`${CHIP} border-tinta text-tinta`}>{t.results.debtBadge(trace.finalValue.karmicDebt)}</span>
            )}
          </div>
        </div>
        <div className="ml-auto hidden sm:block">
          <ReductionChain value={trace.finalValue} />
        </div>
      </div>

      {matrixStep?.kind === 'reading-matrix' && (
        <div className="mx-4 mb-4 flex flex-col gap-2 border-t border-anil pt-3">
          <p className="font-display text-lg leading-snug text-tinta">
            {t.kabbalistic.headline(matrixStep.output.distinctValues)}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-anil">{t.kabbalistic.subtitle}</p>
          <ReadingMatrix readings={matrixStep.output.readings} />
        </div>
      )}

      {interpretation !== null && (
        <div className="mx-4 mb-4 border-l-2 border-latao bg-papel px-3 py-2.5">
          <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.12em] text-latao">
            {t.results.interpretationLabel}
          </p>
          <p className="text-[15px] leading-relaxed text-tinta">{localize(interpretation.text, locale)}</p>
        </div>
      )}

      {trace.divergenceNotes.length > 0 && (
        <div className="mx-4 mb-4 border-l-2 border-vermelhao bg-papel px-3 py-2.5" role="note">
          <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.12em] text-vermelhao">
            {t.results.divergenceTitle}
          </p>
          {trace.divergenceNotes.map((note) => (
            <p key={note.id} className="text-[13.5px] leading-relaxed text-tinta">
              {localize(note.note, locale)}
            </p>
          ))}
        </div>
      )}

      <details className="border-t border-anil">
        <summary className="cursor-pointer px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.12em] text-azul">
          {t.results.seeSteps}
        </summary>
        <div className="flex flex-col gap-4 border-t border-anil px-4 py-4">
          <TraceSteps steps={stepsForTrace} />
          <div>
            <h4 className="mb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-anil">{t.results.rulesTitle}</h4>
            <ul className="flex flex-col gap-px border border-anil bg-anil">
              {trace.ruleRefs.map((rule) => (
                <li key={rule.id} className="bg-giz p-3">
                  <p className="text-[13.5px] leading-relaxed text-tinta">{localize(rule.rule, locale)}</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-anil">
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
