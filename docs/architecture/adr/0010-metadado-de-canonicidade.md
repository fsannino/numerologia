# ADR-0010 — Canonicidade e padronização como metadado exibido de cada escola

**Status:** aceita · **Data:** 2026-07-19

## Contexto

O produto vai ganhar escolas cuja característica definidora é a **falta de padronização na fonte** — a Numerologia Cabalística latina (tabela letra→número não padronizada entre autores) e os 231 Portões (estrutura canônica no *Sefer Yetzirah*, mas sem método canônico de aplicação a um nome). Colocá-las lado a lado com a pitagórica e a Gematria, sem sinalização, trataria todas como igualmente estabelecidas — o que é **mentir por omissão**. A postura §9 (reflexão, honestidade epistêmica) exige o contrário: expor o grau de lastro de cada escola é diferencial de produto, não ressalva legal.

Isto não é específico das cabalísticas: toda escola tem um grau de lastro histórico e de padronização. O metadado é, portanto, transversal — parte do contrato de toda `NumerologyModel`.

## Decisão

1. **Dois eixos no `ModelMetadata`, obrigatórios (não opcionais):**
   - `canonicity`: `documented-tradition` | `modern-systematization` | `contemporary-construction` — quão documentada é a origem.
   - `standardization`: `standardized` | `variant-dependent` | `unstandardized` — quão convergente é o método entre fontes.
   Serem **obrigatórios** força cada escola a se declarar em tempo de compilação: impossível registrar uma escola e omitir sua honestidade.
2. **Backfill das 5 escolas existentes**, com avaliação curada e defensável:
   - Pitagórica, Caldaica → `modern-systematization` / `standardized` (sistematização de fim do séc. XIX/XX, mas com tabela e método convergentes).
   - Gematria → `documented-tradition` / `variant-dependent` (tradição hebraica antiga; a transliteração latino→hebraico é ambígua, ADR-0008).
   - Lo Shu → `documented-tradition` / `standardized` (tradição chinesa; o quadrado 4-9-2/3-5-7/8-1-6 é fixo).
   - Védica → `documented-tradition` / `standardized` (Ank Jyotish; Moolank/Bhagyank e a regência planetária são convergentes).
3. **A UI exibe o metadado**, sempre, em um selo por escola (`SchoolProvenanceBadge`), com tom de cor por solidez (tradição/padronizado = verde; sistematização/variante = âmbar; construção contemporânea/não-padronizada = âmbar/vermelho). Um teste do registry afirma que toda escola registrada declara valores válidos nos dois eixos.

## Consequências

- Quando a Cabalística latina (`modern-systematization` / `unstandardized`) e os 231 Portões (`documented-tradition` na estrutura, `contemporary-construction` na aplicação / `unstandardized`) entrarem, o selo já as sinaliza corretamente — sem mudança de UI, só o metadado da escola nova.
- A honestidade deixa de ser um texto de rodapé genérico e vira **estrutura por escola**, comparável na matriz.

## Alternativas consideradas

- **Campos opcionais:** permitiriam uma escola omitir a autodeclaração — exatamente o buraco que queremos fechar. Rejeitada.
- **Só um texto de disclaimer global:** não distingue pitagórica de cabalística, que é o ponto. Rejeitada.
- **Deixar para quando a cabalística entrar:** o metadado vale para todas as escolas; introduzi-lo antes, isolado, de-risca as duas fatias seguintes e já entrega valor. Preferida.
