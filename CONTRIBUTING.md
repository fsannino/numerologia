# Contribuindo

- **Branches:** `feat/<contexto>-<descrição>`, `fix/<contexto>-<descrição>` (ex.: `feat/pythagorean-life-path`).
- **Commits:** Conventional Commits (`feat(domain): ...`, `fix(web): ...`).
- **Setup único após clonar:** `pnpm install && pnpm hooks:install` (ativa o pre-commit com gitleaks — R12).
- **Antes do PR:** `pnpm lint && pnpm typecheck && pnpm test` verdes; cobertura do domínio ≥ 90%.
- **Regras de design:** leia `CLAUDE.md` (vale para humanos também) e os ADRs em `docs/architecture/adr/`.
- **Nova escola numerológica:** diretório novo em `packages/numerology-domain/src/models/` + registro no registry + suíte de fixtures conferidas manualmente + seção no glossário (`docs/domain/glossary.md`) com fonte histórica.
- **Decisão arquitetural:** ADR antes do merge (template: Contexto, Decisão, Consequências, Alternativas).
