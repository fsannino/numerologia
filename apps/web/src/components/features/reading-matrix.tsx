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
              <th className="w-1/3 text-left align-bottom font-mono text-[10px] uppercase tracking-[0.1em] text-anil">
                {t.tableHeader}
              </th>
              {REDUCTIONS.map((reduction) => (
                <th key={reduction} className="text-center font-mono text-[10px] uppercase tracking-[0.1em] text-anil">
                  {t.reductionLabel[reduction]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TABLES.map((table) => (
              <tr key={table}>
                <th className="text-left align-middle font-mono text-[11px] uppercase tracking-[0.08em] text-tinta">
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
                        className={`flex w-full items-center gap-3 border p-3 text-left transition ${
                          isOwn
                            ? 'border-latao bg-papel'
                            : 'border-anil bg-giz'
                        } ${isPinned ? 'ring-2 ring-latao' : 'hover:-translate-y-px'}`}
                      >
                        <span
                          className={`min-w-[2rem] text-center font-display text-3xl tabular-nums ${
                            isOwn ? 'text-latao' : 'text-anil'
                          }`}
                        >
                          {reading.value}
                        </span>
                        <span className="flex flex-col gap-0.5">
                          <span
                            className={`w-fit border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] ${
                              isOwn ? 'border-latao text-latao' : 'border-anil text-anil'
                            }`}
                          >
                            {isOwn ? t.own : t.coincides[reading.coincidesWith as 'pythagorean' | 'chaldean']}
                          </span>
                          <span className="text-[10px] text-anil tabular-nums">{t.total(reading.rawTotal)}</span>
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
      <p className="border-l-2 border-latao bg-papel p-3 text-[13px] leading-relaxed text-tinta">{t.whyMultiple}</p>
    </div>
  )
}
