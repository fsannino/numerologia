# ADR-0006 — Grade do nome dentro do contrato de traço

**Status:** aceita · **Data:** 2026-07-18

## Contexto

Lições Cármicas (dígitos 1–9 ausentes), Tendências Ocultas (dígitos repetidos 3+) e Subconsciente (nº de dígitos distintos) derivam da **grade de dígitos** do nome — o resultado relevante é um conjunto/tabela, não um único número. O contrato `CalculationTrace` (§3.1) tem `finalValue: NumerologyValue` escalar, e a spec antecipa o problema no Lo Shu: "produz grade, não número único — a UI precisa de um renderer próprio".

## Decisão

1. **O contrato `CalculationTrace` permanece com `finalValue` escalar.** Para os números de grade, o escalar é a contagem com significado tradicional: nº de lições, nº de tendências, e o Subconsciente — que já é, por definição da escola, o nº de dígitos distintos (1–9).
2. **Novo tipo de passo `grid-analysis`** (com `visual: 'digit-grid'`): carrega a contagem por dígito (`tally`) e os dígitos destacados (ausentes ou repetidos), dando ao renderer tudo que a grade precisa. É uma extensão do conjunto de kinds do §3.1 (o esboço da spec é declaradamente "algo como").
3. Esses números **não dependem de variante** (usam todas as letras; redução não se aplica) — `variantSelections` vazio no traço.
4. **Revisão futura consciente:** se o Lo Shu (Fase 8) exigir grade como valor de primeira classe, promover o resultado a união discriminada (`value | grid`) será uma mudança de contrato com ADR própria. Registrado aqui para não virar decisão implícita.

## Consequências

- Zero quebra nos consumidores existentes do traço; o renderer de grade é aditivo.
- O passo `grid-analysis` serve de base para o renderer do Lo Shu na Fase 8.

## Alternativas consideradas

- **União discriminada em `finalValue` agora:** mais pura, porém encarece todos os consumidores antes de existir o segundo caso de uso real (Lo Shu) — adiada com registro.
- **Relatório separado fora do traço:** quebraria a regra "não existe resultado sem traço" — rejeitada.
