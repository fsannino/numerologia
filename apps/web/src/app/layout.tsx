import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'

// Render dinâmico: necessário para o CSP com nonce por requisição aplicado
// pelo middleware alcançar os scripts injetados pelo Next (spec §5).
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Numerus — numerologia transparente',
  description:
    'Ferramenta de estudo e autoconhecimento: todo número calculado mostra o passo a passo que o produziu. Seus dados nunca saem do seu dispositivo.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">{children}</body>
    </html>
  )
}
