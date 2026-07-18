# ADR-0005 — Números derivados da data: LocalDate puro e variantes do Destino

**Status:** aceita · **Data:** 2026-07-18

## Contexto

Destino (Caminho de Vida), Psíquico e Missão derivam da data de nascimento. Duas armadilhas conhecidas: (1) `Date` do JS carrega timezone e produz o bug clássico de "um dia a menos"; (2) o Destino tem dois métodos difundidos que divergem em mestres e dívidas cármicas.

## Decisão

1. **`LocalDate` como VO puro** (ano/mês/dia inteiros, validação própria com bissexto, sem `Date`, sem timezone). Entrada externa apenas via `fromISO('YYYY-MM-DD')` — exatamente o que `<input type="date">` emite.
2. **Data de nascimento é opcional no agregado Pessoa** (minimização LGPD): só é exigida quando um número de data é pedido; ausência → erro explícito `missing-birth-date`, nunca cálculo parcial silencioso.
3. **Dimensão `life-path-reduction`** com variantes explícitas registradas no traço:
   - **`reduce-parts-then-sum` (default):** dia, mês e ano reduzidos separadamente (preservando mestres 11/22/33), somados e reduzidos.
   - **`sum-all-digits`:** todos os dígitos da data somados de uma vez.
4. **Inspeção de dívida cármica no Destino:** dia bruto e total final pré-redução. Valores intermediários da cadeia do ano (ex.: 1990 → 19) **não** são marcados — não há respaldo consistente nas escolas; documentado aqui para nunca virar decisão implícita.
5. **Psíquico** = redução do dia (mestres preservados; dia 13/14/16/19 marca dívida).
6. **Missão** = soma dos valores **reduzidos** de Expressão e Destino, reduzida preservando mestres; o traço herda (`variantSelections`) as variantes usadas nos dois números de origem.

## Consequências

- Datas nunca sofrem deslocamento de fuso; a validação rejeita 29/02 de ano não bissexto.
- Divergência entre métodos do Destino é exposta com explicação automática (ex.: 27/03/1990 → 4 com dívida 13 em um método, 4 sem dívida no outro).

## Alternativas consideradas

- **`Date`/`Temporal` do host:** `Date` é a fonte do bug; `Temporal` ainda exigiria política própria e quebraria a pureza mínima do domínio — rejeitados.
- **Exigir data sempre:** viola minimização (LGPD §5.1) para quem só quer números do nome — rejeitada.
