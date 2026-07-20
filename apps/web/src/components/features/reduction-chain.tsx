import type { NumerologyValue } from '@numerus/numerology-domain'
import { sumDigits } from '@numerus/numerology-domain'
import { useLocale } from '@/i18n/locale-context'
import { UI_MESSAGES } from '@/i18n/ui-messages'

/**
 * Cadeia de redução — o elemento-assinatura (design.md §5): 62 → 6+2 → 8.
 * Cada etapa entra com `stepIn`, defasada; o numeral final em latão. Mestres
 * (11/22/33) recebem a marca — não se dissolvem. Acessível: descrição textual
 * para leitores de tela.
 */
export function ReductionChain({ value, onDark = false }: { value: NumerologyValue; onDark?: boolean }) {
  const { locale } = useLocale()
  const t = UI_MESSAGES[locale]
  const intermediate = onDark ? 'text-tinta/70' : 'text-anil'
  const arrow = onDark ? 'text-tinta/50' : 'text-anil'
  return (
    <div>
      <p className="sr-only">{t.results.chainSr(value.chain.join(' → '))}</p>
      <ol aria-hidden className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1 font-display">
        {value.chain.map((stage, index) => {
          const isLast = index === value.chain.length - 1
          return (
            <li key={`${stage}-${index}`} className="flex items-baseline gap-2.5">
              {index > 0 && <span className={`font-mono text-sm ${arrow}`}>→</span>}
              <span
                data-anim
                style={{ animation: 'stepIn 0.45s both', animationDelay: `${index * 0.12}s` }}
                className={
                  isLast
                    ? `leading-none text-latao ${onDark ? 'text-6xl' : 'text-4xl'}`
                    : `text-2xl leading-none ${intermediate}`
                }
              >
                {stage}
              </span>
              {!isLast && stage > 9 && (
                <span className="font-mono text-[11px] text-anil/70">
                  ({[...String(stage)].join('+')} = {sumDigits(stage)})
                </span>
              )}
            </li>
          )
        })}
        {value.isMaster && (
          <li className="ml-1 self-center font-mono text-[10px] uppercase tracking-[0.14em] text-anil">
            {t.results.masterShort}
          </li>
        )}
      </ol>
    </div>
  )
}
