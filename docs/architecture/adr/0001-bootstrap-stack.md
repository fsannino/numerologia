# ADR-0001 — Bootstrap: monorepo TS, motor de cálculo em TypeScript puro no cliente

**Status:** aceita · **Data:** 2026-07-18

## Contexto

A spec exige um único domínio compartilhado entre web e mobile, device-first na persona pessoal (nenhum dado pessoal no servidor) e cálculo offline no mobile. Havia alternativa de núcleo em Rust/WASM.

## Decisão

- **Monorepo Turborepo + pnpm**, TypeScript `strict` em todos os pacotes.
- **Motor de cálculo em TypeScript puro** (`packages/numerology-domain`), sem dependência de framework, DOM ou Node — roda idêntico em browser, React Native e worker. Guardado por lint de dependências (o `package.json` do domínio não declara nenhuma dependência de runtime além do `shared-kernel`).
- O cálculo da persona pessoal executa **no cliente**; nenhum handler HTTP recebe nome ou data de nascimento.
- Web: Next.js App Router + Tailwind. Estado de servidor via TanStack Query quando existir backend (não há na Fatia 1).

## Consequências

- "Escreva a regra uma vez" garantido pela pureza do pacote de domínio.
- Rust/WASM fica adiado; só se performance de comparação em massa ou proteção de IP virarem requisito (nova ADR).
- O bundle do cliente carrega o motor — aceitável: o engine pitagórico completo tem poucos KB.

## Alternativas consideradas

- **Rust + WASM/FFI:** performance desnecessária para v1; custo alto de toolchain e de contratação; quebraria a velocidade das fatias.
- **Cálculo no servidor:** contradiz o requisito device-first e criaria superfície LGPD sem necessidade.
