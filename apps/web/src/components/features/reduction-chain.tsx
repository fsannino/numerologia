import type { NumerologyValue } from '@numerus/numerology-domain'
import { sumDigits } from '@numerus/numerology-domain'

/**
 * Cadeia de redução com cada etapa explícita: 62 → 6+2 → 8.
 * Acessível: também descrita em texto para leitores de tela.
 */
export function ReductionChain({ value }: { value: NumerologyValue }) {
  const readable = value.chain.join(', depois ')
  return (
    <div>
      <p className="sr-only">Cadeia de redução: {readable}.</p>
      <ol aria-hidden className="flex flex-wrap items-center gap-2">
        {value.chain.map((stage, index) => {
          const isLast = index === value.chain.length - 1
          return (
            <li key={`${stage}-${index}`} className="flex items-center gap-2">
              {index > 0 && <span className="text-slate-400">→</span>}
              <span
                className={
                  isLast
                    ? 'rounded-lg bg-indigo-600 px-3 py-1 text-lg font-bold text-white'
                    : 'rounded-lg bg-slate-200 px-3 py-1 font-mono text-slate-700'
                }
              >
                {stage}
              </span>
              {!isLast && stage > 9 && (
                <span className="font-mono text-xs text-slate-500">
                  ({[...String(stage)].join('+')} = {sumDigits(stage)})
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
