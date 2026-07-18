# Threat Model — Fatia 1

Escopo atual: aplicação web estática com cálculo 100% no cliente. **Nenhum dado pessoal transita ou é persistido** — o formulário nunca faz requisição de rede com nome/data; não há backend, banco, cookies nem storage persistente nesta fatia.

## Ativos

1. Nome completo digitado pelo usuário (dado pessoal direto; contexto pode inferir convicção filosófica — tratar como sensível, LGPD art. 5º II).
2. Integridade das regras de cálculo (resultado errado = dano reputacional).

## Ameaças e mitigações (Fatia 1)

| Ameaça | Mitigação |
|---|---|
| Exfiltração do nome via dependência comprometida (supply chain) | Sem chamada de rede no fluxo de cálculo; dependências mínimas e auditadas no CI (`pnpm audit` + gitleaks); **CSP com nonce por requisição** (`connect-src 'self'`, sem `unsafe-inline` em scripts) aplicada por middleware, mais `nosniff`, `frame-ancestors 'none'`, Referrer-Policy, Permissions-Policy e HSTS. |
| Dado pessoal em logs/telemetria | Não há telemetria nesta fatia. Regra permanente: nunca logar nome/data (pino.redact quando houver backend). |
| Resultado incorreto silencioso | Traço obrigatório (não existe número sem passos), fixtures conferidas manualmente, testes de propriedade, versão do engine gravada no traço. |
| Caractere não suportado descartado em silêncio | Erro explícito `unsupported-character` (ADR-0002). |

## Ameaças futuras (registradas, tratadas nas fases indicadas)

- **Fase 2 (auth + contador):** enumeração de contas, abuso do trial, rate limiting.
- **Fase 5 (Profissional):** acesso cruzado entre tenants (vetor nº 1 — suíte de testes de RLS dedicada), envelope encryption de PII, audit trail append-only, DPA, RIPD/DPIA.
- **Fase 10 (IA):** prompt injection, PII no prompt (proibido por design), validação de schema da saída.
