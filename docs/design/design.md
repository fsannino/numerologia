# design.md — Sistema visual do Numerus

> Fonte de verdade do design. Direção: **"isto não é um oráculo, é um instrumento"**.
> Versão visual **v2 — "manuscrito noturno"**: fundo escuro (pergaminho à noite),
> ouro reservado aos números, azul frio para o "por quê?". Substitui a v1 clara
> (papel/tinta/latão sobre fundo claro); a v1 fica registrada em §11 como histórico.

## §1 — Princípio

A conta à mostra. Nada de estrelas, roxo místico, bola de cristal ou promessa de futuro. O número é protagonista (numeral grande em **ouro**), mas sempre **acompanhado da conta que o produziu**. Linguagem de reflexão, nunca veredito (§9 do produto).

O fundo escuro não é "esotérico" — é a mesa de trabalho à noite: pergaminho claro escrito sobre superfície escura, ouro para o que é resultado, azul para o que é explicação. A estética continua de instrumento, não de oráculo.

## §2 — Cores (sete valores; sem gradiente, sem roxo)

| Token | Hex | Uso |
|---|---|---|
| `--papel` | `#12111A` | fundo da página (o mais escuro) |
| `--giz` | `#1C1A26` | superfície: cards, formulários, células de grade |
| `--tinta` | `#EDE9E0` | texto (pergaminho claro) sobre `papel`/`giz` |
| `--anil` | `#9A93A8` | secundário e estrutura: réguas, bordas, labels, texto de apoio |
| `--latao` | `#C9A227` | **ouro — exclusivo dos números**: numerais de resultado, CTA primário, selo de mestre, foco de teclado |
| `--azul` | `#5B8AA6` | **azul frio — o "por quê?"**: "ver passo a passo", links, chamadas de explicação |
| `--vermelhao` | `#B0603A` | **terracota — alerta epistêmico**: divergência entre escolas **e** baixa canonicidade/padronização (construção contemporânea, dependência de variante, não padronização). Nunca decorativo, nunca erro de formulário |

**Regra dura — o par resultado ↔ demonstração:** o **ouro é dos números** (resultado); o **azul é do "por quê?"** (a demonstração, o passo a passo, o link). Essa dupla é a identidade visual do produto: todo número em ouro tem, ao lado, um caminho azul que abre a conta. O ouro no CTA primário é a única exceção — "chegar ao número" é a ação que o CTA promete, então herda a cor do número.

**Terracota é semântico:** marca honestidade epistêmica em todo o produto — onde as escolas discordam e onde a tradição é frágil (selo de proveniência). Erro de formulário usa `--tinta` com peso/borda, **nunca** terracota. O índigo/slate da v1 foi descartado (tangencia o roxo místico que o §1 proíbe); `--anil` agora é um cinza-lavanda neutro, só estrutura.

## §3 — Tipografia (três famílias; via `next/font`, self-hosted)

- **Display** `Instrument Serif` (400 + itálico) — **só** numerais grandes e títulos de página.
- **Leitura** `Literata` (400/500, itálico 400) — todo texto corrido.
- **Dados** `IBM Plex Mono` (400/500/600) — traços de cálculo, tabelas, labels, chips letra→valor. `tabular-nums` em colunas.

**Nenhum número renderiza em fonte de leitura** — número é Display ou Mono, sempre.
**Escala (px):** 10 / 11 / 13.5 / 14 / 15 / 16 / 19 / 20 / 24 / 30 / 34 / 40 / 44 / 56 / 68 / 96 / 128. Os saltos altos (96, 128) só para numerais.

## §4 — Espaçamento e forma

- Padding de seção: `56–74px` vertical, `48px` horizontal (desktop).
- **Sem sombras. Sem cantos arredondados** em superfícies. Separação por mudança de fundo + régua fina `1px solid var(--anil)`.
- Grids "emoldurados": `gap: 1px; background: var(--anil); border: 1px solid var(--anil)`, células em `--giz` (a folha sobre a mesa escura).
- Labels Mono: `10–11px; letter-spacing: .1–.2em; text-transform: uppercase; color: var(--anil)` (`--latao` p/ destaque de número, `--azul` p/ "por quê?").
- **Texto sobre ouro é sempre `--papel`** (escuro sobre ouro), nunca `--tinta` — contraste. Vale para CTA, chip de letra destacada e badge de etapa.

## §5 — Cadeia de redução (elemento-assinatura)

- `stepIn`: opacity 0→1 + translateY(-8px)→0, ~.45s.
- `lineGrow`: scaleY(0→1), origin top, ~.35s (o filete que liga as etapas).
- `chipIn`: opacity 0→1, ~.35s (chips letra→valor).
- Etapas descem de cima p/ baixo, ~120ms de defasagem por etapa.
- **Números mestres (11/22/33) não descem** — o filete se interrompe. O numeral final da cadeia é em **ouro**; os intermediários em `--anil`.
- Respeitar `prefers-reduced-motion`: sem animação, a cadeia aparece inteira.

## §6 — Voz da interface

Verbo ativo, caixa baixa. "Ver a conta", não "Detalhes". "Calcular" → estado "Calculado". Erro específico, sem desculpa: "Faltou a data de nascimento". Proibido: urgência, veredito, promessa de futuro.

## §7 — Piso de qualidade

Responsivo até 360px (no mobile o cálculo vem **acima** da leitura); contraste AA sobre fundo escuro; `prefers-reduced-motion`; alternativa textual para cadeia, grade Lo Shu e leque de divergência.

## §8 — Implementação no repo

Tokens em `apps/web/src/app/globals.css` (`@theme` do Tailwind v4 + custom properties — as utilidades `bg-papel`, `text-latao`, `text-azul` etc. derivam daí). Fontes em `apps/web/src/app/fonts.ts` via `next/font/google` (build-time, self-hosted — nenhuma chamada de CDN em runtime, coerente com device-first e o CSP com nonce). Regra de numerologia **nunca** na UI — os componentes consomem `CalculationTrace`.

## §9 — Cor por escola (identidade de cada tradição)

Além do ouro do resultado, cada escola tem uma cor de identidade para os elementos que a representam (símbolo no card, cabeçalho da coluna na matriz comparativa) — **nunca** aplicada ao numeral do resultado (que é sempre ouro). A definir na fatia da matriz comparativa: pitagórico ouro, caldeu bronze, lo shu jade, gematria índigo, védica açafrão, cabalística, 231 portões. É diferenciação, não semântica de canonicidade (essa continua no selo terracota).

## §10 — Sinais comerciais (honestos)

Faixa fixa de topo "gratuito no lançamento · N leituras" e upsell discreto pós-resultado ("quer isto em PDF com seu logo? → versão profissional") são **cópia**, não enforcement: enquanto não houver autenticação/billing (Supabase/Stripe), nenhum limite é imposto de fato — a UI não mente sobre um muro que não existe.

## §11 — Histórico: v1 "instrumento claro" (descartada)

A v1 usava fundo claro: `tinta #15181F` (texto escuro / superfície de leitura), `papel #E9EBE6` (fundo de cálculo), `giz #F6F7F3` (texto claro), `latao #A8853E`, `anil #2C4668` (índigo, estrutura), `vermelhao #B0402A` (só divergência). A v2 escureceu o fundo, inverteu o papel de `tinta`/`papel` (agora texto claro / fundo escuro), tornou `anil` um cinza neutro, esfriou o ouro/terracota para o fundo escuro e **introduziu `azul`** para separar "resultado" de "por quê?". A regra "vermelhão só para divergência" da v1 foi ampliada em v2 para "terracota = alerta epistêmico" (divergência + fragilidade de proveniência).
