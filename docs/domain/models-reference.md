# Referência das escolas — origem histórica e fontes

Fonte de verdade **documental** das escolas numerológicas do Numerus. Cada entrada
espelha o `metadata` do modelo no código (`historicalOrigin`, `sources`,
`canonicity`, `standardization`) — este documento não introduz fatos que o código
não afirme. A honestidade sobre origem e padronização é requisito de produto (§9,
ADR-0010): tratar todas as escolas como igualmente estabelecidas seria mentir por
omissão.

## Legenda de honestidade (ADR-0010)

- **Canonicidade** — `documented-tradition` (tradição com fonte textual/histórica) · `modern-systematization` (sistematização moderna reivindicando herança antiga) · `contemporary-construction` (construção contemporânea sem autoridade textual).
- **Padronização** — `standardized` (fontes convergem) · `variant-dependent` (método definido, variantes explícitas) · `unstandardized` (sem tabela/método único).

---

## Pitagórica

- **Origem.** Sistema moderno estruturado no fim do séc. XIX / início do XX por **L. Dow Balliett** e **Juno Jordan**, reivindicando a herança de Pitágoras. É o modelo mais difundido no Ocidente.
- **Método.** Tabela latina 1–9 por posição alfabética. Expressão (todas as letras), Motivação (vogais), Impressão (consoantes), Número Chave (primeiro nome); Destino/Psíquico/Missão pela data; grade do nome e números de tempo.
- **Fontes.** L. Dow Balliett, *The Philosophy of Numbers* (1908); Juno Jordan, *Numerology: The Romance in Your Name* (1965).
- **Honestidade.** `modern-systematization` / `standardized`. O rótulo "pitagórica" é reivindicação de herança, não atribuição histórica direta a Pitágoras — o rodapé do produto diz isso.

## Caldaica

- **Origem.** Tradição atribuída à Caldeia/Babilônia; a forma moderna foi popularizada por **"Cheiro"** (Louis Hamon) no início do séc. XX.
- **Método.** Tabela 1–8 por afinidade fonética; **nenhuma letra vale 9** (considerado sagrado). O **número composto** (total antes da redução) é saída de primeira classe; a redução não preserva mestres.
- **Fontes.** Cheiro, *Cheiro's Book of Numbers* (1926).
- **Honestidade.** `modern-systematization` / `standardized`.

## Lo Shu (chinesa)

- **Origem.** Numerologia chinesa baseada no **quadrado mágico Lo Shu** (4-9-2 / 3-5-7 / 8-1-6), atribuído ao mito do rio Luo.
- **Método.** Os dígitos da data de nascimento são posicionados no quadrado; lê-se presença, ausência e repetição, além de setas de força/ausência. Produz uma **grade**, não número único.
- **Fontes.** Tradição do quadrado Lo Shu (numerologia chinesa).
- **Honestidade.** `documented-tradition` / `standardized`. As setas são convite a desenvolver uma qualidade, não veredito (§9).

## Gematria (hebraica)

- **Origem.** Gematria hebraica clássica — as letras hebraicas *são* números (*mispar hechrachi*: א=1 … ת=400).
- **Método.** Soma dos valores das letras. Nomes latinos exigem **transliteração latino→hebraico, ambígua por natureza** (ADR-0008): cada letra tem 1+ candidatas, e o traço expõe o espectro mín/padrão/máx + nº de combinações — nunca uma resposta silenciosa.
- **Fontes.** Gematria hebraica clássica (*mispar hechrachi*).
- **Honestidade.** `documented-tradition` / `variant-dependent` (a transliteração é reconstrução).

## Védica (indiana)

- **Origem.** Numerologia védica (**Ank Jyotish**), da tradição da astrologia indiana.
- **Método.** Da data: **Moolank** (número raiz, o dia reduzido) e **Bhagyank** (destino, a data completa reduzida). Cada dígito 1–9 é regido por uma **graha** (planeta): Sol, Lua, Júpiter, Rahu, Mercúrio, Vênus, Ketu, Saturno, Marte. Reduz sempre a 1–9 (sem mestres).
- **Fontes.** Ank Jyotish (numerologia védica / indiana).
- **Honestidade.** `documented-tradition` / `standardized`. As qualidades do planeta são vocabulário de reflexão, nunca veredito (§9, ADR-0009).

## Cabalística (adaptação latina)

- **Origem.** Adaptação moderna de princípios da **Cabala** (tradição mística judaica; 22 letras hebraicas e a Árvore da Vida) ao alfabeto latino.
- **Método.** **Não há tabela única entre autores** — o produto expõe a **Matriz de Leituras** (tabela `sequential-1-9` | `chaldean-like-1-8` × redução `decimal` | `arcano mod-22`), delegando a aritmética às tabelas pitagórica/caldaica e provando coincidência por comparação. Opera só sobre o nome.
- **Fontes.** Adaptação latina de princípios cabalísticos (Trevisani; C. Rosa); *Sefer Yetzirah* (22 caminhos da Árvore da Vida).
- **Honestidade.** `modern-systematization` / **`unstandardized`**. O arcano é exibido só como número, sem significado inventado (§9, ADR-0011).

## 231 Portões (Sefer Yetzirah)

- **Origem.** Os **231 portões** do *Sefer Yetzirah* (2:4): as combinações de pares das 22 letras hebraicas — C(22,2) = 231. Doutrina **cosmogônica** (a combinação das letras na criação), não análise de nome pessoal.
- **Método.** Explorador **estrutural**: os 231 portões são derivados do alfabeto; o nome "ativa" um subconjunto por um **modo não-canônico** (`distinct-letter-pairs` | `adjacent-pairs`). **Zero leitura por portão** — exibe estrutura, valores e a referência.
- **Fontes.** *Sefer Yetzirah* 2:4 (estrutura). A aplicação a um nome não tem fonte canônica.
- **Honestidade.** `contemporary-construction` / `unstandardized` (ADR-0012).

---

## 8ª escola — slot aberto

A avaliação da spec (`docs/avaliacao-da-especificacao.md`) previa **8 escolas** para a v1. Sete estão implementadas; a oitava **não foi identificada** na spec commitada. O slot fica aberto: quando definida, entra como um diretório novo em `src/models/` + uma linha no registry (critério de plugabilidade), com sua entrada aqui e no glossário.
