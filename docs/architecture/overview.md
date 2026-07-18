# Visão Arquitetural

```
apps/web (Next.js)          ──┐
apps/mobile (Expo, Fase 4)  ──┤  consomem
apps/worker (PDF, Fase 5)   ──┘
                                ▼
packages/numerology-application   use cases (CalculateChart, ...)
                                ▼
packages/numerology-domain        TS PURO: entidades, VOs, engines, registry, traço
                                ▼
packages/shared-kernel            Result, LocalizedText, primitivos
```

Dependências apontam sempre para dentro (R1). O domínio não conhece framework — por isso o mesmo engine roda no browser (device-first), no React Native e em workers.

## Fluxo da Fatia 1 (100% no cliente)

1. UI (`ExpressionCalculator`) monta `CalculateChartCommand` com strings cruas.
2. `calculateChart` valida o nome via `BirthName` (política ADR-0002) e resolve o modelo no registry.
3. `pythagoreanModel.calculate` resolve a variante (ADR-0003) e chama `calculateExpression`.
4. O engine devolve `CalculationTrace` — passos, regras, divergências, versão do engine.
5. A UI renderiza o traço: tabela destacada, somas, cadeias de redução, regras, notas de divergência.

Nenhuma requisição de rede carrega dado pessoal — não há backend nesta fatia.

## Pontos de extensão

- **Nova escola**: `src/models/<escola>/` + registro no registry (critério objetivo de plugabilidade).
- **Novo número**: novo cálculo dentro da escola, exposto em `supportedNumbers`.
- **Interpretações**: port `InterpretationProvider` (Fase 2, textos curados; Fase 10, adapter LLM).
