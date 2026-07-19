import type { Canonicity, ModelMetadata, Standardization } from '@numerus/numerology-domain'
import { useLocale } from '@/i18n/locale-context'
import { UI_MESSAGES } from '@/i18n/ui-messages'

/**
 * Selo em Mono (design.md): estrutura em anil; quanto menos lastro/padronização,
 * mais o latão marca. O vermelhão é reservado à divergência — não entra aqui.
 */
const CHIP = 'border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em]'
const CANONICITY_TONE: Readonly<Record<Canonicity, string>> = {
  'documented-tradition': 'border-anil text-anil',
  'modern-systematization': 'border-anil text-anil',
  'contemporary-construction': 'border-latao text-latao',
}

const STANDARDIZATION_TONE: Readonly<Record<Standardization, string>> = {
  standardized: 'border-anil text-anil',
  'variant-dependent': 'border-latao text-latao',
  unstandardized: 'border-latao text-latao',
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
      <span className={`${CHIP} ${CANONICITY_TONE[metadata.canonicity]}`}>
        {t.provenance.canonicity[metadata.canonicity]}
      </span>
      <span className={`${CHIP} ${STANDARDIZATION_TONE[metadata.standardization]}`}>
        {t.provenance.standardization[metadata.standardization]}
      </span>
    </span>
  )
}
