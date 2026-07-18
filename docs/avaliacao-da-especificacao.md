# Avaliação da Especificação — Sistema de Numerologia Multi-Modelo

**Data:** 2026-07-18 · **Avaliador:** arquitetura (Claude Code) · **Fonte:** `PROMPT_Sistema_Numerologia.md`

## Veredito geral

A especificação é **acima da média e implementável**. Os três pilares — motor que retorna *cálculos* e não números (§3.1), device-first como garantia técnica (§1.1) e entitlements desde o dia 1 — são decisões corretas e raras em specs de produto. O plano abaixo (`plano-de-implementacao.md`) parte dela sem alterações estruturais.

## Pontos fortes (manter como estão)

1. **Contrato trace-first (§3.1).** "É proibido produzir número sem produzir traço" elimina por construção a divergência entre o que o sistema calcula e o que explica. É a decisão de maior valor da spec.
2. **Device-first no Usuário Pessoal como garantia técnica.** Motor TS puro no cliente + backup cifrado manual em vez de sync E2E é o trade-off certo para v1: cobre "troquei de aparelho" sem derivação de chaves, pareamento e recuperação de senha.
3. **Entitlements em vez de roles.** `canExportDetailedPdf` no use case + RLS como rede de segurança evita o retrofit de autorização — a dívida mais cara citada, corretamente, pela própria spec.
4. **Honestidade epistêmica como requisito (§9).** Divergência entre escolas exposta em vez de escondida é diferencial de produto e reduz risco reputacional/jurídico (linguagem não determinista).
5. **Plugabilidade com critério objetivo (§2.1).** "Nova escola sem tocar no núcleo" é testável: se um PR de escola nova altera arquivo fora de `models/` + registry, falhou.

## Riscos e tensões (com recomendação)

| # | Risco | Recomendação |
|---|---|---|
| 1 | **Escopo de v1 grande**: 3 idiomas, 8 escolas, web+mobile. | Manter o roadmap por fatias e resistir a paralelizar fases. A Fatia 1 valida o contrato de traço antes de qualquer escala. |
| 2 | **Tensão "sem cadastro" × "3 leituras"**: modo convidado efêmero (§7) não pode ter contador server-side confiável. | Decisão registrada: convidado tem leitura livre e efêmera **na sessão**; o trial contado de 3 leituras começa **na criação da conta** (`UsageCounter` por conta, só números/timestamps). Qualquer contagem por device-fingerprint seria contornável e hostil à LGPD. |
| 3 | **Ambiguidade do Y (vogal/consoante)** afeta Motivação/Impressão. | Tratar como **variante explícita** do modelo (regra da spec §4.3). Não afeta a Fatia 1 (Expressão usa todas as letras). |
| 4 | **Variantes de redução da Expressão** (reduzir cada nome antes de somar × somar todos os dígitos) mudam resultado e dívidas cármicas. | Implementado desde a Fatia 1 como variante declarada no traço (`reduce-words-then-sum` default). Ver ADR-0003. |
| 5 | **Criptografia de PII em repouso**: pgcrypto simples mistura chave e dado no mesmo lugar. | Preferir **envelope encryption** (chave por tenant fora do banco) quando a persona Profissional chegar (Fase 5). Exige ADR próprio antes da Fase 5. |
| 6 | **Gematria/transliteração** é o engine de maior esforço e menor audiência. | Manter na Fase 8; o contrato de "múltiplas candidatas" já está previsto no port desde já (saída múltipla, nunca chute — §4.3). |
| 7 | **Dado sensível por inferência** (convicção filosófica/religiosa, art. 5º II LGPD). | Elaborar **RIPD/DPIA** antes da Fase 5 (primeira persistência de terceiros). O modo efêmero da persona pessoal já é a maior mitigação. |
| 8 | **Partículas do nome** ("de", "da", "dos") e caracteres não latinos. | Política explícita e documentada (ADR-0002): partículas **entram** no cálculo; caractere não conversível é **erro explícito**, nunca descarte silencioso. |

## Lacunas pequenas encontradas na spec

- A numeração de §1.1 "Implicações arquiteturais" pula o item 5 (1, 2, 3, 4, 6) — sem impacto.
- `LICENSE` não é definida (produto proprietário presumido; repositório marcado `private`). Definir antes de qualquer publicação de pacote.
- A spec cita Maestro/Detox para mobile sem decidir — vira ADR na Fase 4.

## Conclusão

Especificação aprovada para execução. A Fatia 1 (Pessoa + Pitagórico + Expressão, traço educacional end-to-end na web) foi implementada neste repositório como validação do contrato central. Decisões de domínio tomadas durante a fatia estão registradas em `docs/architecture/adr/`.
