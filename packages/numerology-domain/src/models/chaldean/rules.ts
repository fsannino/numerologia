import type { LocalizedText } from '@numerus/shared-kernel'
import type { RuleReference } from '../../trace/calculation-trace'

const text = (ptBR: string, en: string, es: string): LocalizedText => ({ 'pt-BR': ptBR, en, es })

/** Regras da escola caldaica citáveis pelo traço (modo "por quê?", §3.2). */
export const CHALDEAN_RULES = {
  letterTable: {
    id: 'chaldean/letter-table',
    rule: text(
      'Cada letra recebe um valor de 1 a 8 por afinidade fonética/vibração — não pela posição alfabética. Nenhuma letra vale 9, número considerado sagrado nesta tradição.',
      'Each letter maps to 1–8 by phonetic/vibrational affinity — not alphabetical position. No letter maps to 9, considered sacred in this tradition.',
      'Cada letra recibe un valor del 1 al 8 por afinidad fonética/vibracional — no por posición alfabética. Ninguna letra vale 9, número considerado sagrado en esta tradición.',
    ),
    source: text(
      'Tradição atribuída à Caldeia/Babilônia; popularizada no Ocidente por "Cheiro" (William John Warner, 1866–1936).',
      'Tradition attributed to Chaldea/Babylon; popularized in the West by "Cheiro" (William John Warner, 1866–1936).',
      'Tradición atribuida a Caldea/Babilonia; popularizada en Occidente por "Cheiro" (William John Warner, 1866–1936).',
    ),
  },
  compoundIsFirstClass: {
    id: 'chaldean/compound-number',
    rule: text(
      'O número COMPOSTO (o total antes da redução, ex.: 23) é lido e interpretado ANTES do dígito reduzido — na escola caldaica ele é dado de saída, não etapa intermediária.',
      'The COMPOUND number (the total before reduction, e.g. 23) is read and interpreted BEFORE the reduced digit — in the Chaldean school it is an output, not an intermediate step.',
      'El número COMPUESTO (el total antes de la reducción, p. ej. 23) se lee e interpreta ANTES del dígito reducido — en la escuela caldea es un dato de salida, no una etapa intermedia.',
    ),
    source: text(
      'Cheiro, "Cheiro\'s Book of Numbers" (1926).',
      'Cheiro, "Cheiro\'s Book of Numbers" (1926).',
      'Cheiro, "Cheiro\'s Book of Numbers" (1926).',
    ),
  },
  noMasterPreservation: {
    id: 'chaldean/no-master-preservation',
    rule: text(
      'A redução caldaica vai até o dígito 1–9 sem interromper em 11/22/33: o significado especial desses totais vive na leitura do número composto.',
      'Chaldean reduction goes all the way to 1–9 without stopping at 11/22/33: the special meaning of those totals lives in the compound-number reading.',
      'La reducción caldea llega hasta el dígito 1–9 sin detenerse en 11/22/33: el significado especial de esos totales vive en la lectura del número compuesto.',
    ),
    source: text(
      'Cheiro, "Cheiro\'s Book of Numbers" (1926); os compostos 10–52 têm leituras próprias.',
      'Cheiro, "Cheiro\'s Book of Numbers" (1926); compounds 10–52 have their own readings.',
      'Cheiro, "Cheiro\'s Book of Numbers" (1926); los compuestos 10–52 tienen lecturas propias.',
    ),
  },
  nameNumbersScope: {
    id: 'chaldean/name-numbers',
    rule: text(
      'Os números do nome caldeus somam TODAS as letras consideradas de uma vez (o composto é do nome inteiro): Expressão (todas), Motivação (vogais), Impressão (consoantes) e Chave (primeiro nome).',
      'Chaldean name numbers sum ALL considered letters at once (the compound belongs to the whole name): Expression (all), Motivation (vowels), Impression (consonants) and Key (first name).',
      'Los números del nombre caldeos suman TODAS las letras consideradas de una vez (el compuesto es del nombre entero): Expresión (todas), Motivación (vocales), Impresión (consonantes) y Clave (primer nombre).',
    ),
    source: text(
      'Prática consolidada nos manuais caldeus modernos.',
      'Consolidated practice in modern Chaldean manuals.',
      'Práctica consolidada en los manuales caldeos modernos.',
    ),
  },
} as const satisfies Record<string, RuleReference>
