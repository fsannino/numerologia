import type { CalculationTrace, NumberKind } from '@numerus/numerology-domain'
import { getModel } from '@numerus/numerology-domain'
import type { ChartModelResult } from '@numerus/numerology-application'
import { localize } from '@numerus/shared-kernel'
import { useLocale } from '@/i18n/locale-context'
import { UI_MESSAGES } from '@/i18n/ui-messages'

function tracesByNumber(results: ReadonlyArray<ChartModelResult>): ReadonlyArray<{
  readonly number: NumberKind
  readonly cells: ReadonlyArray<CalculationTrace | undefined>
}> {
  const order: NumberKind[] = []
  for (const result of results) {
    for (const trace of result.traces) {
      if (!order.includes(trace.resultId)) order.push(trace.resultId)
    }
  }
  return order.map((number) => ({
    number,
    cells: results.map((result) => result.traces.find((trace) => trace.resultId === number)),
  }))
}

/**
 * Matriz comparativa (§2.4): valores lado a lado, divergência destacada com
 * causa explicada, e convergência marcada com o aviso de que não é evidência.
 */
export function ComparisonMatrix({ results }: { results: ReadonlyArray<ChartModelResult> }) {
  const { locale } = useLocale()
  const t = UI_MESSAGES[locale]
  const rows = tracesByNumber(results)
  const hasDivergence = rows.some((row) => {
    const values = row.cells.filter((cell) => cell !== undefined).map((cell) => cell.finalValue.reduced)
    return values.length > 1 && new Set(values).size > 1
  })

  return (
    <section className="flex flex-col gap-3" aria-label={t.matrix.title}>
      <h3 className="text-lg font-semibold">{t.matrix.title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th scope="col" className="border border-slate-300 bg-indigo-50 px-3 py-2 text-left font-semibold text-indigo-900">
                {t.matrix.numberColumn}
              </th>
              {results.map((result) => {
                const model = getModel(result.model)
                return (
                  <th key={result.model} scope="col" className="border border-slate-300 bg-indigo-50 px-3 py-2 font-semibold text-indigo-900">
                    {model.ok ? localize(model.value.metadata.name, locale) : result.model}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const defined = row.cells.filter((cell) => cell !== undefined)
              const diverges =
                defined.length > 1 && new Set(defined.map((cell) => cell.finalValue.reduced)).size > 1
              return (
                <tr key={row.number} className={diverges ? 'bg-amber-50' : undefined}>
                  <th scope="row" className="border border-slate-300 px-3 py-2 text-left font-medium">
                    {t.numberLabels[row.number]?.title ?? row.number}
                    {diverges && <span aria-hidden> ⚖</span>}
                  </th>
                  {row.cells.map((cell, index) => (
                    <td key={index} className="border border-slate-300 px-3 py-2 text-center">
                      {cell === undefined ? (
                        <span className="text-xs text-slate-400">— {t.matrix.notCalculated}</span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5">
                          <span className={`font-bold ${diverges ? 'text-amber-900' : ''}`}>
                            {cell.finalValue.reduced}
                          </span>
                          {cell.model === 'chaldean' && cell.finalValue.raw !== cell.finalValue.reduced && (
                            <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[11px] text-slate-700">
                              {t.results.compoundBadge(cell.finalValue.raw)}
                            </span>
                          )}
                          {cell.finalValue.isMaster && <span className="text-[11px] text-violet-700">✦</span>}
                          {cell.finalValue.karmicDebt !== undefined && (
                            <span className="text-[11px] text-rose-700">{cell.finalValue.karmicDebt}</span>
                          )}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {hasDivergence && <p className="text-xs leading-relaxed text-amber-900">{t.matrix.divergenceCause}</p>}
      <p className="text-xs leading-relaxed text-slate-500">{t.matrix.convergenceNote}</p>
    </section>
  )
}
