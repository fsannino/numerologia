'use client'

import type { CalculationTrace, ModelId, NumberKind } from '@numerus/numerology-domain'
import { calculateChart } from '@numerus/numerology-application'
import { listModels } from '@numerus/numerology-domain'
import { localize } from '@numerus/shared-kernel'
import { useLocale } from '@/i18n/locale-context'
import { UI_MESSAGES } from '@/i18n/ui-messages'
import { SchoolProvenanceBadge } from './school-provenance-badge'
import { SCHOOL_BORDER_TOP, SCHOOL_TEXT } from './school-color'

/**
 * Prova imediata: um mesmo perfil de exemplo, lido pelas sete escolas — sete
 * números diferentes, cada um com sua origem. É a tese do produto ("por que
 * dois sites dão números diferentes?") mostrada, não afirmada. O cálculo roda
 * pelo domínio (calculateChart); nada de numerologia na UI. Determinístico:
 * exemplo fixo, sem relógio nem aleatório.
 */
const EXAMPLE = { fullName: 'Maria da Silva', birthDate: '1990-03-11' }

/** O número-assinatura que representa cada escola na vitrine. */
const SIGNATURE: Readonly<Record<ModelId, NumberKind>> = {
  pythagorean: 'expression',
  chaldean: 'expression',
  'lo-shu': 'lo-shu-grid',
  gematria: 'gematria-value',
  vedic: 'vedic-moolank',
  kabbalistic: 'kabbalistic-name',
  'gates-231': 'gates-231-structure',
}

const SIGNATURE_NUMBERS: ReadonlyArray<NumberKind> = [...new Set(Object.values(SIGNATURE))]

type Tile = { readonly model: ModelId; readonly trace: CalculationTrace }

/** Uma leitura-assinatura por escola, calculada no domínio. */
function proofTiles(): ReadonlyArray<Tile> {
  const result = calculateChart({
    subject: { kind: 'person', fullName: EXAMPLE.fullName, birthDate: EXAMPLE.birthDate },
    models: listModels().map((model) => model.id),
    numbers: SIGNATURE_NUMBERS,
  })
  if (!result.ok) return []
  return result.value.results.flatMap((modelResult) => {
    const preferred = modelResult.traces.find((trace) => trace.resultId === SIGNATURE[modelResult.model])
    const trace = preferred ?? modelResult.traces[0]
    return trace ? [{ model: modelResult.model, trace }] : []
  })
}

export function ProofOfDivergence() {
  const { locale } = useLocale()
  const h = UI_MESSAGES[locale].home
  const t = UI_MESSAGES[locale]
  const tiles = proofTiles()
  const models = listModels()

  return (
    <section id="prova" className="border-b border-anil px-5 py-14 sm:px-8">
      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-latao">{h.proofKicker}</span>
      <h2 className="mt-3 max-w-[24ch] font-display text-4xl text-tinta text-balance sm:text-5xl">{h.proofTitle}</h2>
      <p className="mt-5 max-w-[64ch] text-[15px] leading-relaxed text-anil">{h.proofLede}</p>
      <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-anil">
        {h.proofExamplePrefix}: <span className="text-tinta">{EXAMPLE.fullName}</span> ·{' '}
        <span className="text-tinta">11/03/1990</span>
      </p>

      {tiles.length > 0 && (
        <ul className="mt-8 grid border-l border-t border-anil sm:grid-cols-2 lg:grid-cols-4">
          {tiles.map(({ model, trace }) => {
            const meta = models.find((entry) => entry.id === model)?.metadata
            const label = t.numberLabels[trace.resultId]?.title ?? trace.resultId
            return (
              <li
                key={model}
                className={`flex flex-col gap-3 border-r border-b border-t-2 border-anil ${SCHOOL_BORDER_TOP[model]} bg-giz p-5`}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-display text-6xl leading-none text-latao tabular-nums">
                    {trace.finalValue.reduced}
                  </span>
                  {meta && <SchoolProvenanceBadge metadata={meta} />}
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className={`font-display text-xl ${SCHOOL_TEXT[model]}`}>
                    {meta ? localize(meta.name, locale) : model}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-anil">{label}</span>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <p className="mt-6 max-w-[70ch] text-[14px] leading-relaxed text-azul">{h.proofCaption}</p>
    </section>
  )
}
