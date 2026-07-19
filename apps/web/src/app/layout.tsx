import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { bodyFont, displayFont, monoFont } from './fonts'
import './globals.css'

// Render dinâmico: necessário para o CSP com nonce por requisição aplicado
// pelo middleware alcançar os scripts injetados pelo Next (spec §5).
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Numerus — numerologia com a conta à mostra',
  description:
    'Ferramenta de estudo e autoconhecimento: todo número calculado mostra o passo a passo que o produziu. Seus dados nunca saem do seu dispositivo.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable}`}>
      <body className="min-h-screen bg-papel text-tinta antialiased">{children}</body>
    </html>
  )
}
