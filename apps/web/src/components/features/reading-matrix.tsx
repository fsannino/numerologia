import { useState } from 'react'
import type { KabbalisticReading } from '@numerus/numerology-domain'
import { useLocale } from '@/i18n/locale-context'
import { UI_MESSAGES } from '@/i18n/ui-messages'

const TABLES = ['sequential-1-9', 'chaldean-like-1-8'] as const
const REDUCTIONS = ['decimal', 'modular-22'] as const

/**
 * A Matriz de Leituras: um nome cabalístico tem várias respostas simultâneas
 * (tabela × redução), todas expostas com sua origem. Coincidência com escola
 * existente é etiquetada, não escondida (§9). Clicar fixa uma leitura.
 */
export function ReadingMatrix({ readings }: { readings: ReadonlyArray<KabbalisticReading> }) {
  const { locale } = useLocale()
  const t = UI_MESSAGES[locale].kabbalistic
  const [pinned, setPinned] = useState<string | null>(null)
  const cellKey = (r: KabbalisticReading) => `${r.table}-${r.reduction}`
  const find = (table: string, reduction: string) =>
    readings.find((r) => r.table === table && r.reduction === reduction)

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] border-separate border-spacing-2">
          <thead>
            <tr>
              <th className="w-1/3 text-left align-bottom text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                {t.tableHeader}
              </th>
              {REDUCTIONS.map((reduction) => (
                <th key={reduction} className="text-center text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  {t.reductionLabel[reduction]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TABLES.map((table) => (
              <tr key={table}>
                <th className="text-left align-middle text-sm font-semibold text-slate-700">
                  {t.tableLabel[table]}
                </th>
                {REDUCTIONS.map((reduction) => {
                  const reading = find(table, reduction)
                  if (reading === undefined) return <td key={reduction} />
                  const key = cellKey(reading)
                  const isOwn = reading.coincidesWith === undefined
                  const isPinned = pinned === key
                  return (
                    <td key={reduction}>
                      <button
                        type="button"
                        onClick={() => setPinned(isPinned ? null : key)}
                        aria-pressed={isPinned}
                        className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                          isOwn
                            ? 'border-indigo-200 bg-indigo-50'
                            : 'border-slate-200 bg-slate-50/70'
                        } ${isPinned ? 'ring-2 ring-indigo-500' : 'hover:-translate-y-px'}`}
                      >
                        <span
                          className={`min-w-[2rem] text-center text-2xl font-bold tabular-nums ${
                            isOwn ? 'text-indigo-700' : 'text-slate-400'
                          }`}
                        >
                          {reading.value}
                        </span>
                        <span className="flex flex-col gap-0.5">
                          <span
                            className={`w-fit rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                              isOwn ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {isOwn ? t.own : t.coincides[reading.coincidesWith as 'pythagorean' | 'chaldean']}
                          </span>
                          <span className="text-[11px] text-slate-400 tabular-nums">{t.total(reading.rawTotal)}</span>
                        </span>
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="rounded-lg bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">{t.whyMultiple}</p>
    </div>
  )
}
