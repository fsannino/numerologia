# design.md — Sistema visual do Numerus

> Fonte de verdade do design. Direção: **"isto não é um oráculo, é um instrumento"**.
> A estética é de mesa de cálculo — papel pautado, latão, tinta — não de esoterismo.
> Origem: handoff `design_handoff_numerus` (telas Home + Expressão), fidelidade alta.

## §1 — Princípio

A conta à mostra. Nada de estrelas, roxo místico, bola de cristal ou promessa de futuro. O número é protagonista (numeral grande), mas sempre **acompanhado da conta que o produziu**. Linguagem de reflexão, nunca veredito (§9 do produto).

## §2 — Cores (seis valores; sem gradiente, sem roxo)

| Token | Hex | Uso |
|---|---|---|
| `--tinta` | `#15181F` | fundo das superfícies de leitura/resultado; texto sobre papel |
| `--papel` | `#E9EBE6` | fundo das superfícies de cálculo (cinza-esverdeado frio, não creme) |
| `--giz` | `#F6F7F3` | texto sobre tinta; fundo claro secundário |
| `--latao` | `#A8853E` | acento único: numerais em destaque, estados ativos, selo de canonicidade, foco de teclado |
| `--anil` | `#2C4668` | estrutura: réguas, eixos, links, a linha da cadeia de redução |
| `--vermelhao` | `#B0402A` | **exclusivo de divergência** ("aqui as escolas discordam"). Nunca decorativo, nunca erro de formulário |

**Regra dura:** o vermelhão é semântico no produto inteiro. Erro de formulário usa `--tinta` com peso, não vermelho. O índigo/slate anterior foi **descartado** (tangencia o roxo místico que o §1 proíbe e dilui a semântica do vermelhão). A honestidade de canonicidade (do brief anterior) permanece — vive no selo Mono de cada card/resultado.

## §3 — Tipografia (três famílias; via `next/font`, self-hosted)

- **Display** `Instrument Serif` (400 + itálico) — **só** numerais grandes e títulos de página.
- **Leitura** `Literata` (400/500, itálico 400) — todo texto corrido.
- **Dados** `IBM Plex Mono` (400/500/600) — traços de cálculo, tabelas, labels, chips letra→valor. `tabular-nums` em colunas.

**Nenhum número renderiza em fonte de leitura** — número é Display ou Mono, sempre.
**Escala (px):** 10 / 11 / 13.5 / 14 / 15 / 16 / 19 / 20 / 24 / 30 / 34 / 40 / 44 / 56 / 68 / 96 / 128. Os saltos altos (96, 128) só para numerais.

## §4 — Espaçamento e forma

- Padding de seção: `56–74px` vertical, `48px` horizontal (desktop).
- **Sem sombras. Sem cantos arredondados** em superfícies. Separação por mudança de fundo + régua fina `1px solid var(--anil)`.
- Grids "emoldurados": `gap: 1px; background: var(--anil); border: 1px solid var(--anil)`, células em `--papel`/`--giz` (folha pautada).
- Labels Mono: `10–11px; letter-spacing: .1–.2em; text-transform: uppercase; color: var(--anil)` (ou `--latao` p/ destaque).

## §5 — Cadeia de redução (elemento-assinatura)

- `stepIn`: opacity 0→1 + translateY(-8px)→0, ~.45s.
- `lineGrow`: scaleY(0→1), origin top, ~.35s (o filete que liga as etapas).
- `chipIn`: opacity 0→1, ~.35s (chips letra→valor).
- Etapas descem de cima p/ baixo, ~120ms de defasagem por etapa.
- **Números mestres (11/22/33) não descem** — o filete se interrompe.
- Respeitar `prefers-reduced-motion`: sem animação, a cadeia aparece inteira.

## §6 — Voz da interface

Verbo ativo, caixa baixa. "Ver a conta", não "Detalhes". "Calcular" → estado "Calculado". Erro específico, sem desculpa: "Faltou a data de nascimento". Proibido: urgência, veredito, promessa de futuro.

## §7 — Piso de qualidade

Responsivo até 360px (no mobile o cálculo vem **acima** da leitura); contraste AA; `prefers-reduced-motion`; alternativa textual para cadeia, grade Lo Shu e leque de divergência.

## §8 — Implementação no repo

Tokens em `apps/web/src/app/globals.css` (`@theme` do Tailwind v4 + custom properties). Fontes em `apps/web/src/app/fonts.ts` via `next/font/google` (build-time, self-hosted — nenhuma chamada de CDN em runtime, coerente com device-first e o CSP com nonce). Regra de numerologia **nunca** na UI — os componentes consomem `CalculationTrace`. Aplicado por fatias: fundação + tela de Expressão primeiro (tracer bullet), Home e demais telas em seguida.
