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
| `InterpretationProvider` | Provider de interpretação | Port (§11 dec. 3) que produz **reflexão** sobre um número — camada separada do cálculo. Hoje `curated`; `ai` na Fase 10. Sempre §9: reflexão, nunca veredito. |

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

## Escola caldaica

| Termo | Definição |
|---|---|
| Tabela 1–8 | Valores por afinidade fonética; nenhuma letra vale 9 (sagrado). |
| `CompoundNumber` (Número composto) | Total antes da redução (ex.: 23) — dado de saída de primeira classe, lido antes do dígito. Vive em `finalValue.raw`. |
| Sem preservação de mestres | A redução caldaica vai até 1–9; o significado de 11/22/33 vive na leitura do composto. |
| Fonte | Cheiro, "Cheiro's Book of Numbers" (1926). |

## Sinastria (casal)

| Termo (código) | Definição |
|---|---|
| `UnionNumber` (Número da união) | Deriva do mesmo número individual de duas pessoas: soma os valores reduzidos e reduz o total. Serviço de domínio agnóstico de escola. |
| `union-destiny` / Destino da União | Dos dois Destinos (Caminho de Vida). |
| `union-soul` / Alma da União | Das duas Motivações. |
| `union-expression` / Expressão da União | Das duas Expressões. |
| `union-personality` / Personalidade da União | Das duas Impressões. |
| `union-mission` / Missão da União | Das duas Missões. |
| `union-key` / Chave da União | Dos dois Números Chave. |
| Convergência | União onde as duas pessoas já compartilham o mesmo dígito. **Não é evidência de harmonia** (§9). |

Regra epistêmica dura (§9): os números da união são vocabulário para reflexão, **nunca** veredito de compatibilidade.

## Empresa

| Termo (código) | Definição |
|---|---|
| `CompanySubject` (Empresa) | Agregado distinto de Pessoa: razão social + nome fantasia + data de constituição (§2.3, item 4). |
| Identidade corporativa | Números de nome da razão social. |
| Marca | Números de nome do nome fantasia (Expressão da marca etc.). |
| `brand-harmony` / Harmonia da Marca | Combina a Expressão da razão social e a do nome fantasia. Reflexão sobre coerência — não veredito comercial (§9). |
| `founder-affinity` / Afinidade com o Sócio | Combina a Expressão da razão social e a de um sócio. |
| Destino corporativo | Caminho de Vida da data de constituição. |

## Casamento (união formal)

| Termo (código) | Definição |
|---|---|
| `marriage-governing` / Número Regente | Caminho de Vida da data do casamento — a vibração de destino da união formal (§2.3, item 3). |
| `marriage-personal-year` / Ano Pessoal do Casamento | Ano Pessoal calculado tratando a data do casamento como o "nascimento" da união. |

O casamento reusa a sinastria (números da união do casal) + os números da data do casamento (independentes de escola).

`combineReducedValues` é o primitivo de domínio compartilhado por sinastria e empresa (soma de valores reduzidos + redução preservando mestres).

## Evento / data

| Termo (código) | Definição |
|---|---|
| `event` (Evento) | Sujeito distinto: uma data específica, sem nome nem pessoa (§2.3). |
| `event-vibration` / Vibração da Data | Caminho de Vida da data do evento — a mesma redução de dígitos de data, re-rotulada (R4, ADR-0005). |
| `event-personal-year` / Ano Pessoal do Evento | Ano Pessoal tratando a data do evento como um "nascimento" — em que ponto do ciclo o evento está (ADR-0007). |

O Evento reusa as funções de data existentes (não duplica a redução de datas), como o casamento — só a data entra, nada de nome.

## Escola Lo Shu (chinesa)

| Termo | Definição |
|---|---|
| Quadrado Lo Shu | Grade mágica 4-9-2 / 3-5-7 / 8-1-6 onde os dígitos da data são posicionados. |
| `lo-shu-grid` | Único resultado da escola: a grade. Produz grade, não número único — renderer próprio (passo `lo-shu-grid`, visual `lo-shu`). Escalar = nº de números distintos presentes. |
| Seta de força | Linha (fila/coluna/diagonal) com os três números presentes. |
| Seta de ausência | Linha com os três números ausentes — qualidade a desenvolver, não veredito (§9). |
| Fonte | Tradição da numerologia chinesa (mito do rio Luo). |

## Escola Gematria (hebraica)

