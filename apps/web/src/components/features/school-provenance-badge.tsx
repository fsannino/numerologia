import type { Canonicity, ModelMetadata, Standardization } from '@numerus/numerology-domain'
import { useLocale } from '@/i18n/locale-context'
import { UI_MESSAGES } from '@/i18n/ui-messages'

/** Cor por "solidez": quanto menos lastro/padronização, mais o tom alerta. */
const CANONICITY_TONE: Readonly<Record<Canonicity, string>> = {
  'documented-tradition': 'bg-emerald-100 text-emerald-900',
  'modern-systematization': 'bg-slate-100 text-slate-700',
  'contemporary-construction': 'bg-amber-100 text-amber-900',
}

const STANDARDIZATION_TONE: Readonly<Record<Standardization, string>> = {
  standardized: 'bg-emerald-100 text-emerald-900',
  'variant-dependent': 'bg-amber-100 text-amber-900',
  unstandardized: 'bg-rose-100 text-rose-900',
}

/**
 * Selo de honestidade (§9): toda escola exibe, sempre, quão documentada e
 * quão padronizada ela é. Tratar todas como igualmente estabelecidas seria
 * mentir por omissão.
 */
export function SchoolProvenanceBadge({ metadata }: { metadata: ModelMetadata }) {
  const { locale } = useLocale()
  const t = UI_MESSAGES[locale]
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5" title={t.provenance.title}>
      <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${CANONICITY_TONE[metadata.canonicity]}`}>
        {t.provenance.canonicity[metadata.canonicity]}
      </span>
      <span
        className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${STANDARDIZATION_TONE[metadata.standardization]}`}
      >
        {t.provenance.standardization[metadata.standardization]}
      </span>
    </span>
  )
}
