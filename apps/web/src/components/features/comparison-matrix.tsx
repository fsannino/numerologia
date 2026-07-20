import type { CalculationTrace, NumberKind } from '@numerus/numerology-domain'
import { getModel } from '@numerus/numerology-domain'
import type { ChartModelResult } from '@numerus/numerology-application'
import { localize } from '@numerus/shared-kernel'
import { useLocale } from '@/i18n/locale-context'
import { UI_MESSAGES } from '@/i18n/ui-messages'
import { SCHOOL_BORDER_TOP, SCHOOL_TEXT } from './school-color'

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
      <h3 className="font-display text-2xl text-tinta">{t.matrix.title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse font-mono text-sm">
          <thead>
            <tr>
              <th scope="col" className="border border-anil bg-papel px-3 py-2 text-left font-mono text-[10px] uppercase tracking-[0.1em] text-anil">
                {t.matrix.numberColumn}
              </th>
              {results.map((result) => (
                <th
                  key={result.model}
                  scope="col"
                  className={`border border-t-2 border-anil ${SCHOOL_BORDER_TOP[result.model]} bg-papel px-3 py-2 font-mono text-[10px] uppercase tracking-[0.1em] ${SCHOOL_TEXT[result.model]}`}
                >
                  {(() => {
                    const model = getModel(result.model)
                    return model.ok ? localize(model.value.metadata.name, locale) : result.model
                  })()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const defined = row.cells.filter((cell) => cell !== undefined)
              const diverges =
                defined.length > 1 && new Set(defined.map((cell) => cell.finalValue.reduced)).size > 1
              return (
                <tr key={row.number}>
                  <th
                    scope="row"
                    className={`border border-anil px-3 py-2 text-left text-[13px] font-medium text-tinta ${diverges ? 'border-l-2 border-l-vermelhao' : ''}`}
                  >
                    {t.numberLabels[row.number]?.title ?? row.number}
                    {diverges && <span aria-hidden className="text-vermelhao"> ⚖</span>}
                  </th>
                  {row.cells.map((cell, index) => (
                    <td key={index} className="border border-anil bg-giz px-3 py-2 text-center">
                      {cell === undefined ? (
                        <span className="text-[11px] text-anil">— {t.matrix.notCalculated}</span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5">
                          <span className={`font-display text-xl ${diverges ? 'text-vermelhao' : 'text-tinta'}`}>
                            {cell.finalValue.reduced}
                          </span>
                          {cell.model === 'chaldean' && cell.finalValue.raw !== cell.finalValue.reduced && (
                            <span className="border border-anil px-1.5 py-0.5 text-[11px] text-anil">
                              {t.results.compoundBadge(cell.finalValue.raw)}
                            </span>
                          )}
                          {cell.finalValue.isMaster && <span className="text-[11px] text-latao">✦</span>}
                          {cell.finalValue.karmicDebt !== undefined && (
                            <span className="text-[11px] text-tinta">{cell.finalValue.karmicDebt}</span>
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
      {hasDivergence && <p className="text-[13px] leading-relaxed text-vermelhao">{t.matrix.divergenceCause}</p>}
      <p className="text-[13px] leading-relaxed text-anil">{t.matrix.convergenceNote}</p>
    </section>
  )
}
