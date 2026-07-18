import type { LocalizedText } from '@numerus/shared-kernel'
import type { RuleReference } from '../trace/calculation-trace'

const text = (ptBR: string, en: string, es: string): LocalizedText => ({ 'pt-BR': ptBR, en, es })

/** Regras da sinastria — válidas para qualquer escola (combinam os números individuais). */
export const SYNASTRY_RULES = {
  unionFromReducedValues: {
    id: 'synastry/union-from-reduced',
    rule: text(
      'Cada número da união soma os valores JÁ REDUZIDOS do mesmo número de cada pessoa e reduz o total, preservando mestres. A escola de origem é a mesma dos dois números individuais.',
      'Each union number sums the ALREADY-REDUCED value of the same number from each person and reduces the total, preserving masters. The source school is the same as both individual numbers.',
      'Cada número de la unión suma los valores YA REDUCIDOS del mismo número de cada persona y reduce el total, preservando maestros. La escuela de origen es la misma de ambos números individuales.',
    ),
    source: text(
      'Prática consolidada na numerologia de relacionamentos (sinastria) moderna.',
      'Consolidated practice in modern relationship (synastry) numerology.',
      'Práctica consolidada en la numerología de relaciones (sinastría) moderna.',
    ),
  },
  reflectionNotVerdict: {
    id: 'synastry/reflection-not-verdict',
    rule: text(
      'Os números da união são vocabulário para reflexão sobre a relação — nunca um veredito de compatibilidade. Convergência de um número não é evidência de harmonia, nem divergência é de conflito.',
      'Union numbers are vocabulary for reflecting on the relationship — never a compatibility verdict. A converging number is not evidence of harmony, nor is a diverging one of conflict.',
      'Los números de la unión son vocabulario para reflexionar sobre la relación — nunca un veredicto de compatibilidad. Que un número converja no es evidencia de armonía, ni que diverja lo es de conflicto.',
    ),
    source: text(
      'Postura epistêmica do produto (§9): linguagem de reflexão, não de veredito.',
      'Product epistemic stance (§9): language of reflection, not verdict.',
      'Postura epistémica del producto (§9): lenguaje de reflexión, no de veredicto.',
    ),
  },
} as const satisfies Record<string, RuleReference>
