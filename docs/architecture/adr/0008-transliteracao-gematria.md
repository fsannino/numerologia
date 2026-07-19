# ADR-0008 — Transliteração latino→hebraico da Gematria: candidatas, nunca chute

**Status:** aceita · **Data:** 2026-07-19

## Contexto

A Gematria usa os valores das letras hebraicas. Nomes latinos precisam de transliteração latino→hebraico, que é **ambígua por natureza** (§2.1): `C` pode virar kaf (20), qof (100) ou samekh (60); `S` pode ser samekh (60) ou shin (300); vogais têm tratamento variável (mater lectionis). A spec é dura (§4.3, §9): o engine deve **retornar múltiplas candidatas com seus valores, nunca uma única resposta silenciosa**, e a UI deve expor que é uma reconstrução.

## Decisão

1. **Tabela de transliteração explícita e documentada** (`gematria/transliteration.ts`): cada letra latina mapeia para uma ou mais candidatas hebraicas, com valor e nome da letra. Letras ambíguas (A, C, E, H, K, O, S, T, X) têm 2–3 opções; as demais, uma.
2. **O engine nunca escolhe em silêncio.** O traço expõe, por letra, **todas** as candidatas. Além disso calcula três totais representativos — **padrão** (primeira opção de cada letra), **mínimo** e **máximo** — e o **número de combinações** possíveis. O usuário vê o espectro de valores, não um número único apresentado como verdade.
3. `finalValue` do traço = redução do total **padrão** (sem preservar mestres — é sistema hebraico, não ocidental), mas rotulado na UI como "transliteração padrão", com o espectro min–máx e a contagem de combinações ao lado. Regra citável + nota deixam claro que é reconstrução.
4. **Bounded por construção:** não enumeramos as combinações completas (explosão combinatória); os três totais representativos + as opções por letra dão a honestidade epistêmica sem custo combinatório.
5. Valores usados: *mispar hechrachi* (valor absoluto) das 22 letras. Vogais recebem a mater lectionis principal como candidata (א/ה/ו/י/ע), refletindo a prática — documentado como simplificação conhecida.

## Consequências

- A ambiguidade é dado de saída de primeira classe, não escondida.
- Suporte a hebraico como idioma de exibição (`he`) fica natural (Fase futura); a arquitetura de i18n já está pronta.

## Alternativas consideradas

- **Escolher uma transliteração única:** contraria §2.1/§4.3 frontalmente — rejeitada.
- **Enumerar todas as combinações:** explosão combinatória (2^k), sem ganho sobre min/padrão/máx + opções por letra — rejeitada.
