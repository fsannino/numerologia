import type { LocalizedText } from '@numerus/shared-kernel'
import type { RuleReference } from '../../trace/calculation-trace'

const text = (ptBR: string, en: string, es: string): LocalizedText => ({ 'pt-BR': ptBR, en, es })

/** Regras da grade Lo Shu (numerologia chinesa). */
export const LO_SHU_RULES = {
  gridFromBirthDate: {
    id: 'lo-shu/grid-from-date',
    rule: text(
      'Os dígitos da data de nascimento (dia, mês e ano) são colocados no quadrado mágico Lo Shu (4-9-2 / 3-5-7 / 8-1-6). O zero não ocupa posição; cada dígito 1–9 pode repetir. A grade mostra presença, ausência e repetição.',
      'The birth-date digits (day, month and year) are placed on the Lo Shu magic square (4-9-2 / 3-5-7 / 8-1-6). Zero takes no position; each digit 1–9 may repeat. The grid shows presence, absence and repetition.',
      'Los dígitos de la fecha de nacimiento (día, mes y año) se colocan en el cuadrado mágico Lo Shu (4-9-2 / 3-5-7 / 8-1-6). El cero no ocupa posición; cada dígito 1–9 puede repetirse. La cuadrícula muestra presencia, ausencia y repetición.',
    ),
    source: text(
      'Tradição da numerologia chinesa (quadrado Lo Shu), atribuída ao mito do rio Luo.',
      'Chinese numerology tradition (Lo Shu square), attributed to the Luo River myth.',
      'Tradición de la numerología china (cuadrado Lo Shu), atribuida al mito del río Luo.',
    ),
  },
  arrowsOfStrengthAndAbsence: {
    id: 'lo-shu/arrows',
    rule: text(
      'Uma linha (horizontal, vertical ou diagonal) com os três números presentes forma uma "seta de força"; com os três ausentes, uma "seta de ausência" — um convite a desenvolver aquela qualidade, não um veredito (§9).',
      'A line (row, column or diagonal) with all three numbers present forms an "arrow of strength"; with all three absent, an "arrow of absence" — an invitation to develop that quality, not a verdict (§9).',
      'Una línea (fila, columna o diagonal) con los tres números presentes forma una "flecha de fuerza"; con los tres ausentes, una "flecha de ausencia" — una invitación a desarrollar esa cualidad, no un veredicto (§9).',
    ),
    source: text(
      'Tradição da numerologia chinesa; postura epistêmica do produto (§9).',
      'Chinese numerology tradition; product epistemic stance (§9).',
      'Tradición de la numerología china; postura epistémica del producto (§9).',
    ),
  },
} as const satisfies Record<string, RuleReference>
