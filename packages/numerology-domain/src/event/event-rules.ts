import type { LocalizedText } from '@numerus/shared-kernel'
import type { RuleReference } from '../trace/calculation-trace'

const text = (ptBR: string, en: string, es: string): LocalizedText => ({ 'pt-BR': ptBR, en, es })

/** Regras do sujeito Evento/data (§2.3): a vibração de uma data específica. */
export const EVENT_RULES = {
  vibrationFromDate: {
    id: 'event/vibration',
    rule: text(
      'A vibração de um evento é o Caminho de Vida da SUA DATA — a mesma redução de dígitos de data usada para uma pessoa, aplicada ao dia do evento. Independente de escola.',
      "An event's vibration is the Life Path of ITS DATE — the same date-digit reduction used for a person, applied to the event's day. School-independent.",
      'La vibración de un evento es el Camino de Vida de SU FECHA — la misma reducción de dígitos de fecha usada para una persona, aplicada al día del evento. Independiente de escuela.',
    ),
    source: text(
      'Redução de datas (ADR-0005), re-rotulada para o contexto de evento.',
      'Date reduction (ADR-0005), relabeled for the event context.',
      'Reducción de fechas (ADR-0005), reetiquetada para el contexto de evento.',
    ),
  },
  personalYearOfEvent: {
    id: 'event/personal-year',
    rule: text(
      'O Ano Pessoal do evento trata a data do evento como um "nascimento" e calcula o Ano Pessoal dela para a data de referência — em que ponto do ciclo o evento está.',
      'The event Personal Year treats the event date as a "birth" and computes its Personal Year for the reference date — where in the cycle the event sits.',
      'El Año Personal del evento trata la fecha del evento como un "nacimiento" y calcula su Año Personal para la fecha de referencia — en qué punto del ciclo está el evento.',
    ),
    source: text(
      'Números de tempo (ADR-0007), re-rotulados para o contexto de evento.',
      'Time numbers (ADR-0007), relabeled for the event context.',
      'Números de tiempo (ADR-0007), reetiquetados para el contexto de evento.',
    ),
  },
} as const satisfies Record<string, RuleReference>
