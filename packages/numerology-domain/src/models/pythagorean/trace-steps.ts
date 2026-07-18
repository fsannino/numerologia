import type { LocalizedText } from '@numerus/shared-kernel'
import type { NumerologyValue } from '../../value-objects/numerology-value'
import { isMasterNumber, karmicDebtOf } from '../../value-objects/numerology-value'
import type { CalculationStep, LetterMappingEntry } from '../../trace/calculation-trace'

/** Construtores de passos compartilhados pelos cálculos da escola pitagórica. */

export const text = (ptBR: string, en: string, es?: string): LocalizedText => ({
  'pt-BR': ptBR,
  en,
  ...(es !== undefined ? { es } : {}),
})

export function letterMappingStep(
  word: string,
  entries: ReadonlyArray<LetterMappingEntry>,
): CalculationStep {
  return {
    kind: 'letter-mapping',
    title: text(`Conversão das letras de "${word}"`, `Letter conversion for "${word}"`, `Conversión de las letras de "${word}"`),
    explanation: text(
      'Cada letra é convertida pelo seu valor na tabela pitagórica (1–9).',
      'Each letter is converted using its value in the Pythagorean table (1–9).',
      'Cada letra se convierte según su valor en la tabla pitagórica (1–9).',
    ),
    input: { word },
    output: { entries },
    visual: 'letter-table',
  }
}

export function sumStep(
  label: LocalizedText,
  parcels: ReadonlyArray<number>,
  total: number,
  explanation: LocalizedText,
): CalculationStep {
  return {
    kind: 'sum',
    title: label,
    explanation,
    input: { parcels, label },
    output: { total },
    visual: 'sum',
  }
}

export function reductionStep(title: LocalizedText, value: NumerologyValue): CalculationStep {
  const chainText = value.chain.join(' → ')
  return {
    kind: 'reduction',
    title,
    explanation:
      value.chain.length === 1
        ? text(
            'O total já está entre 1 e 9 (ou é um número mestre): não há o que reduzir.',
            'The total is already 1–9 (or a master number): nothing to reduce.',
            'El total ya está entre 1 y 9 (o es un número maestro): no hay nada que reducir.',
          )
        : text(
            `Somamos os dígitos repetidamente até chegar a um número de 1 a 9 — parando antes se um mestre (11, 22, 33) aparecer: ${chainText}.`,
            `We repeatedly sum the digits until reaching 1–9 — stopping earlier if a master number (11, 22, 33) appears: ${chainText}.`,
            `Sumamos los dígitos repetidamente hasta llegar a un número del 1 al 9 — deteniéndonos antes si aparece un maestro (11, 22, 33): ${chainText}.`,
          ),
    input: { raw: value.raw },
    output: { value },
    visual: 'reduction-chain',
  }
}

export function masterCheckStep(candidate: number): CalculationStep {
  const isMaster = isMasterNumber(candidate)
  return {
    kind: 'master-check',
    title: text('Verificação de número mestre', 'Master number check', 'Verificación de número maestro'),
    explanation: isMaster
      ? text(
          `${candidate} é um número mestre — a redução para aqui.`,
          `${candidate} is a master number — reduction stops here.`,
          `${candidate} es un número maestro — la reducción se detiene aquí.`,
        )
      : text(
          `${candidate} não é 11, 22 nem 33; a redução pode prosseguir normalmente.`,
          `${candidate} is not 11, 22 or 33; reduction proceeds normally.`,
          `${candidate} no es 11, 22 ni 33; la reducción continúa normalmente.`,
        ),
    input: { candidate },
    output: { isMaster },
    visual: 'text',
  }
}

export function karmicCheckStep(inspectedTotals: ReadonlyArray<number>): CalculationStep {
  const debtsFound = inspectedTotals.filter((total) => karmicDebtOf(total) !== undefined)
  return {
    kind: 'karmic-check',
    title: text('Verificação de dívidas cármicas', 'Karmic debt check', 'Verificación de deudas kármicas'),
    explanation:
      debtsFound.length > 0
        ? text(
            `Os totais brutos ${debtsFound.join(', ')} pertencem ao conjunto 13/14/16/19 e são marcados como dívida cármica antes de reduzir.`,
            `Raw totals ${debtsFound.join(', ')} belong to the 13/14/16/19 set and are flagged as karmic debt before reducing.`,
            `Los totales brutos ${debtsFound.join(', ')} pertenecen al conjunto 13/14/16/19 y se marcan como deuda kármica antes de reducir.`,
          )
        : text(
            'Nenhum total bruto inspecionado é 13, 14, 16 ou 19 — não há dívida cármica neste cálculo.',
            'No inspected raw total equals 13, 14, 16 or 19 — no karmic debt in this calculation.',
            'Ningún total bruto inspeccionado es 13, 14, 16 o 19 — no hay deuda kármica en este cálculo.',
          ),
    input: { inspectedTotals },
    output: { debtsFound },
    visual: 'text',
  }
}
