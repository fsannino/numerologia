'use client'

import { useLocale } from '@/i18n/locale-context'
import { UI_MESSAGES } from '@/i18n/ui-messages'

/**
 * Convite discreto à trilha profissional, no rodapé da ferramenta (§ avaliação
 * de marketing). Fica em azul — a cor da trilha "atendo clientes" na Home — e
 * traz a tag "em breve": é sinal comercial honesto, sem cobrança nem muro real
 * enquanto não houver auth/billing (design.md §10). Não recebe nome nem data;
 * é só cópia + link interno.
 */
export function ProfessionalUpsell() {
  const { locale } = useLocale()
  const u = UI_MESSAGES[locale].upsell
  return (
    <aside className="flex flex-col gap-3 border border-azul/40 bg-giz p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="flex flex-col gap-1">
        <span className="font-display text-xl text-tinta">{u.proTitle}</span>
        <p className="max-w-[56ch] text-[14px] leading-relaxed text-anil">{u.proText}</p>
      </div>
      <span className="inline-flex w-fit shrink-0 items-center gap-2 border border-azul px-5 py-2.5 font-mono text-[12px] uppercase tracking-[0.14em] text-azul">
        {u.proCta}
        <span className="border border-azul/50 px-1.5 py-0.5 text-[9px] tracking-[0.1em] text-azul/80">{u.proTag}</span>
      </span>
    </aside>
  )
}
