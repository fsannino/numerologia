# Avaliação de viabilidade — Numerus como semente da Veridia

**Data:** 2026-07-20 · **Base:** PRD-01 (v1), PRD-02 (Arquitetura), PRD-03
(Especificação Funcional) da plataforma Veridia, avaliados contra o estado real
do repositório `numerologia`.

> No espírito da casa: sem veredito fácil, com a conta à mostra. Este documento
> avalia *viabilidade*, não executa mudança nenhuma.

## 1. Veredito

**É viável, e a fundação é melhor do que "compatível" — é praticamente ideal.**
Mas não é uma "mudança": é uma **multiplicação de escopo** (de ~1 módulo para
~10) com **um conflito arquitetural duro** a decidir antes de qualquer código
(ver ADR-0013). E os PRDs, hoje, são *estrutura* (listas de tópicos), não
*especificação implementável* — eles mesmos dizem isso ("deve ser expandido
futuramente").

A Veridia é uma plataforma de conhecimento com ~10 módulos. O **Numerus já é o
módulo "Numerologia" dela** — construído com um rigor que o próprio PRD ainda nem
especifica. A pergunta real é *"o Numerus pode virar a semente da Veridia?"* — e a
resposta é sim.

## 2. O que já está pronto (a semente vale muito)

Estado do repo hoje: monorepo Turborepo + pnpm; 1 app (`web`, Next.js + React +
TS + Tailwind v4); 3 pacotes (`numerology-domain` TS puro, `numerology-application`,
`shared-kernel`); 7 escolas no registry; 12 ADRs; threat-model; design system;
i18n PT/EN/ES; CSP com nonce. **Zero** dependências de back-end, banco ou auth.

| Pilar da Veridia (PRD-02/03) | Estado no Numerus |
|---|---|
| Arquitetura orientada a domínio, modular | ✅ núcleo TS puro, "regra escrita uma vez" |
| Next.js + React + TS + Tailwind | ✅ (falta só `shadcn/ui`, aditivo) |
| Dark mode, i18n, WCAG, Core Web Vitals | ✅ paleta noturna, PT/EN/ES, a11y, CSP |
| Numerologia (perfil, nome, data, comparações) | ✅ 7 escolas, matriz, variantes explícitas |
| Cabala (Árvore da Vida, correspondências) | 🟡 parcial — 231 Portões + escola cabalística |
| "IA com fontes rastreáveis / explicável" | 🟡 a *filosofia* já existe: `CalculationTrace` é RAG-com-citação aplicado |
| Manifesto ("ferramentas, não respostas absolutas") | ✅ é a alma do Numerus ("instrumento, não oráculo") |

**Ativo estratégico principal:** não é o código de numerologia — é a **DNA
epistêmica** (traço + selo de canonicidade + "sem veredito"). O PRD-01 vende
exatamente isso ("Transparência", "Fontes rastreáveis", "Explicabilidade"). O
Numerus já provou esse padrão num módulo; ele deve virar o **padrão transversal**
de Cabala, Tarot e IA.

## 3. Conflito duro nº 1 — decidir antes de tudo

**Device-first × `NumerologyProfile` no banco.** O CLAUDE.md §3 proíbe PII de
leitura pessoal em servidor; PRD-03 §5 e PRD-02 §5 pedem perfil/histórico/
`NumerologyProfile` persistidos. Contradição frontal, resolvível pela bifurcação
de persona já esboçada nas "duas trilhas" (PR #17). Ver **ADR-0013** (proposta) —
é o gargalo que trava o resto.

## 4. O que é 100% novo — esforço/risco

Ordenado por peso (nada disso existe hoje):

1. **IA + RAG (Ollama + ChromaDB + embeddings)** — 🔴 maior frente e maior risco.
   Back-end inteiro + custo de operação + LGPD (conteúdo indo ao LLM).
   Filosoficamente alinhado (citação = mesmo DNA do traço), operacionalmente pesado.
2. **CMS editorial** (rascunho→revisão→aprovação→publicação, versionamento,
   exclusão lógica, auditoria) — 🔴 é um CMS completo.
3. **Auth + RBAC (6 papéis) + MFA/OAuth** — 🟠 grande, mas caminho batido
   (Supabase Auth cobre OAuth2/OIDC/MFA/social login do PRD).
4. **Biblioteca com busca semântica** — 🟠 acopla ao vetor DB (item 1).
5. **Academy** (cursos/trilhas/certificados) e **Comunidade** (fóruns/moderação/
   reputação) — 🟠 cada um é um produto por si.
6. **Tarot** — 🟢 menor, *se* mantiver a disciplina epistêmica (educativo/
   estrutural, não adivinhação — como nos 231 Portões).
7. **Observabilidade, Redis, Object Storage, API Gateway, Stripe** — 🟢 infra
   padrão, incremental.

## 5. Riscos e tensões

- **Filosófico (marca):** Tarot e "IA que responde" flertam com o veredito que o
  §7 proíbe. Viável sob "reflexão, não profecia" — exige a mesma régua em *todo*
  módulo, senão a Veridia dilui o que a torna confiável.
- **LGPD:** vira central com contas + IA + histórico. O threat-model atual
  pressupõe device-first (superfície mínima); a Veridia amplia a superfície.
- **Custo/operação:** Ollama self-host × API (este ambiente já tem Anthropic) é
  decisão de custo e privacidade, não só técnica.
- **Escopo × realidade:** trabalho de vários trimestres / mais de uma pessoa.
  Tecnicamente viável; caro em tempo. O roadmap do PRD é sensato, e o Numerus já
  está *à frente* dele na numerologia.

## 6. Caminho recomendado

1. **Ratificar o ADR-0013** (device-first × contas) — sem isso, nada server-side
   de numerologia começa certo.
2. **Auth + RBAC (Supabase)** como fundação transversal — destrava histórico,
   perfis e a trilha profissional já prometida na UI.
3. **Extrair a "DNA epistêmica"** (traço + selos + fontes) para um contrato
   transversal; só então plugar Cabala/Tarot/Biblioteca sob ele.
4. **IA/RAG por último** dentro da Fase 1 do PRD — onde mais coisa pode dar
   errado; melhor com auth/observabilidade de pé.

## 7. O que depende de você

- **É absorção ou reescrita?** A Veridia adota o Numerus como módulo
  (recomendado), ou é projeto novo que só se inspira nele?
- **Resolução do conflito device-first** (ADR-0013: cifrado no cliente? opt-in?
  só na trilha profissional? só-local como Fase 1?).
- **IA: self-host (Ollama) ou API?** — muda custo, privacidade e infra.
- **Time e horizonte** — define se faseamos em meses ou trimestres.

## 8. Limites desta avaliação

Os PRDs são estruturais (listas), não especificações com casos de uso, regras
detalhadas, contratos de API ou critérios de aceite por módulo — os próprios
documentos preveem esse detalhamento futuro. Estimativas de esforço aqui são de
ordem de grandeza, não orçamento. Uma estimativa fina exige spec por módulo
(começando pelo que for priorizado: Auth ou IA/RAG são os candidatos naturais).
