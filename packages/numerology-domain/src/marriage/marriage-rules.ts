import type { LocalizedText } from '@numerus/shared-kernel'
import type { RuleReference } from '../trace/calculation-trace'

const text = (ptBR: string, en: string, es: string): LocalizedText => ({ 'pt-BR': ptBR, en, es })

/** Regras da união formal (§2.3, item 3). */
export const MARRIAGE_RULES = {
  governingFromWeddingDate: {
    id: 'marriage/governing-number',
    rule: text(
      'O número regente da união formal é o Caminho de Vida da DATA DO CASAMENTO — a união tem sua própria vibração de destino, independente das duas pessoas.',
      'The governing number of the formal union is the Life Path of the WEDDING DATE — the union has its own destiny vibration, independent of the two people.',
      'El número regente de la unión formal es el Camino de Vida de la FECHA DE LA BODA — la unión tiene su propia vibración de destino, independiente de las dos personas.',
    ),
    source: text(
      'Prática consolidada na numerologia de relacionamentos moderna.',
      'Consolidated practice in modern relationship numerology.',
      'Práctica consolidada en la numerología de relaciones moderna.',
    ),
  },
  personalYearOfMarriage: {
    id: 'marriage/personal-year',
    rule: text(
      'O Ano Pessoal do casamento trata a data do casamento como o "nascimento" da união e calcula o Ano Pessoal dela para a data de referência — o momento do ciclo em que a união está.',
      'The marriage Personal Year treats the wedding date as the "birth" of the union and computes its Personal Year for the reference date — the point in the cycle the union is in.',
      'El Año Personal del matrimonio trata la fecha de la boda como el "nacimiento" de la unión y calcula su Año Personal para la fecha de referencia — el punto del ciclo en que está la unión.',
    ),
    source: text(
      'Prática consolidada na numerologia de relacionamentos moderna.',
      'Consolidated practice in modern relationship numerology.',
      'Práctica consolidada en la numerología de relaciones moderna.',
    ),
  },
} as const satisfies Record<string, RuleReference>
