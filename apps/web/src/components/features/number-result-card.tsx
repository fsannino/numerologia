import type { CalculationTrace } from '@numerus/numerology-domain'
import { localize } from '@numerus/shared-kernel'
import { ReductionChain } from './reduction-chain'
import { TraceSteps } from './trace-steps'

const LOCALE = 'pt-BR'

const NUMBER_LABELS: Record<string, { title: string; hint: string }> = {
  expression: { title: 'Expressão', hint: 'todas as letras do nome' },
  motivation: { title: 'Motivação (Alma)', hint: 'somente as vogais' },
  impression: { title: 'Impressão (Personalidade)', hint: 'somente as consoantes' },
  'key-number': { title: 'Número Chave', hint: 'primeiro nome' },
  'life-path': { title: 'Destino (Caminho de Vida)', hint: 'data de nascimento completa' },
  psychic: { title: 'Psíquico', hint: 'dia do nascimento' },
  mission: { title: 'Missão', hint: 'Expressão + Destino' },
  'karmic-lessons': { title: 'Lições Cármicas', hint: 'dígitos ausentes na grade do nome' },
  'hidden-tendencies': { title: 'Tendências Ocultas', hint: 'dígitos repetidos 3+ vezes' },
  subconscious: { title: 'Subconsciente', hint: 'dígitos distintos presentes' },
}

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
  const label = NUMBER_LABELS[trace.resultId] ?? { title: trace.resultId, hint: '' }
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
                {highlightedDigits.length > 0 ? `Dígitos: ${highlightedDigits.join(', ')}` : 'Nenhum dígito destacado'}
              </span>
            )}
            {trace.finalValue.isMaster && (
              <span className="rounded-full bg-violet-200 px-2 py-0.5 font-medium text-violet-900">✦ Mestre</span>
            )}
            {trace.finalValue.karmicDebt !== undefined && (
              <span className="rounded-full bg-rose-200 px-2 py-0.5 font-medium text-rose-900">
                Dívida cármica {trace.finalValue.karmicDebt}
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
          <p className="mb-1 text-xs font-semibold text-amber-900">⚖ Os métodos divergem aqui</p>
          {trace.divergenceNotes.map((note) => (
            <p key={note.id} className="text-xs leading-relaxed text-amber-950">
              {localize(note.note, LOCALE)}
            </p>
          ))}
        </div>
      )}

      <details className="border-t border-slate-100">
        <summary className="cursor-pointer px-4 py-2.5 text-sm font-medium text-indigo-700">
          Ver passo a passo e regras
        </summary>
        <div className="flex flex-col gap-4 px-4 pb-4">
          <TraceSteps steps={trace.steps} />
          <div>
            <h4 className="mb-2 text-sm font-semibold">Por quê? As regras aplicadas</h4>
            <ul className="flex flex-col gap-2">
              {trace.ruleRefs.map((rule) => (
                <li key={rule.id} className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs leading-relaxed">{localize(rule.rule, LOCALE)}</p>
                  <p className="mt-1 text-[11px] text-slate-500">Fonte: {localize(rule.source, LOCALE)}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </details>
    </article>
  )
}
