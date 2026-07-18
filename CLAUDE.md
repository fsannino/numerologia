# CLAUDE.md — regras para agentes neste repositório

Aplique o playbook `collabz-craftsmanship` (R1–R16) em qualquer mudança. Regras específicas deste produto:

1. **Traço obrigatório**: nenhum caminho de código pode produzir um número final sem produzir `CalculationTrace` (§3.1 da spec em `docs/`). O traço é valor de retorno do domínio, não log.
2. **`packages/numerology-domain` é TypeScript puro**: proibido importar framework, DOM ou API de Node. É isso que garante "regra escrita uma vez" para web, mobile e worker.
3. **Device-first**: na persona pessoal, nome/data de nascimento jamais entram em handler HTTP, log, cache persistente ou banco. Não crie endpoint que receba esses campos.
4. **Nova escola numerológica** = diretório novo em `src/models/` + entrada no registry. Se precisar tocar em qualquer outro arquivo do núcleo, o design está errado — pare e revise.
5. **Variantes de método são explícitas** (`variantSelections`), nunca `if` escondido; o traço registra a variante usada (ADR-0003).
6. **Ambiguidade nunca vira chute**: retorno múltiplo ou erro tipado (`Result<T,E>`). Nunca descarte silencioso de caracteres de nome (ADR-0002).
7. **Nunca** `utils.ts`, regra de numerologia em componente React, exceção engolida, `console.log`, ou texto determinista/fatalista em conteúdo do produto (§9: linguagem de reflexão, não veredito).
8. **Testes**: fixtures de numerologia conferidas manualmente (documente a conta no comentário) + propriedades (fast-check). Cobertura ≥ 90% no domínio.
9. Decisão arquitetural nova → ADR em `docs/architecture/adr/` antes do merge.
