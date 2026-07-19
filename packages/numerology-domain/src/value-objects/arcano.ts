/**
 * Redução "arcano" (mod 22) da numerologia cabalística: em vez de fechar em
 * 1–9, fecha em 1–22 — porque o sistema tem 22 letras hebraicas, ligadas aos
 * 22 caminhos da Árvore da Vida. É a única aritmética própria da cabalística
 * (o resto ela delega às tabelas pitagórica/caldaica).
 *
 * Fórmula modular cíclica: ((total − 1) mod 22) + 1. Ex.: 62 → 18; 52 → 8.
 * NÃO carrega significado — apenas o número do arcano (o nome/leitura do
 * arcano só entra com fonte citável, §9, ADR-0011).
 */
const ARCANO_COUNT = 22

export function reduceToArcano(raw: number): number {
  if (!Number.isInteger(raw) || raw < 1) {
    throw new RangeError(`reduceToArcano espera inteiro ≥ 1, recebeu ${raw}`)
  }
  return ((raw - 1) % ARCANO_COUNT) + 1
}
