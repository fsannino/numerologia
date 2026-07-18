# ADR-0007 — Números de tempo: ciclos, pináculos, desafios e ano/mês/dia pessoal

**Status:** aceita · **Data:** 2026-07-18

## Contexto

Os números de tempo derivam da data de nascimento **e de uma data de referência** ("hoje", ou qualquer data que o usuário queira estudar). Duas armadilhas: (1) o domínio não pode ler o relógio (`Date.now()` quebraria pureza e reprodutibilidade do traço); (2) ciclos/pináculos/desafios produzem uma **linha do tempo** (3–4 períodos), não um número único — mesmo problema da grade (ADR-0006).

## Decisão

1. **Data de referência é entrada explícita** (`CalculationRequest.referenceDate: LocalDate`). O domínio nunca consulta o relógio; a UI fornece "hoje" como default editável. Sem referência quando um número de tempo é pedido → erro `missing-reference-date`; referência anterior ao nascimento → `reference-before-birth-date`.
2. **Novo passo de traço `timeline`** (`visual: 'timeline'`): carrega os períodos com valor, faixa etária (`fromAge`/`toAge`) e o período vigente (`isCurrent`). O `finalValue` escalar do traço é **o valor vigente na data de referência** — semanticamente útil ("seu pináculo atual") e coerente com ADR-0006.
3. **Regras dos períodos** (convenção predominante, Balliett/Jordan):
   - Fronteira base = `36 − Caminho de Vida` (totalmente reduzido, mestres reduzidos **só para a aritmética de idade**).
   - **Ciclos (3):** 1º = mês reduzido `[0, 36−CV)`; 2º = dia reduzido, 27 anos; 3º = ano reduzido, restante. Mestres preservados nos valores.
   - **Pináculos (4):** P1 = red(dia+mês); P2 = red(dia+ano); P3 = red(P1+P2); P4 = red(mês+ano); janelas `[0, 36−CV)`, +9, +9, restante. Mestres preservados.
   - **Desafios (4):** diferenças absolutas dos componentes totalmente reduzidos — D1 = |mês−dia|, D2 = |dia−ano|, D3 = |D1−D2|, D4 = |mês−ano|; resultado 0–8 (o desafio 0 existe; não há mestre em desafio). Mesmas janelas dos pináculos.
   - **Idade** = anos civis completos na data de referência (aniversário ainda não ocorrido no ano desconta 1). Aritmética própria, sem `Date`.
4. **Ano Pessoal** = red(dia_nasc + mês_nasc + ano_ref), partes reduzidas antes; **Mês Pessoal** = red(AP + mês_ref); **Dia Pessoal** = red(MP + dia_ref reduzido). **Totalmente reduzidos (1–9)** — o ciclo de 9 anos fecha; escolas que preservam 11/22 no Ano Pessoal viram variante futura, registrada aqui para não ser decisão implícita. Dívidas cármicas seguem detectáveis nos totais brutos.

## Consequências

- Mesmo mapa + mesma referência = mesmo traço, sempre (reprodutível, testável).
- O renderer de `timeline` atende a "linha do tempo de ciclos/pináculos/anos pessoais" (§7 da spec).

## Alternativas consideradas

- **`Date.now()` no domínio:** quebra pureza e reprodutibilidade — rejeitada.
- **Um trace por período (11 NumberKinds):** explode a enumeração e perde a linha do tempo como dado — rejeitada.
