# Política de Segurança

## Reporte de vulnerabilidades

Abra um security advisory privado no GitHub ou contate o mantenedor. Não abra issue pública com detalhes exploráveis. Resposta alvo: 72h.

## Princípios do produto

- **Device-first (persona pessoal)**: nome e data de nascimento nunca chegam a servidor — é garantia técnica, não promessa de política de privacidade. Qualquer PR que introduza envio desses dados a backend deve ser rejeitado.
- Dados tratados como **sensíveis por padrão** (contexto de convicção filosófica — LGPD art. 5º, II).
- Sem segredos em código; `.env.example` versionado sem valores.
- Quando existir backend (Fase 2+): RLS em toda tabela, validação Zod em toda fronteira, rate limiting, logs com redact de PII, audit trail append-only para dados de terceiros.

Threat model vivo em `docs/security/threat-model.md`.
