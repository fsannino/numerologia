import { ChartCalculator } from '@/components/features/chart-calculator'

export default function HomePage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-indigo-900">Numerus</h1>
        <p className="text-slate-600">
          Numerologia multi-modelo, interativa e educacional. Todo número pode ser aberto: você vê a
          tabela usada, a soma, a redução e a regra que justificou cada passo.
        </p>
        <p className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-900">
          <span aria-hidden>🔒</span> O cálculo roda 100% neste dispositivo — seu nome não é enviado a
          nenhum servidor.
        </p>
      </header>

      <ChartCalculator />

      <footer className="border-t border-slate-200 pt-4 text-xs leading-relaxed text-slate-500">
        <p>
          O Numerus é uma ferramenta de estudo, autoconhecimento e entretenimento cultural. Não
          substitui aconselhamento médico, psicológico, jurídico ou financeiro. O sistema de conversão
          de nomes praticado hoje foi estruturado no fim do séc. XIX / início do XX (L. Dow Balliett,
          Juno Jordan), reivindicando a herança pitagórica — cada escola exibe sua origem histórica
          real.
        </p>
      </footer>
    </main>
  )
}