| Termo | Definição |
|---|---|
| Gematria | Soma dos valores das letras hebraicas (mispar hechrachi: א=1 … ת=400). |
| Transliteração | Mapeamento latino→hebraico, **ambíguo por natureza** (ADR-0008). Cada letra tem 1+ candidatas. |
| `gematria-value` | Valor do nome pela transliteração **padrão** (primeira opção de cada letra). |
| Espectro | Total mínimo, padrão e máximo + nº de combinações — a ambiguidade exposta, **nunca resposta silenciosa** (§9). |
| Fonte | Gematria hebraica clássica (mispar hechrachi). |

## Escola Védica (indiana)

| Termo | Definição |
|---|---|
| Ank Jyotish | Numerologia védica, da tradição da astrologia indiana. Deriva números da data de nascimento, cada um regido por um planeta. |
| `vedic-moolank` (Moolank) | Número raiz / psíquico: o **dia** do nascimento reduzido a 1–9. |
| `vedic-bhagyank` (Bhagyank) | Número do destino: a soma de **todos os dígitos** da data, reduzida a 1–9. |
| Graha | Planeta regente de um dígito 1–9: Sol (1), Lua (2), Júpiter (3), Rahu (4), Mercúrio (5), Vênus (6), Ketu (7), Saturno (8), Marte (9). O significado do número é o do seu planeta. |
| `planetary-ruler` | Passo de traço que expõe a graha regente (planeta, nome sânscrito, símbolo, qualidades). Assinatura da escola — como `lo-shu-grid` e `transliteration` das suas. |
| Sem preservação de mestres | A redução védica vai sempre até 1–9. Quando a leitura ocidental (mestres) divergiria, o traço registra a nota (§2.4, ADR-0009). |
| Fonte | Ank Jyotish; correspondência clássica entre números e grahas. |

Qualidades do planeta (§9): vocabulário de reflexão sobre o arquétipo, **nunca** veredito sobre a pessoa.

## Escola Cabalística (latina)

| Termo | Definição |
|---|---|
| Numerologia Cabalística | Adaptação moderna de princípios da Cabala (22 letras hebraicas, Árvore da Vida) ao alfabeto latino. **Sem tabela única entre autores** — daí a Matriz de Leituras. |
| `kabbalistic-name` | Número do Nome cabalístico. Não é UM número: é a Matriz de Leituras. Escalar do card = nº de leituras distintas. |
| Matriz de Leituras | Tabela (`sequential-1-9` \| `chaldean-like-1-8`) × redução (`decimal` \| `modular-22`) = 4 leituras simultâneas, cada uma com sua origem. Passo de traço `reading-matrix`. |
| Redução arcano | `((total − 1) mod 22) + 1` → 1–22 (os 22 caminhos). Única aritmética própria; exibida só como número, sem significado (§9, ADR-0011). `value-objects/arcano.ts`. |
| Coincidência (provada) | Quando uma leitura decimal bate com o número real da pitagórica/caldaica, o traço etiqueta "≡ Pitagórica/Caldaica" — comparação dinâmica, não presunção. A diferença é de interpretação, não de cálculo. |
| Delegação | A escola **importa** as tabelas pitagórica/caldaica (fonte única, R4) em vez de reescrevê-las — é o que torna a coincidência provável. |
| Só o nome | A cabalística não usa data de nascimento (o nome é a expressão da alma) — `supportedNumbers` sem números de data. |
| Fonte | Adaptação latina (Trevisani; C. Rosa); Sefer Yetzirah para os 22 caminhos. |

## Escola 231 Portões (Sefer Yetzirah)

| Termo | Definição |
|---|---|
| 231 Portões | As combinações de pares das 22 letras hebraicas — C(22,2) = 231 (Sefer Yetzirah 2:4). Estrutura cosmogônica, não análise de nome. |
| `Gate` | Um portão: par **não-ordenado** de duas letras **distintas** (`first.value < second.value` canoniza). |
| `gates-231-structure` | Único resultado da escola: a estrutura. Escalar do card = nº de portões ativados (0–231). Passo de traço `gate-structure`. |
| Modo de ativação | Como o nome "ativa" portões — **construção contemporânea** (sem fonte canônica): `distinct-letter-pairs` (todos os pares das letras distintas) \| `adjacent-pairs` (pares vizinhos). Rotulado como não-canônico. |
| Derivado, não hardcoded | Os 231 portões são gerados de `HEBREW_ALPHABET` por combinação; um teste afirma 231. |
| Sem leitura por portão | Não há fonte para significado de cada portão — exibe-se estrutura, valores e a referência; nada de doutrina inventada (§9, ADR-0012). |
| Fonte | Sefer Yetzirah 2:4 (estrutura); a aplicação ao nome é contemporânea. |

O glossário cresce uma seção por escola a cada fase (caldaica, gematria, Lo Shu, védica, cabalística, 231 Portões...), com fonte histórica em `docs/domain/models-reference.md`.
