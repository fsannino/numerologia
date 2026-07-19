# ADR-0011 — Cabalística latina: delegar a aritmética e expor a Matriz de Leituras

**Status:** aceita · **Data:** 2026-07-19

## Contexto

A Numerologia Cabalística (adaptação latina de princípios da Cabala) tem um defeito de origem: **não existe tabela letra→número única** entre autores. Circulam a sequencial 1–9 (idêntica à pitagórica) e a de afinidade fonética 1–8 (como a caldaica); e há duas reduções concorrentes (decimal 1–9 preservando mestres; arcano 1–22, os 22 caminhos da Árvore da Vida). Para o **mesmo nome**, a escola produz **várias respostas simultâneas**, todas legítimas segundo alguma fonte. Escolher uma em silêncio embutiria uma mentira no produto (§9, §2.1).

Duas das três "tabelas" **já existem no núcleo** (a sequencial É a pitagórica; a 1–8 É a caldaica). Reescrevê-las violaria R4.

## Decisão

1. **Modelar a ambiguidade, não resolvê-la.** A escola sempre computa **todas** as leituras (2 tabelas × 2 reduções = 4) e as expõe na **Matriz de Leituras** — nunca uma resposta única. Não há variante com "default silencioso"; a pluralidade é o resultado. (Por isso `variantDimensions: []`: não há uma escolha a fazer no motor — a UI é que deixa o usuário *fixar* uma leitura.)
2. **Delegar a aritmética, não re-encodar tabelas.** A cabalística importa `PYTHAGOREAN_LETTER_VALUES` e `CHALDEAN_LETTER_VALUES` (fonte única de verdade, R4) e aplica sua própria redução. A **detecção de coincidência é dinâmica e provada**: computa-se o número que a escola de referência exibe (Expressão pitagórica no default `reduce-words-then-sum`; Expressão caldaica) e compara-se com a leitura; a etiqueta "≡ Pitagórica / ≡ Caldaica" só aparece quando os números realmente batem. Onde não batem (ex.: um mestre aparece na redução), não há etiqueta — nada é presumido.
3. **Redução arcano (mod 22)** é a única aritmética própria: `((total − 1) mod 22) + 1`, em `value-objects/arcano.ts`. Exibida **apenas como número 1–22, sem significado** — não há fonte citável de leitura por arcano, e inventá-la violaria §9. O nome do arcano/caminho entra depois, só com fonte versionada.
4. **Só o nome.** A escola não usa data de nascimento (a Cabala trata o nome como expressão da alma) — `supportedNumbers` não inclui nenhum número de data. A UI diz *por quê*, não apenas oculta.
5. **Escalar honesto no card.** Como não há "a" resposta, o `finalValue` é o **número de leituras distintas** (resumo estrutural, no espírito da contagem da Lo Shu). O card lidera com a frase de pluralidade + a matriz; o passo de traço `reading-matrix` (visual `reading-matrix`) carrega as células com proveniência.

## Consequências

- Quinta validação... na verdade **sexta escola** no registry, núcleo intacto (só o vocabulário aberto: um `NumberKind`, um `ModelId`, um `CalculationStep`). A cabalística *importa* pitagórica/caldaica — acoplamento de composição deliberado, que é o que torna a coincidência provável em vez de presumida.
- A coincidência com escolas estabelecidas deixa de ser constrangimento e vira **feature didática** (nota de divergência §2.4): "aqui o número é o mesmo; a diferença está na interpretação".
- O metadado de canonicidade (ADR-0010) já marca a escola como `modern-systematization` / `unstandardized` — a Matriz de Leituras é a consequência visível dessa honestidade.

## Alternativas consideradas

- **Re-encodar as três tabelas dentro de `kabbalistic/`:** duplicação (R4), e a coincidência viraria presunção estrutural em vez de fato comparado — rejeitada.
- **Escolher uma tabela/redução como default:** contraria §2.1/§9 frontalmente — rejeitada.
- **Inventar leituras por arcano:** fabricação de doutrina sem fonte (§9) — rejeitada; arcano fica como número puro até haver fonte citável.
- **Incluir já a tabela hebraica (Gematria) como terceira linha:** a Gematria é ela própria um espectro (transliteração ambígua, ADR-0008); integrá-la como leitura da matriz fica para uma fatia seguinte, apontando para a escola Gematria.
