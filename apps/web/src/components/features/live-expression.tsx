'use client'

import { useMemo, useState } from 'react'
import { calculateChart } from '@numerus/numerology-application'
import { useLocale } from '@/i18n/locale-context'
import { UI_MESSAGES } from '@/i18n/ui-messages'
import { ReductionChain } from './reduction-chain'

/**
 * Calculadora viva do hero: computa a Expressão (pitagórico) a cada tecla,
 * 100% no cliente (device-first). Reusa o domínio — nenhuma regra na UI.
 */
export function LiveExpression() {
  const { locale } = useLocale()
  const t = UI_MESSAGES[locale].home
  const [name, setName] = useState('')

  const trace = useMemo(() => {
    if (name.trim() === '') return null
    const result = calculateChart({
      subject: { kind: 'person', fullName: name },
      models: ['pythagorean'],
      numbers: ['expression'],
    })
    return result.ok ? (result.value.results[0]?.traces[0] ?? null) : null
  }, [name])

  const chips = trace
    ? trace.steps.flatMap((step) => (step.kind === 'letter-mapping' ? step.output.entries : []))
    : []

  return (
    <div className="flex flex-col gap-5 bg-giz p-6 sm:p-8">
      <label htmlFor="live-name" className="font-mono text-[10px] uppercase tracking-[0.16em] text-latao">
        {t.liveLabel}
      </label>
      <input
        id="live-name"
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Maria da Silva"
        spellCheck={false}
        autoComplete="off"
        className="border-0 border-b border-anil bg-transparent px-1 pb-3 pt-1 font-mono text-xl tracking-wide text-tinta placeholder:text-tinta/30 focus:border-latao focus:outline-none"
      />

      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-anil">{t.liveCaption}</p>

      {trace === null ? (
        <p className="font-mono text-[13px] text-tinta/40">{t.emptyHint}</p>
      ) : (
        <div className="flex flex-col gap-5">
          <ul className="flex flex-wrap gap-1.5" aria-hidden>
            {chips.map((chip, index) => (
              <li
                key={`${chip.letter}-${index}`}
                data-anim
                style={{ animation: 'chipIn 0.35s both', animationDelay: `${index * 0.02}s` }}
                className="flex flex-col items-center border border-anil px-2 py-1"
              >
                <span className="font-mono text-[11px] text-latao">{chip.letter}</span>
                <span className="font-mono text-lg text-tinta">{chip.value}</span>
              </li>
            ))}
          </ul>

          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-anil">{t.sumLabel}</span>
            <span className="font-display text-3xl text-tinta">{trace.finalValue.raw}</span>
          </div>

          <ReductionChain value={trace.finalValue} onDark />
          {trace.finalValue.karmicDebt !== undefined && (
            <span className="w-fit border border-giz/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-tinta/70">
              {UI_MESSAGES[locale].results.debtBadge(trace.finalValue.karmicDebt)}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
