# Plano de Implementação — Fatias Verticais (Tracer Bullets)

Cada fatia é end-to-end (UI → aplicação → domínio → volta) e entrega valor demonstrável. Nenhuma fatia constrói camada inteira "para depois".

## Fatia 1 — Tracer bullet ✅ (implementada neste repositório)

**Entrega:** Pessoa + modelo Pitagórico + número de Expressão, com passo a passo educacional completo na web, 100% no cliente (device-first).

- Monorepo Turborepo + pnpm, TypeScript strict.
- `packages/shared-kernel`: `Result<T,E>`, `LocalizedText`, IDs tipados.
- `packages/numerology-domain` (TS puro, zero framework): VOs (`BirthName`, `NumerologyValue`, `ReductionChain`), política de normalização de nomes, contrato `NumerologyModel`, registry, traço (`CalculationTrace`), engine pitagórico com variante explícita de redução.
- `packages/numerology-application`: use case `CalculateChart`.
- `apps/web`: Next.js App Router + Tailwind; formulário → cálculo no cliente → render educacional (tabela de conversão, soma por palavra, cadeia de redução, regras aplicadas, flags de mestre/dívida cármica) + disclaimer epistêmico (§9).
- Testes: Vitest com fixtures conferidas manualmente + propriedade (fast-check) para invariantes de redução. Cobertura do domínio ≥ 90%.
- CI: typecheck, testes, build.

**Critério de aceite:** digitar um nome e ver o valor final *e* cada passo que o produziu, sem nenhuma chamada de rede com dado pessoal.

## Fatia 2 — Núcleo pessoal (em andamento)
- **2a — Números do nome ✅**: Motivação (vogais), Impressão (consoantes), Número Chave; variante explícita do Y (`y-classification`, ADR-0004); dimensão `name-reduction` generalizada; teste de consistência cruzada (vogais + consoantes = total).
- **2b — Números da data ✅**: `LocalDate` puro sem timezone (ADR-0005), Destino com variante `life-path-reduction`, Psíquico, Missão; data opcional com erro explícito `missing-birth-date`.
- **2c — Grade do nome ✅ (parcial)**: Lições Cármicas, Tendências Ocultas e Subconsciente via passo `grid-analysis` (ADR-0006); dívidas ocultas já cobertas pelos `karmic-check` dos números. **Pendente**: Ciclos de Vida, Pináculos, Desafios e Ano/Mês/Dia Pessoal.
- **2d — i18n (pendente)**: UI pt-BR/es/en (o domínio já emite `LocalizedText`).
- **2e — Auth + efêmero + `usage_counters` + entitlements (pendente — aguarda projeto Supabase)**. Trial de 3 leituras pós-cadastro (ver avaliação, risco 2).
- Ciclos/Pináculos/Desafios e Ano/Mês/Dia Pessoal ficam para complemento da 2c.

## Fatia 3 — Pluralidade
Engine Caldeu (número composto como saída de primeira classe); seleção múltipla de modelos; matriz comparativa com explicação automática de divergência.

## Fatia 4 — Mobile
App Expo com paridade e cálculo offline; ADR de framework de teste mobile (Maestro × Detox); backup cifrado exportável.

## Fatia 5 — Profissional
Carteira de clientes; persistência server-side com RLS por `professional_id` + suíte de testes de acesso cruzado; DPA no onboarding; audit trail append-only; PDF detalhado com marca própria; ADR de envelope encryption; RIPD/DPIA.

## Fatia 6 — Sujeitos
Casal/sinastria, casamento, empresa, nome alternativo (delta vibracional), evento/data.

## Fatia 7 — Educacional
Modo aprendiz com conferência de cálculo manual, trilhas, glossário navegável, PDF didático.

## Fatia 8 — Esotéricos
Gematria com transliterações múltiplas candidatas, Lo Shu (renderer de grade), védico.

## Fatia 9 — Monetização
Ligar billing (estrutura de planos/cupons 0–100% existente desde a Fase 2 sob feature flag).

## Fatia 10 — IA (v2)
`InterpretationProvider` ganha adapter LLM; números sem PII no prompt; saída validada por schema; rotulada na UI.
