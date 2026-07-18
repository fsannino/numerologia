# ADR-0003 — Variantes de redução do número de Expressão (Pitagórico)

**Status:** aceita · **Data:** 2026-07-18

## Contexto

Existem dois métodos difundidos para a Expressão pitagórica, e eles podem divergir no resultado e nas dívidas cármicas detectadas:

- **A. `reduce-words-then-sum`** — soma as letras de cada palavra do nome, reduz cada palavra (preservando mestres 11/22/33), soma os valores reduzidos e reduz o total.
- **B. `sum-all-then-reduce`** — soma todas as letras do nome inteiro e reduz o total de uma vez.

A spec (§4.3) proíbe resolver isso com `if` escondido: diferenças de método dentro da mesma escola são **variantes explícitas configuráveis**, e o traço registra qual foi usada.

## Decisão

- O engine pitagórico recebe `variant: 'reduce-words-then-sum' | 'sum-all-then-reduce'`; **default `reduce-words-then-sum`** (prática predominante nas escolas pitagóricas modernas, preserva mestres por palavra).
- A variante usada consta no `CalculationTrace` (campo `ruleRefs` + passo de soma).
- **Números mestres** (11, 22, 33) interrompem a redução em qualquer etapa.
- **Dívidas cármicas** (13, 14, 16, 19) são detectadas nos **totais brutos antes de cada redução** (por palavra e no total), inclusive as "ocultas" — reduzir cedo demais destrói essa informação, por isso `NumerologyValue` carrega bruto + reduzido + cadeia + flags.

## Consequências

- A UI pode oferecer o comparador de variantes sem mudança no domínio.
- Mapas antigos permanecem reproduzíveis: o traço grava variante + versão do engine.

## Alternativas consideradas

- **Escolher um método único e silencioso:** contraria o posicionamento epistêmico do produto (§9) — rejeitada.
