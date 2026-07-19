import type { Result } from '@numerus/shared-kernel'
import { err, ok } from '@numerus/shared-kernel'
import type { NumberKind, SubjectKind } from '../../model-ids'
import type { Subject } from '../../entities/person-subject'
import type { CalculationTrace } from '../../trace/calculation-trace'
import type { CalculationError, CalculationRequest, NumerologyModel } from '../../ports/numerology-model'
import { calculateBhagyank, calculateMoolank } from './vedic-numbers'

const SUPPORTED_SUBJECTS: ReadonlySet<SubjectKind> = new Set(['person'])
const SUPPORTED_NUMBERS: ReadonlySet<NumberKind> = new Set<NumberKind>(['vedic-moolank', 'vedic-bhagyank'])

/**
 * Escola védica (Ank Jyotish). Quinta escola do registry — vive inteira em
 * `models/vedic/` (§4.3). Derivada de data: Moolank (dia) e Bhagyank (data
 * completa), cada um com sua graha regente. Não preserva números mestres.
 */
export const vedicModel: NumerologyModel = {
  id: 'vedic',
  metadata: {
    name: { 'pt-BR': 'Védica (indiana)', en: 'Vedic (Indian)', es: 'Védica (india)' },
    historicalOrigin: {
      'pt-BR':
        'Numerologia védica (Ank Jyotish), da tradição da astrologia indiana. Deriva da data de nascimento o Moolank (número raiz) e o Bhagyank (número do destino), cada dígito regido por uma graha (planeta). Reduz sempre a um único dígito 1–9, sem números mestres.',
      en: 'Vedic numerology (Ank Jyotish), from the Indian astrology tradition. It derives the Moolank (root number) and Bhagyank (destiny number) from the birth date, each digit ruled by a graha (planet). It always reduces to a single digit 1–9, with no master numbers.',
      es: 'Numerología védica (Ank Jyotish), de la tradición de la astrología india. Deriva de la fecha de nacimiento el Moolank (número raíz) y el Bhagyank (número del destino), cada dígito regido por una graha (planeta). Reduce siempre a un solo dígito 1–9, sin números maestros.',
    },
    sources: ['Ank Jyotish (numerologia védica / indiana)'],
    canonicity: 'documented-tradition',
    standardization: 'standardized',
    variantDimensions: [],
  },
  supportedSubjects: SUPPORTED_SUBJECTS,
  supportedNumbers: SUPPORTED_NUMBERS,

  calculate(subject: Subject, request: CalculationRequest): Result<ReadonlyArray<CalculationTrace>, CalculationError> {
    if (!SUPPORTED_SUBJECTS.has(subject.kind)) {
      return err({ code: 'unsupported-subject', subject: subject.kind, model: 'vedic' })
    }
    const unsupported = request.numbers.find((number) => !SUPPORTED_NUMBERS.has(number))
    if (unsupported !== undefined) {
      return err({ code: 'unsupported-number', number: unsupported, model: 'vedic' })
    }
    const [firstNumber] = request.numbers
    if (firstNumber === undefined) {
      return ok([])
    }
    if (subject.birthDate === undefined) {
      // A escola védica é inteiramente derivada de data: sem data, erro tipado.
      return err({ code: 'missing-birth-date', number: firstNumber })
    }

    const date = subject.birthDate
    const byKind: Record<'vedic-moolank' | 'vedic-bhagyank', () => CalculationTrace> = {
      'vedic-moolank': () => calculateMoolank(date),
      'vedic-bhagyank': () => calculateBhagyank(date),
    }
    const traces = request.numbers.map((number) => byKind[number as 'vedic-moolank' | 'vedic-bhagyank']())
    return ok(traces)
  },
}
