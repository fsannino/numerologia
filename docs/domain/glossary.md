# Glossário — Linguagem Ubíqua

Termos do domínio numerológico usados no código. O nome no código = o nome que o estudioso da escola usa.

## Núcleo (todas as escolas)

| Termo (código) | Termo (pt-BR) | Definição |
|---|---|---|
| `Subject` | Sujeito | O objeto de um cálculo: pessoa, casal, empresa, evento. Cada tipo é um agregado distinto. |
| `PersonSubject` | Pessoa | Nome completo de nascimento + data de nascimento (data opcional até que um número derivado de data seja pedido — aí a ausência é erro explícito). |
| `Chart` | Mapa | Conjunto de resultados calculados para um sujeito sob um ou mais modelos. |
| `NumerologyModel` | Escola / Modelo | Estratégia plugável que implementa as regras de uma escola (pitagórica, caldaica...). |
| `CalculationTrace` | Traço de cálculo | Valor de retorno do domínio: resultado final **mais** todos os passos que o produziram. Não existe número sem traço. |
| `CalculationStep` | Passo | Uma etapa do traço: mapeamento de letras, filtro, soma, redução, verificação de mestre, verificação cármica. |
| `NumerologyValue` | Valor numerológico | Valor bruto + valor reduzido + cadeia de redução + flags (mestre, dívida cármica). |
| `ReductionChain` | Cadeia de redução | Sequência 62 → 8 com cada etapa explícita. |
| `MasterNumber` | Número mestre | 11, 22, 33 — não reduzem. |
| `KarmicDebt` | Dívida cármica | 13, 14, 16, 19 detectados em totais brutos antes da redução. |
| `RuleReference` | Referência de regra | Qual regra da escola justificou um passo (base do modo "por quê?"). |
| `DivergenceNote` | Nota de divergência | Registro de que outra escola/variante produziria resultado diferente e por quê. |

## Escola pitagórica

| Termo | Definição |
|---|---|
| `Expression` (Expressão) | Soma de **todas** as letras do nome de nascimento. Também chamada "Número do Destino do Nome". |
| `Motivation` / Alma | Soma das **vogais** (Fase 2). |
| `Impression` / Personalidade | Soma das **consoantes** (Fase 2). |
| `KeyNumber` (Número Chave) | Primeiro nome (Fase 2). |
| `LifePath` (Caminho de Vida / Destino) | Derivado da data de nascimento (Fase 2). |
| Variante `reduce-words-then-sum` | Reduz cada palavra do nome antes de somar (default — ADR-0003). |
| Variante `sum-all-then-reduce` | Soma todas as letras e reduz uma única vez. |
| `KarmicLessons` (Lições Cármicas) | Dígitos 1–9 ausentes entre os valores das letras do nome. |
| `HiddenTendencies` (Tendências Ocultas) | Dígitos repetidos 3+ vezes na grade do nome. |
| `Subconscious` (Subconsciente) | Quantidade de dígitos distintos presentes (= 9 − lições). |
| `Psychic` (Psíquico) | Redução do dia do nascimento, preservando mestres. |
| `Mission` (Missão) | Soma dos valores reduzidos de Expressão e Destino. |
| Variante `y-classification` | Y por contexto (default), sempre vogal ou sempre consoante (ADR-0004). |
| Variante `life-path-reduction` | Destino por partes reduzidas (default) ou soma de todos os dígitos (ADR-0005). |

O glossário cresce uma seção por escola a cada fase (caldaica, gematria, Lo Shu, védica...), com fonte histórica em `docs/domain/models-reference.md`.
