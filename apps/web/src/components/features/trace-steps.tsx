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
        <p className="font-mono text-sm text-tinta">
          &quot;{step.input.source}&quot; <span className="text-anil">→</span>{' '}
          {step.output.kept.length > 0 ? step.output.kept.join(' · ') : <em>{t.results.noLetters}</em>}
        </p>
      )
    case 'letter-mapping':
      return (
        <ul className="flex flex-wrap gap-1.5" aria-label={localize(step.title, locale)}>
          {step.output.entries.map((entry, index) => (
            <li
              key={`${entry.letter}-${index}`}
              className="flex flex-col items-center border border-anil bg-giz px-2 py-1"
            >
              <span className="font-mono text-sm font-semibold text-tinta">{entry.letter}</span>
              <span className="font-mono text-sm text-latao">{entry.value}</span>
            </li>
          ))}
        </ul>
      )
    case 'sum':
      return (
        <p className="font-mono text-sm text-tinta">
          {step.input.parcels.join(' + ')} = <strong className="font-display text-2xl text-latao">{step.output.total}</strong>
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
              className={`flex items-center gap-3 border px-3 py-2 ${
                segment.isCurrent ? 'border-latao bg-papel' : 'border-anil bg-giz'
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center font-bold ${
                  segment.isCurrent ? 'bg-latao text-papel' : 'bg-papel text-anil'
                }`}
              >
                {segment.value.reduced}
              </span>
              <div className="flex min-w-0 flex-col">
                <span className="text-sm font-medium">{localize(segment.label, locale)}</span>
                <span className="text-[11px] text-anil">
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
            <span className="border border-anil px-2 py-0.5 font-mono text-[11px] text-anil">
              {step.output.standardTotal} · {t.gematria.standardLabel}
            </span>
            <span dir="rtl" className="font-serif text-lg">{step.output.standardHebrew}</span>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px] text-anil">
            <span>{t.gematria.spectrumLabel(step.output.minTotal, step.output.maxTotal)}</span>
            <span>· {t.gematria.combinationsLabel(step.output.combinationCount)}</span>
          </div>
          <div>
            <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.1em] text-anil">{t.gematria.candidatesTitle}</p>
            <ul className="flex flex-wrap gap-2">
              {step.output.letters.map((letter, index) => (
                <li
                  key={index}
                  className={`border px-2 py-1 text-xs ${
                    letter.options.length > 1 ? 'border-latao bg-papel' : 'border-anil bg-giz'
                  }`}
                >
                  <span className="font-bold">{letter.latin}</span>
                  {letter.options.length > 1 && (
                    <span className="ml-1 text-[10px] text-latao">({t.gematria.ambiguous})</span>
                  )}
                  <span className="mt-0.5 flex flex-col">
                    {letter.options.map((option, optionIndex) => (
                      <span key={optionIndex}>
                        <span dir="rtl" className="font-serif">{option.hebrew}</span>{' '}
                        <span className="text-anil">{option.name} = {option.value}</span>
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
                        className={`h-14 w-14 border border-anil text-center align-middle font-display text-lg ${
                          count > 0 ? 'bg-papel text-latao' : 'bg-giz text-anil/40'
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
            <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.1em] text-anil">{t.loShu.arrowsTitle}</p>
            {step.output.arrows.length === 0 ? (
              <p className="text-[11px] text-anil">{t.loShu.noArrows}</p>
            ) : (
              <ul className="flex flex-col gap-1">
                {step.output.arrows.map((arrow, index) => (
                  <li key={index} className="text-xs">
                    <span
                      className={`px-1.5 py-0.5 font-medium ${
                        arrow.kind === 'strength' ? 'border border-anil text-anil' : 'border border-latao text-latao'
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
                className={`flex flex-col items-center border px-2 py-1 ${
                  highlighted ? 'border-latao bg-papel text-latao' : 'border-anil bg-giz text-anil'
                }`}
              >
                <span className="text-base">{entry.digit}</span>
                <span className="text-xs">{entry.count}×</span>
              </li>
            )
          })}
        </ul>
      )
    case 'gate-structure':
      return (
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-display text-2xl text-latao">{step.output.activated.length}</span>
            <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-anil">
              {t.gates.activated(step.output.activated.length, step.output.totalGates)}
            </span>
            <span className="border border-latao px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-latao">
              {t.gates.nonCanonical}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-anil">
            <span>{t.gates.standardLabel}:</span>
            <span dir="rtl" className="font-serif text-lg text-tinta">{step.output.standardHebrew}</span>
            <span>· {t.gates.modeLabel}: {step.output.mode}</span>
          </div>
          <div>
            <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.1em] text-anil">{t.gates.gatesTitle}</p>
            <ul className="flex flex-wrap gap-1.5">
              {step.output.activated.map((gate, index) => (
                <li key={index} className="flex items-center gap-1.5 border border-anil bg-giz px-2 py-1" dir="rtl">
                  <span className="font-serif text-base text-tinta">{gate.first.hebrew}</span>
                  <span className="font-serif text-base text-tinta">{gate.second.hebrew}</span>
                  <span dir="ltr" className="font-mono text-[10px] text-anil">
                    {gate.first.value}·{gate.second.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-anil">{t.gates.reference}</p>
        </div>
      )
    case 'reading-matrix':
      return <ReadingMatrix readings={step.output.readings} />
    case 'planetary-ruler':
      return (
        <div className="flex items-center gap-3 border-l-2 border-latao bg-papel px-3 py-2">
          <span className="text-3xl leading-none" aria-hidden="true">
            {step.output.symbol}
          </span>
          <div className="flex flex-col">
            <span className="font-display text-lg text-tinta">
              {localize(step.output.planet, locale)} · {step.output.sanskrit}
            </span>
            <span className="text-[12px] text-anil">
              {t.vedic.qualitiesLabel}: {localize(step.output.qualities, locale)}
            </span>
          </div>
        </div>
      )
    case 'master-check':
      // A frase completa já vem localizada em step.explanation; aqui só o destaque.
      return step.output.isMaster ? (
        <p className="text-sm">
          <span className="border border-latao px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.1em] text-latao">
            {t.results.masterShort} {step.input.candidate}
          </span>
        </p>
      ) : null
    case 'karmic-check':
      return step.output.debtsFound.length > 0 ? (
        <p className="flex flex-wrap gap-1.5 text-sm">
          {step.output.debtsFound.map((debt, index) => (
            <span key={index} className="border border-tinta px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.1em] text-tinta">
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
    <ol className="flex flex-col gap-px border border-anil bg-anil">
      {steps.map((step, index) => (
        <li key={index}>
          <details className="bg-giz open:bg-papel" open={index === 0}>
            <summary className="flex cursor-pointer items-center gap-3 px-4 py-2.5">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-latao font-mono text-[11px] text-papel tabular-nums">
                {index + 1}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-tinta">{localize(step.title, locale)}</span>
            </summary>
            <div className="flex flex-col gap-3 border-t border-anil px-4 py-3">
              <p className="text-[14px] leading-relaxed text-anil">{localize(step.explanation, locale)}</p>
              <StepBody step={step} />
            </div>
          </details>
        </li>
      ))}
    </ol>
  )
}
