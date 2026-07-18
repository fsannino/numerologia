import { PYTHAGOREAN_LETTER_VALUES } from '@numerus/numerology-domain'
import { useLocale } from '@/i18n/locale-context'
import { UI_MESSAGES } from '@/i18n/ui-messages'

const COLUMNS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const

function lettersForColumn(value: number): ReadonlyArray<string> {
  return Object.entries(PYTHAGOREAN_LETTER_VALUES)
    .filter(([, letterValue]) => letterValue === value)
    .map(([letter]) => letter)
}

/**
 * Tabela de conversão pitagórica com as letras do nome destacadas —
 * a "tabela usada" que a camada educacional exige mostrar (§3.2).
 */
export function PythagoreanTable({ highlight }: { highlight: ReadonlySet<string> }) {
  const { locale } = useLocale()
  const t = UI_MESSAGES[locale]
  return (
    <table className="w-full border-collapse text-center text-sm" aria-label={t.results.tableTitle}>
      <thead>
        <tr>
          {COLUMNS.map((value) => (
            <th key={value} scope="col" className="border border-slate-300 bg-indigo-50 px-1 py-1 font-semibold text-indigo-900">
              {value}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {COLUMNS.map((value) => (
            <td key={value} className="border border-slate-300 px-1 py-1 align-top">
              <div className="flex flex-col gap-0.5">
                {lettersForColumn(value).map((letter) => (
                  <span
                    key={letter}
                    className={
                      highlight.has(letter)
                        ? 'rounded bg-amber-200 font-bold text-slate-900'
                        : 'text-slate-500'
                    }
                  >
                    {letter}
                  </span>
                ))}
              </div>
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  )
}
