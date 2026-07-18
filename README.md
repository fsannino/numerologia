# Numerus — numerologia multi-modelo, transparente e educacional

Sistema de numerologia onde **todo número exibido mostra o passo a passo que o produziu**: a tabela usada, a soma, a cadeia de redução, a regra da escola e as divergências entre métodos. Ferramenta de estudo e autoconhecimento com honestidade epistêmica embutida na interface.

**Estado atual: Fatia 1 (tracer bullet)** — Pessoa + escola Pitagórica + número de Expressão, end-to-end na web, com cálculo 100% no dispositivo (device-first: nenhum dado pessoal chega a servidor).

## Rodando

```bash
pnpm install
pnpm test        # testes do domínio (fixtures + propriedade) e da aplicação
pnpm typecheck
pnpm dev         # web em http://localhost:3000
```

## Estrutura

| Caminho | Papel |
|---|---|
| `packages/shared-kernel` | `Result<T,E>`, `LocalizedText`, primitivos compartilhados |
| `packages/numerology-domain` | **TypeScript puro, zero framework.** VOs, política de normalização de nomes (ADR-0002), engine pitagórico, contrato `NumerologyModel`, registry, `CalculationTrace` |
| `packages/numerology-application` | Use cases (`CalculateChart`) |
| `apps/web` | Next.js App Router + Tailwind — UI educacional |
| `docs/` | Avaliação da spec, plano em fatias, ADRs, glossário, threat model |

## Princípios inegociáveis

- **O motor não retorna números — retorna cálculos.** Não existe caminho de código que produza valor final sem `CalculationTrace`.
- **Device-first**: na persona pessoal, nome e data jamais atravessam a rede.
- **Nova escola = novo diretório em `models/` + registro no registry.** Nada mais muda.
- **Ambiguidade nunca vira chute**: vira saída múltipla ou erro explícito.

Documentos de partida: [avaliação da especificação](docs/avaliacao-da-especificacao.md) · [plano de implementação](docs/plano-de-implementacao.md) · [ADRs](docs/architecture/adr/).
