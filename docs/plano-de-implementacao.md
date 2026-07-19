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
- **2c — Grade do nome e números de tempo ✅**: Lições Cármicas, Tendências Ocultas e Subconsciente via passo `grid-analysis` (ADR-0006); Ciclos de Vida, Pináculos, Desafios e Ano/Mês/Dia Pessoal via passo `timeline` com data de referência explícita (ADR-0007).
- **2d — i18n ✅**: domínio trilíngue (pt-BR/en/es) em textos didáticos, regras e variantes; UI com dicionários versionados (`src/i18n/ui-messages.ts`) e seletor de idioma. Conteúdo é recurso versionado, não string em componente.
- **2e — Auth + efêmero + `usage_counters` + entitlements (pendente — aguarda projeto Supabase)**. Trial de 3 leituras pós-cadastro (ver avaliação, risco 2).
- Ciclos/Pináculos/Desafios e Ano/Mês/Dia Pessoal ficam para complemento da 2c.

## Fatia 3 — Pluralidade ✅
Engine Caldeu (`models/chaldean/` + registro — nenhum outro arquivo do núcleo tocado, validando o critério de plugabilidade): tabela 1–8, número composto como saída de primeira classe (`finalValue.raw`), sem preservação de mestres. Seleção múltipla de escolas na UI, matriz comparativa com divergência destacada e causa explicada, células "não calcula" para capacidade não declarada, e aviso epistêmico de que convergência não é evidência (§2.4). Port evoluiu com `metadata.letterValues` para a UI exibir a tabela de qualquer escola sem importar de dentro dela.

## Fatia 4 — Mobile
App Expo com paridade e cálculo offline; ADR de framework de teste mobile (Maestro × Detox); backup cifrado exportável.

## Fatia 5 — Profissional
Carteira de clientes; persistência server-side com RLS por `professional_id` + suíte de testes de acesso cruzado; DPA no onboarding; audit trail append-only; PDF detalhado com marca própria; ADR de envelope encryption; RIPD/DPIA.

## Fatia 6 — Sujeitos (em andamento)
- **Nome alternativo / assinatura ✅**: use case `CompareSignatures` — delta vibracional entre nome de registro e nome do dia a dia.
- **Casal / Sinastria ✅**: serviço de domínio `union-numbers` (agnóstico de escola — qualquer escola nova ganha sinastria de graça, R5) + use case `BuildSynastry`. Seis números da união (Destino, Alma, Expressão, Personalidade, Missão, Chave), comparação de Anos Pessoais, marcação de convergências. Linguagem de reflexão, nunca veredito de compatibilidade (§9). Modo próprio na UI com disclaimer permanente.
- **Empresa ✅**: agregado `CompanySubject` via use case `CalculateCompanyChart` — identidade corporativa (razão social), marca (nome fantasia), harmonia marca↔razão, destino corporativo (data de constituição) e afinidade opcional com sócio. Reusa o primitivo `combineReducedValues` (compartilhado com a sinastria). Modo próprio na UI, disclaimer §9.
- **Casamento ✅**: use case `CalculateMarriageChart` — número regente da união formal (`marriage-governing`, Caminho de Vida da data do casamento) e Ano Pessoal do casamento (`marriage-personal-year`), reusando a sinastria do casal + as funções de data (R4: redução de datas não é duplicada, apenas re-rotulada para o contexto de casamento). Modo próprio na UI.
- **Fatia 6 completa** exceto Evento/data (a menor pendência; vibração de uma data específica).

## Fatia 7 — Educacional (em andamento)
- **Análise de cada número ✅ (base)**: port `InterpretationProvider` (definido desde já, §11 decisão 3, sem adapter de LLM) + adapter de **conteúdo curado** (`curatedInterpretationProvider`): reflexão por vibração (1–9 + mestres) × enquadramento por tipo de número, trilíngue, rotulada na UI como "conteúdo curado — não é veredito" (§9). Camada separada do cálculo. A Fase 10 pluga um adapter de IA no mesmo port sem refatorar.
- **Pendente**: análise de grupo por método e análise comparativa interpretativa (dependem da IA, Fase 10); modo aprendiz, trilhas, glossário navegável, PDF didático.

## Fatia 8 — Esotéricos ✅
- **Lo Shu ✅**: terceira escola no registry (`models/lo-shu/` + registro — núcleo intacto), a primeira que produz uma **grade** em vez de número único. Dígitos da data no quadrado mágico 4-9-2/3-5-7/8-1-6, com detecção de setas de força/ausência (§9: qualidade a desenvolver, não veredito). Novo passo de traço `lo-shu-grid` (visual `lo-shu`) e renderer 3×3 na UI.
- **Gematria ✅**: quarta escola (`models/gematria/` + registro — núcleo intacto). Valores das letras hebraicas (mispar hechrachi); transliteração latino→hebraico **ambígua exposta como múltiplas candidatas** por letra + espectro min/padrão/máx + nº de combinações — nunca resposta silenciosa (ADR-0008, §2.1/§4.3/§9). Novo passo de traço `transliteration` (visual `transliteration`) e renderer na UI com hebraico RTL.
- **Védica ✅**: quinta escola (`models/vedic/` + registro — núcleo intacto). Derivada de data: **Moolank** (número raiz, o dia reduzido) e **Bhagyank** (número do destino, a data completa reduzida), cada dígito 1–9 regido por uma **graha** (planeta): Sol, Lua, Júpiter, Rahu, Mercúrio, Vênus, Ketu, Saturno, Marte. Não preserva mestres (como a caldaica, por motivo próprio) — quando a leitura ocidental pararia num mestre, a divergência é registrada (§2.4). Novo passo de traço `planetary-ruler` (visual `planetary-ruler`) e renderer na UI. Qualidades do planeta são reflexão, nunca veredito (§9, ADR-0009).

## Fatia 9 — Monetização
Ligar billing (estrutura de planos/cupons 0–100% existente desde a Fase 2 sob feature flag).

## Fatia 10 — IA (v2)
`InterpretationProvider` ganha adapter LLM; números sem PII no prompt; saída validada por schema; rotulada na UI.
