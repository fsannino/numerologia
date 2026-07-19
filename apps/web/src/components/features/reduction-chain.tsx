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
export function ReductionChain({ value }: { value: NumerologyValue }) {
  const { locale } = useLocale()
  const t = UI_MESSAGES[locale]
  return (
    <div>
      <p className="sr-only">{t.results.chainSr(value.chain.join(' → '))}</p>
      <ol aria-hidden className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1 font-display">
        {value.chain.map((stage, index) => {
          const isLast = index === value.chain.length - 1
          return (
            <li key={`${stage}-${index}`} className="flex items-baseline gap-2.5">
              {index > 0 && <span className="font-mono text-sm text-anil">→</span>}
              <span
                data-anim
                style={{ animation: 'stepIn 0.45s both', animationDelay: `${index * 0.12}s` }}
                className={isLast ? 'text-4xl leading-none text-latao' : 'text-2xl leading-none text-anil'}
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
          <li className="ml-1 self-center font-mono text-[10px] uppercase tracking-[0.14em] text-latao">
            {t.results.masterShort}
          </li>
        )}
      </ol>
    </div>
  )
}
