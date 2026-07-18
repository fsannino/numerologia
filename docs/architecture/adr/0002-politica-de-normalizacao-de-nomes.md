# ADR-0002 — Política de normalização de nomes

**Status:** aceita · **Data:** 2026-07-18

## Contexto

Nomes reais contêm acentos, `ç`, hífens, apóstrofos, espaços múltiplos e partículas ("de", "da", "dos"). A conversão letra→número exige uma política **explícita e documentada** (decisão de domínio, §4.4 da spec). Descartar caracteres em silêncio produziria números errados sem que o usuário perceba — violaria o princípio "ambiguidade nunca vira chute" (§4.3).

## Decisão

Política aplicada por `NameNormalizationPolicy` no domínio, e **registrada como passo do traço** (o usuário vê o nome original e o normalizado):

1. **Unicode NFD + remoção de marcas combinantes**: `Á→A`, `ã→A`, `ç→C`, `ü→U`.
2. **Caixa alta** para o alfabeto de cálculo (A–Z).
3. **Separadores de palavra**: espaços (colapsados) e **hífen** — "Ana-Clara" são duas palavras de cálculo.
4. **Apóstrofo é removido e as letras se unem**: "D'Ávila" → palavra única `DAVILA`.
5. **Partículas ("de", "da", "dos", "e", ...) entram no cálculo** como palavras normais — prática majoritária das escolas em pt-BR. Excluí-las será uma *variante explícita* futura, nunca um default silencioso.
6. **Caractere não conversível para A–Z (dígito, símbolo, alfabeto não latino) é erro explícito** (`unsupported-character`), com posição e caractere apontados. Nunca descarte silencioso. Suporte a hebraico chega com a camada de transliteração da Gematria (Fase 8), que retorna múltiplas candidatas.

## Consequências

- O traço educacional mostra a normalização como primeiro passo — transparência total.
- Usuários com nomes não latinos recebem mensagem honesta de limitação em vez de resultado errado.
- A política é uma só para todas as escolas latinas; escolas com alfabeto próprio definem a sua na fronteira do engine.

## Alternativas consideradas

- **Descartar caracteres desconhecidos:** produz resultado silenciosamente errado — rejeitada.
- **Excluir partículas por default:** divide as escolas; virou variante explícita futura.
