# ADR-0013 — Device-first × contas de usuário (perfil, histórico, servidor)

**Status:** proposta · **Data:** 2026-07-20

> Este ADR existe para ser **ratificado ou ajustado** antes de qualquer
> persistência server-side de dados de leitura. Enquanto estiver em *proposta*,
> a regra do CLAUDE.md §3 permanece em vigor sem exceção.

## Contexto

O CLAUDE.md §3 (device-first) é um invariante de ferro do Numerus: na **persona
pessoal**, *"nome/data de nascimento jamais entram em handler HTTP, log, cache
persistente ou banco. Não crie endpoint que receba esses campos."* Hoje o produto
honra isso literalmente — não há back-end, banco nem auth no repositório, e o
device-first é verificável (a leitura roda 100% no cliente).

Os PRDs da **Veridia** (a plataforma-guarda-chuva da qual o Numerus é o módulo de
Numerologia) pedem o oposto em vários pontos:

- PRD-03 §5 (Numerologia): **Perfil numerológico, Relatórios, Histórico,
  Comparações** — todos implicando persistência.
- PRD-02 §5: a entidade **`NumerologyProfile` no PostgreSQL**.
- PRD-03 §9 (Minha Jornada) e §2 (perfis de usuário com RBAC): contas, histórico,
  recomendações — tudo server-side.

Sem uma decisão explícita, o módulo de numerologia da Veridia nasceria violando a
constituição do Numerus. A tensão é real, mas **não é binária**: já existe uma
ponte no produto — as **duas trilhas** da Home (`pessoal` device-first ×
`profissional`/atende-clientes), entregues no reposicionamento (PR #17).

## Decisão (proposta)

**Bifurcar por persona; o device-first continua sendo o default inviolável da
persona pessoal, e a persistência server-side só existe como recurso opt-in
explícito.**

1. **Persona pessoal — device-first permanece absoluto.** A leitura do *próprio*
   nome/data continua rodando só no cliente. Nenhum endpoint recebe esses campos;
   nenhum log/cache/banco os toca. É o default e não muda.

2. **Histórico pessoal = local, não servidor (por padrão).** "Histórico" e
   "comparações" da persona pessoal são persistidos **no dispositivo**
   (IndexedDB/`localStorage`), não no PostgreSQL. `NumerologyProfile` no servidor
   deixa de ser premissa: para a persona pessoal, o "perfil" é local.

3. **Sincronização entre dispositivos = opt-in explícito e cifrada no cliente.**
   Se o usuário quiser levar o histórico para outro aparelho, o dado sobe
   **cifrado ponta-a-ponta** (chave derivada do usuário, servidor cego). O servidor
   guarda blob opaco; nunca nome/data em claro. É recurso escolhido, com
   consentimento, nunca silencioso.

4. **Persona profissional (atende clientes) = server-side legítimo, com o
   profissional como controlador.** Aqui o dado é de **terceiros** (clientes do
   numerólogo). Persistir nome/data faz parte da função (histórico de
   atendimentos, PDF). O numerólogo é o controlador LGPD; a plataforma é
   operadora; exige base legal, consentimento do titular e trilha de auditoria.
   Isto **não** é a persona pessoal, então o §3 não se aplica — mas as garantias
   LGPD, sim.

5. **Contas/RBAC da Veridia não implicam PII de leitura no servidor.** Login,
   biblioteca, jornada, cursos podem ser server-side sem quebrar o §3 — desde que
   os campos sensíveis de *leitura numerológica pessoal* sigam as regras 1–3. A
   fronteira é o dado de leitura pessoal, não a conta em si.

6. **O CLAUDE.md §3 é reescrito para refletir a bifurcação** (persona pessoal =
   device-first; persona profissional = server-side sob LGPD; sync pessoal =
   opt-in cifrado). Sem essa reescrita, qualquer feature server-side de leitura
   contradiz a regra vigente.

## Consequências

- Destrava perfil/histórico/relatórios **sem** trair o device-first: o default
  continua privado; o servidor só entra por escolha e, na persona pessoal, cego.
- A trilha profissional (já sinalizada na UI) ganha base arquitetural: é o único
  caminho em que nome/data de terceiros vivem no servidor, e sob controladoria
  explícita.
- Exige criptografia no cliente para o sync (complexidade real: gestão de chave,
  recuperação, perda de chave = perda de histórico — a documentar).
- O threat-model (`docs/security/threat-model.md`) precisa de uma seção nova: a
  superfície deixa de ser "zero servidor" e passa a ter três regimes de dado
  (local, blob cifrado, PII profissional sob LGPD).
- ADR de auth/RBAC (futuro) referencia este como pré-condição.

## Alternativas consideradas

- **`NumerologyProfile` no PostgreSQL como o PRD pede, em claro:** viola o §3
  frontalmente e joga fora o maior diferencial do produto (privacidade
  verificável) — rejeitada.
- **Abandonar o device-first para simplificar:** transformaria o Numerus em "mais
  um site de numerologia"; o device-first é parte da tese de confiança — rejeitada.
- **Nunca ter histórico/sync:** honra o §3 mas ignora demanda real de produto e a
  persona profissional — rejeitada em favor da bifurcação opt-in.
- **Histórico só local, sem sync algum:** opção mais conservadora e válida como
  Fase 1 (regra 2 sem a 3); a regra 3 pode ficar para depois. Compatível com esta
  decisão — é um subconjunto dela.

## Decisões que dependem de você

- Ratificar a bifurcação (ou escolher a variante "só local, sem sync" como
  primeiro passo).
- Confirmar que a persona profissional pode persistir PII de terceiros sob
  controladoria do numerólogo (base legal LGPD).
- Aprovar a reescrita do CLAUDE.md §3 correspondente.
