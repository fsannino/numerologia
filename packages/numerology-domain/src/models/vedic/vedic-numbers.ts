import { ENGINE_VERSION } from '../../engine-version'
import type { LocalDate } from '../../value-objects/local-date'
import type { NumerologyValue } from '../../value-objects/numerology-value'
import { reduceToValue } from '../../value-objects/numerology-value'
import type { CalculationStep, CalculationTrace, DivergenceNote } from '../../trace/calculation-trace'
import { reductionStep, sumStep, text } from '../../trace/step-builders'
import { planetOf } from './planets'
import { VEDIC_RULES } from './vedic-rules'

function digitsOf(value: number): ReadonlyArray<number> {
  return [...String(value)].map(Number)
}

/** Passo de regência planetária: a assinatura interpretativa da escola védica. */
function planetaryRulerStep(reduced: number): CalculationStep {
  const planet = planetOf(reduced)
  return {
    kind: 'planetary-ruler',
    title: text('Regente planetário', 'Planetary ruler', 'Regente planetario'),
    explanation: text(
      `Na numerologia védica, o dígito ${reduced} é regido por ${planet.planet['pt-BR']} (${planet.sanskrit}) — o significado do número é o do seu planeta.`,
      `In Vedic numerology, the digit ${reduced} is ruled by ${planet.planet.en} (${planet.sanskrit}) — the meaning of the number is that of its planet.`,
      `En la numerología védica, el dígito ${reduced} está regido por ${planet.planet.es} (${planet.sanskrit}) — el significado del número es el de su planeta.`,
    ),
    input: { number: reduced },
    output: {
      planet: planet.planet,
      sanskrit: planet.sanskrit,
      symbol: planet.symbol,
      qualities: planet.qualities,
    },
    visual: 'planetary-ruler',
  }
}

/**
 * Nota de divergência (§2.4): a redução védica não preserva mestres. Quando
 * o mesmo total, lido com preservação de mestres (postura pitagórica), pararia
 * em 11/22/33, os dois métodos discordam — e isso é registrado, não escondido.
 */
function masterlessDivergence(id: string, raw: number, label: LabelText): ReadonlyArray<DivergenceNote> {
  const masterful = reduceToValue(raw, { preserveMasters: true })
  if (!masterful.isMaster) {
    return []
  }
  const vedic = reduceToValue(raw, { preserveMasters: false })
  return [
    {
      id,
      note: text(
        `O total ${raw} é um número mestre (${masterful.reduced}) quando se preserva mestres, como na escola pitagórica. A numerologia védica não preserva mestres: aqui o ${label['pt-BR']} reduz até ${vedic.reduced}. Os métodos divergem por regra explícita, não por engano.`,
        `The total ${raw} is a master number (${masterful.reduced}) when masters are preserved, as in the Pythagorean school. Vedic numerology does not preserve masters: here the ${label.en} reduces to ${vedic.reduced}. The methods diverge by explicit rule, not by mistake.`,
        `El total ${raw} es un número maestro (${masterful.reduced}) cuando se preservan maestros, como en la escuela pitagórica. La numerología védica no preserva maestros: aquí el ${label.es} se reduce hasta ${vedic.reduced}. Los métodos divergen por regla explícita, no por error.`,
      ),
    },
  ]
}

type LabelText = { readonly 'pt-BR': string; readonly en: string; readonly es: string }

/** Moolank (número raiz / psíquico): dia do nascimento reduzido a 1–9. */
export function calculateMoolank(date: LocalDate): CalculationTrace {
  const steps: CalculationStep[] = []
  const finalValue: NumerologyValue = reduceToValue(date.day, { preserveMasters: false })
  steps.push(
    reductionStep(
      text(
        `Redução do dia do nascimento (${date.day}) até a raiz`,
        `Reduction of the birth day (${date.day}) to its root`,
        `Reducción del día de nacimiento (${date.day}) hasta la raíz`,
      ),
      finalValue,
    ),
  )
  steps.push(planetaryRulerStep(finalValue.reduced))
  return {
    resultId: 'vedic-moolank',
    model: 'vedic',
    engineVersion: ENGINE_VERSION,
    variantSelections: {},
    finalValue,
    steps,
    ruleRefs: [VEDIC_RULES.moolankFromBirthDay, VEDIC_RULES.planetaryRulership],
    divergenceNotes: masterlessDivergence('vedic/moolank-masterless', date.day, {
      'pt-BR': 'Moolank',
      en: 'Moolank',
      es: 'Moolank',
    }),
  }
}

/** Bhagyank (número do destino): soma de todos os dígitos da data, reduzida a 1–9. */
export function calculateBhagyank(date: LocalDate): CalculationTrace {
  const steps: CalculationStep[] = []
  const allDigits = [...digitsOf(date.day), ...digitsOf(date.month), ...digitsOf(date.year)]
  const total = allDigits.reduce((accumulator, digit) => accumulator + digit, 0)
  steps.push(
    sumStep(
      text('Soma de todos os dígitos da data', 'Sum of every digit of the date', 'Suma de todos los dígitos de la fecha'),
      allDigits,
      total,
      text(
        'O Bhagyank soma todos os dígitos de dia, mês e ano de uma só vez.',
        'The Bhagyank sums every digit of day, month and year at once.',
        'El Bhagyank suma todos los dígitos de día, mes y año de una sola vez.',
      ),
    ),
  )
  const finalValue: NumerologyValue = reduceToValue(total, { preserveMasters: false })
  steps.push(reductionStep(text('Redução até a raiz', 'Reduction to the root', 'Reducción hasta la raíz'), finalValue))
  steps.push(planetaryRulerStep(finalValue.reduced))
  return {
    resultId: 'vedic-bhagyank',
    model: 'vedic',
    engineVersion: ENGINE_VERSION,
    variantSelections: {},
    finalValue,
    steps,
    ruleRefs: [VEDIC_RULES.bhagyankFromBirthDate, VEDIC_RULES.planetaryRulership],
    divergenceNotes: masterlessDivergence('vedic/bhagyank-masterless', total, {
      'pt-BR': 'Bhagyank',
      en: 'Bhagyank',
      es: 'Bhagyank',
    }),
  }
}
