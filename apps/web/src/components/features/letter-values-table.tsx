import { useLocale } from '@/i18n/locale-context'
import { UI_MESSAGES } from '@/i18n/ui-messages'

/**
 * Tabela de conversão letra→valor de uma escola, com as letras do nome
 * destacadas — a "tabela usada" que a camada educacional exige (§3.2).
 * Genérica: colunas derivam dos valores da tabela (1–9 pitagórica, 1–8 caldaica).
 */
export function LetterValuesTable({
  values,
  highlight,
}: {
  values: Readonly<Record<string, number>>
  highlight: ReadonlySet<string>
}) {
  const { locale } = useLocale()
  const t = UI_MESSAGES[locale]
  const columns = [...new Set(Object.values(values))].sort((a, b) => a - b)
  const lettersFor = (column: number) =>
    Object.entries(values)
      .filter(([, value]) => value === column)
      .map(([letter]) => letter)

  return (
    <table className="w-full border-collapse text-center font-mono text-sm" aria-label={t.results.tableTitle}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column} scope="col" className="border border-anil bg-papel px-1 py-1 font-display text-lg text-latao">
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {columns.map((column) => (
            <td key={column} className="border border-anil bg-giz px-1 py-1 align-top">
              <div className="flex flex-col gap-0.5">
                {lettersFor(column).map((letter) => (
                  <span
                    key={letter}
                    className={highlight.has(letter) ? 'bg-latao font-semibold text-papel' : 'text-anil'}
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
