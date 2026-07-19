# ADR-0009 — Numerologia védica: regente planetário como passo de traço de primeira classe

**Status:** aceita · **Data:** 2026-07-19

## Contexto

A numerologia védica (Ank Jyotish, tradição indiana) deriva da data de nascimento dois números: o **Moolank** (número raiz / psíquico — o dia do nascimento reduzido) e o **Bhagyank** (número do destino — a data completa reduzida). Duas características a distinguem das escolas já implementadas:

1. **Não preserva números mestres.** A redução vai sempre até 1–9, como na caldaica — mas por motivo próprio (a tradição lê a *graha* regente do dígito, não o mestre ocidental).
2. **O significado do número É o do seu planeta regente** (*graha*): Sol (1), Lua (2), Júpiter (3), Rahu (4), Mercúrio (5), Vênus (6), Ketu (7), Saturno (8), Marte (9). Sem o planeta, o Moolank/Bhagyank é apenas "mais um dígito da data" — indistinto do Psíquico/Destino pitagóricos.

A regência planetária é, portanto, a saída semântica que justifica a escola existir. Pela regra 1 do produto (nenhum número final sem traço; o traço é valor de retorno, não log), essa informação precisa viver no traço — não em texto solto na UI nem numa tabela que a UI teria de importar de dentro do modelo.

## Decisão

1. **Novo passo de traço `planetary-ruler`** na união discriminada `CalculationStep` (visual `planetary-ruler`), análogo a `lo-shu-grid` e `transliteration`: cada escola esotérica acrescenta seu passo-assinatura à união aberta, sem tocar na lógica das outras. A saída do passo carrega planeta (localizado), nome sânscrito da *graha*, símbolo astronômico e as qualidades associadas.
2. **Redução sem preservar mestres** (`reduceToValue(..., { preserveMasters: false })`), reusando o primitivo compartilhado — nenhuma aritmética de data ou de redução é duplicada (R4).
3. **A divergência com a leitura ocidental é registrada, nunca escondida (§2.4).** Quando o mesmo total, lido com preservação de mestres (postura pitagórica), pararia em 11/22/33, o traço emite uma `DivergenceNote` explicando que védica e pitagórica discordam **por regra explícita**, não por engano.
4. **As qualidades do planeta são vocabulário de reflexão, não veredito (§9).** O texto descreve o arquétipo do planeta na tradição ("liderança e vitalidade" para o Sol), jamais uma afirmação sobre a pessoa.
5. A escola é inteiramente derivada de data: sem data de nascimento, erro tipado `missing-birth-date` — nunca cálculo parcial silencioso.

## Consequências

- A quinta escola vive inteira em `models/vedic/` + uma linha no registry; o único núcleo tocado é o **vocabulário aberto** (um `NumberKind` novo por número, um `CalculationStep` novo), exatamente como Lo Shu e Gematria — validando o critério de plugabilidade pela quinta vez.
- O switch exaustivo de render na UI (`trace-steps.tsx`) força o tratamento do novo passo em tempo de compilação: impossível registrar a escola e esquecer de exibir seu resultado.
- A camada de interpretação curada (`InterpretationProvider`) não precisa de nada: o regente planetário já É a leitura interpretativa da védica, embutida no traço.

## Alternativas consideradas

- **Reusar o passo genérico de redução e pôr o planeta numa `RuleReference`:** enterraria a saída semântica da escola em prosa citável, perdendo estrutura para a UI renderizar — rejeitada.
- **Preservar mestres como na pitagórica:** contraria a tradição Ank Jyotish (que lê a *graha* do dígito 1–9) e apagaria a divergência que é justamente o valor didático — rejeitada.
- **Tabela planeta→número exportada para a UI importar:** a UI não deve conhecer o interior da escola; o traço é o contrato — rejeitada.
