import type { LocalizedText } from '@numerus/shared-kernel'
import type { RuleReference } from '../../trace/calculation-trace'

const text = (ptBR: string, en: string): LocalizedText => ({ 'pt-BR': ptBR, en })

/**
 * Regras da escola pitagórica citáveis pelo traço (modo "por quê?", §3.2).
 * A origem histórica é declarada com honestidade epistêmica (§9): o sistema
 * moderno foi estruturado por L. Dow Balliett e Juno Jordan (séc. XIX–XX),
 * reivindicando a herança pitagórica.
 */
export const PYTHAGOREAN_RULES = {
  letterTable: {
    id: 'pythagorean/letter-table',
    rule: text(
      'Cada letra recebe um valor de 1 a 9 conforme sua posição no alfabeto latino, reiniciando a cada nove letras (A=1 … I=9, J=1 …).',
      'Each letter maps to 1–9 by its position in the Latin alphabet, restarting every nine letters (A=1 … I=9, J=1 …).',
    ),
    source: text(
      'Sistema moderno estruturado por L. Dow Balliett e Juno Jordan (fim do séc. XIX / início do XX), reivindicando a herança pitagórica.',
      'Modern system structured by L. Dow Balliett and Juno Jordan (late 19th / early 20th century), claiming the Pythagorean heritage.',
    ),
  },
  expressionUsesAllLetters: {
    id: 'pythagorean/expression-all-letters',
    rule: text(
      'O número de Expressão soma TODAS as letras do nome completo de nascimento — vogais e consoantes.',
      'The Expression number sums ALL letters of the full birth name — vowels and consonants.',
    ),
    source: text('Juno Jordan, "Numerology: The Romance in Your Name" (1965).', 'Juno Jordan, "Numerology: The Romance in Your Name" (1965).'),
  },
  masterNumbers: {
    id: 'pythagorean/master-numbers',
    rule: text(
      'Os números mestres 11, 22 e 33 não são reduzidos: a redução para quando um total atinge um deles.',
      'Master numbers 11, 22 and 33 are not reduced: reduction stops when a total reaches one of them.',
    ),
    source: text('Convenção consolidada na numerologia moderna (Balliett/Jordan).', 'Convention consolidated in modern numerology (Balliett/Jordan).'),
  },
  karmicDebts: {
    id: 'pythagorean/karmic-debts',
    rule: text(
      'Os totais brutos 13, 14, 16 e 19, quando aparecem antes de uma redução, são marcados como dívidas cármicas — inclusive as "ocultas" em totais intermediários.',
      'Raw totals 13, 14, 16 and 19 appearing before a reduction are flagged as karmic debts — including "hidden" ones in intermediate totals.',
    ),
    source: text('Tradição numerológica moderna; a detecção exige preservar o valor bruto antes de reduzir.', 'Modern numerological tradition; detection requires preserving the raw value before reducing.'),
  },
} as const satisfies Record<string, RuleReference>
