# ADR-0014 — Autenticação e RBAC (fundação de contas)

**Status:** proposta · **Data:** 2026-07-20

> Depende de ADR-0013 (aceita). Este ADR desenha a fundação de contas antes de
> provisionar qualquer infra — nenhum projeto Supabase foi criado, nenhum código
> foi escrito. É decisão de arquitetura, para ratificar.

## Contexto

Com a **absorção** decidida (a Veridia adota o Numerus como módulo), o produto
precisa de uma fundação transversal de contas que hoje não existe (zero
dependência de back-end/banco/auth no repositório). Os PRDs pedem:

- **6 perfis + RBAC** (PRD-03 §2): Visitante, Usuário Registrado, Assinante
  Premium, Especialista/Autor, Moderador, Administrador.
- **OAuth2/OIDC, MFA, RBAC, auditoria** (PRD-02 §7); **logins sociais**
  (Google/Microsoft/Apple) e **Stripe** (PRD-02 §11); **PostgreSQL** como banco
  principal (PRD-02 §5).

Restrições herdadas:

- **Device-first (ADR-0013)**: autenticar **nunca** envia nome/data da leitura
  *pessoal* ao servidor. A conta é ortogonal à leitura pessoal.
- **IA/infra por API gerenciada, não self-host** (decisão de 2026-07-20):
  preferir serviço gerenciado a operar servidor de identidade próprio.
- **Regra escrita uma vez** (CLAUDE.md): nada de `if` de permissão espalhado;
  a autorização é dado de domínio, não lógica escondida em componente.

## Decisão (proposta)

1. **Supabase como fundação de identidade + dados: Auth + Postgres + RLS numa
   peça só.** Entrega OAuth2/OIDC, MFA e logins sociais (o que o PRD pede), *e* o
   PostgreSQL que o PRD já exige, *e* Row-Level Security para aplicar o RBAC na
   borda do banco. Coerente com "API gerenciada, não self-host". Este ambiente já
   tem o conector Supabase disponível.

2. **A matriz de autorização é dado de domínio testável, em pacote TS puro.**
   Um novo `packages/access` (framework-agnóstico, como `numerology-domain`)
   define papéis, permissões e a matriz papel→permissão — "regra escrita uma
   vez", testável sem framework. O **RLS no Postgres é a aplicação da mesma
   matriz** na borda do banco; a UI consulta o mesmo modelo. Nada de checagem de
   permissão solta em componente React.

3. **Persona "Profissional" (atende clientes) modelada como capability, não como
   um 7º papel.** Os 6 papéis do PRD são níveis de acesso à plataforma; "atende
   clientes" é uma *função* que um Usuário/Assinante exerce. Fica como um
   **claim/capability** ortogonal (`professional: true`) que habilita a carteira
   de clientes e o histórico server-side (persona profissional do ADR-0013), sob
   RLS por `professional_id`. (Ponto aberto — ver decisões abaixo.)

4. **Fronteira device-first explícita.** A conta guarda: identidade, preferências
   e — só na capability profissional — dados de clientes. **Nunca** guarda a
   leitura *pessoal* do próprio usuário (nome/data): essa continua no aparelho,
   logado ou não (ADR-0013, Fase 1 "só-local"). Testes de acesso devem afirmar
   que nenhum endpoint recebe PII de leitura pessoal.

5. **Lugar no monorepo, sem `apps/api` novo por ora.** Supabase client SDK no
   `apps/web` (route handlers/server components; service role só onde
   estritamente necessário) + `packages/access` (matriz RBAC pura) + **migrations
   SQL versionadas** em `supabase/`. Um `apps/api` dedicado (ou GraphQL, PRD-02
   §4) só se e quando um serviço fora do Next.js justificar.

6. **LGPD e segurança desde o início.** MFA (Supabase); trilha de auditoria
   append-only (o plano de implementação já prevê); consentimento e minimização;
   segredos fora do código (threat-model). O threat-model ganha uma seção de
   autenticação — a superfície deixa de ser "zero servidor".

## Consequências

- Primeiro pacote com dependência de back-end e primeiras migrations SQL no repo.
- Destrava, na ordem: contas → histórico pessoal sincronizável (futuro) → carteira
  de clientes / trilha profissional (Fatia 5 do plano) → "Minha Jornada" → billing.
- CI passa a precisar de um Postgres efêmero (ou testes de RLS contra Supabase
  local) — impacto a tratar quando o CI de GitHub Actions entrar.
- `packages/access` vira dependência transversal de todos os módulos da Veridia
  (Biblioteca, Academy, Comunidade, Admin).

## Alternativas consideradas

- **NextAuth/Auth.js:** ótimo para autenticação, mas não traz banco nem RLS —
  seria somar Postgres + RLS à parte. Supabase unifica os três — preferido.
- **Keycloak / IdP self-hosted:** contraria a decisão "API gerenciada, não
  self-host" e adiciona operação — rejeitado.
- **Clerk / Auth0:** auth excelente, mas o RBAC/dado ainda precisaria do Postgres
  do PRD à parte; Supabase junta auth + dados + RLS numa peça — preferido para
  esta fase.
- **"Profissional" como 7º papel:** mistura nível-de-acesso com função exercida;
  capability ortogonal é mais limpo — preferido (mas aberto a revisão).

## Decisões que dependem de você

- **Projeto/conta Supabase** a usar (ou criar) — sem isso, nada é provisionado.
- **"Profissional" é capability (proposto) ou papel próprio?**
- **Billing (Stripe) entra nesta fatia ou depois?** (o RBAC de "Assinante
  Premium" pressupõe um gate de assinatura em algum momento).
