# ADR-0004 — Classificação vogal/consoante (o problema do Y)

**Status:** aceita · **Data:** 2026-07-18 · Estende a ADR-0003 (generaliza a dimensão de redução do nome)

## Contexto

Motivação (vogais) e Impressão (consoantes) exigem classificar cada letra. A, E, I, O, U são consenso; o **Y não é**: escolas o tratam como sempre vogal, sempre consoante, ou vogal condicionada ao contexto silábico. Detecção de sílaba real é inviável e opaca; qualquer escolha silenciosa violaria o §4.3 da spec ("ambiguidade nunca vira chute").

## Decisão

1. **A dimensão de variante `expression-reduction` (ADR-0003) foi renomeada para `name-reduction`** e passa a valer para todos os números derivados do nome (Expressão, Motivação, Impressão, Chave).
2. Nova dimensão explícita **`y-classification`** com três opções, registrada no traço:
   - **`y-by-context` (default):** Y é vogal quando nenhum vizinho imediato na palavra é vogal plena. Aproximação determinística e explicável da regra silábica clássica ("YARA" → consoante; "LYDIA" → vogal).
   - **`y-always-vowel`** e **`y-always-consonant`:** regras fixas de escolas específicas.
3. **W é sempre consoante** (a leitura de W como vogal é anglófona e minoritária; se necessário, vira opção futura desta mesma dimensão).
4. Quando o nome contém Y e as opções produzem resultados diferentes, o traço recebe **nota de divergência** automática com as alternativas.

## Consequências

- O usuário vê e escolhe a regra do Y; o resultado registra a escolha — transparência total (§9).
- Nome sem Y produz resultado idêntico nas três opções (propriedade coberta por teste).

## Alternativas consideradas

- **Detecção silábica real:** não determinística entre idiomas, inexplicável na UI — rejeitada.
- **Escolher uma regra única:** esconderia divergência real entre escolas — rejeitada.
