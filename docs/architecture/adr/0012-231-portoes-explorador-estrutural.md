# ADR-0012 — 231 Portões: explorador estrutural, não interpretativo

**Status:** aceita · **Data:** 2026-07-20

## Contexto

Os **231 portões** do *Sefer Yetzirah* (2:4) são as combinações de pares das 22 letras hebraicas — C(22,2) = 231. A estrutura é **canônica e documentada**. Mas a doutrina é **cosmogônica** (a combinação das letras na criação), não uma análise de nome pessoal — e **não existe fonte tradicional** que estabeleça como derivar "os portões de um nome". As abordagens que circulam (pares adjacentes, pares de letras distintas) são construções contemporâneas, sem autoridade textual; e não há um corpus citável de leitura por portão (231 textos interpretativos não existem em fonte confiável).

Preencher esses vazios com significado seria fabricar doutrina — exatamente o que §9 proíbe.

## Decisão

Implementar a sétima escola como **explorador estrutural, não interpretativo**:

1. **A estrutura é derivada, nunca hardcoded.** O alfabeto de 22 letras (fato canônico, `hebrew-alphabet.ts`) é dado; os 231 portões são gerados por combinação (`allGates()` → C(22,2)), com um teste afirmando `=== 231`. Nenhuma lista de 231 entradas escrita à mão.
2. **Aplicação ao nome como construção contemporânea, explícita.** O nome é transliterado (reusando a Gematria, ADR-0008), e os portões ativados são um subconjunto por um **modo de ativação** (`distinct-letter-pairs` default | `adjacent-pairs`) — cada modo rotulado, no código e na UI, como *construção contemporânea*. O metadado da escola é `canonicity: 'contemporary-construction'` / `standardization: 'unstandardized'`.
3. **Saída é estrutura, não veredito.** Novo passo de traço `gate-structure` (visual `gates-231`) carrega os portões ativados (pares não-ordenados de letras distintas), a transliteração padrão e o total 231. O **escalar do card** é o nº de portões ativados (descritivo, 0–231), no espírito da contagem da Lo Shu.
4. **Zero texto interpretativo.** A UI exibe os portões, seus valores gemátricos e a referência *Sefer Yetzirah 2:4* — e para por aí. Se um dia houver fonte citável de leitura por portão, entra como conteúdo versionado.
5. **Testes de propriedade, não de fixture** (o briefing): 231 elementos; sem repetição; pares não-ordenados de letras distintas; N letras distintas → C(N,2) portões ativados; letras iguais não formam portão.

## Consequências

- Sétima escola no registry, núcleo intacto (só o vocabulário aberto: um `NumberKind`, um `CalculationStep`, tipos `Gate`/`HebrewLetter`). Reusa a transliteração da Gematria (composição, como a cabalística reusa as tabelas).
- Fecha a **Fatia 8 (Esotéricos)**. Restam, do roteiro de escolas, apenas a 8ª (não identificada — slot aberto).
- A honestidade da escola é estrutural: o selo de canonicidade (ADR-0010) já a marca como construção contemporânea / não padronizada.

## Alternativas consideradas

- **Escrever leituras por portão:** fabricação de doutrina sem fonte (§9) — rejeitada.
- **Hardcodear os 231 portões:** contraria "derivar da estrutura" e não se testa contra a definição — rejeitada.
- **Escolher um modo de aplicação como "o correto":** nenhum é canônico; expor os modos rotulados é mais honesto — preferida.
- **Deixar tsadi (90) de fora do alfabeto** para casar com a transliteração: apagaria uma das 22 letras canônicas; melhor manter as 22 e documentar que nomes latinos nunca ativam tsadi (limitação herdada de ADR-0008).
