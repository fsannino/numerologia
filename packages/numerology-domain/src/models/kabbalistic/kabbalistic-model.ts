import type { Result } from '@numerus/shared-kernel'
import { err, ok } from '@numerus/shared-kernel'
import type { NumberKind, SubjectKind } from '../../model-ids'
import type { Subject } from '../../entities/person-subject'
import type { CalculationTrace } from '../../trace/calculation-trace'
import type { CalculationError, CalculationRequest, NumerologyModel } from '../../ports/numerology-model'
import { calculateKabbalisticName } from './kabbalistic-numbers'

const SUPPORTED_SUBJECTS: ReadonlySet<SubjectKind> = new Set(['person'])
const SUPPORTED_NUMBERS: ReadonlySet<NumberKind> = new Set<NumberKind>(['kabbalistic-name'])

/**
 * Numerologia Cabalística (adaptação latina). Vive inteira em
 * `models/kabbalistic/` (§4.3). NÃO reescreve tabelas — DELEGA a aritmética às
 * tabelas pitagórica e caldaica já existentes (fonte única de verdade, R4), o
 * que torna a detecção de coincidência provada em vez de presumida (ADR-0011).
 * Opera só sobre o nome (a data não entra). Sem tabela única entre autores:
 * expõe a Matriz de Leituras, nunca uma resposta silenciosa (§9).
 */
export const kabbalisticModel: NumerologyModel = {
  id: 'kabbalistic',
  metadata: {
    name: { 'pt-BR': 'Cabalística', en: 'Kabbalistic', es: 'Cabalística' },
    historicalOrigin: {
      'pt-BR':
        'Adaptação moderna de princípios cabalísticos (Cabala, tradição mística judaica; 22 letras hebraicas e a Árvore da Vida) ao alfabeto latino. A tabela de correspondência não é padronizada entre autores — o produto expõe as leituras concorrentes em vez de escolher uma.',
      en: 'Modern adaptation of Kabbalistic principles (Kabbalah, Jewish mystical tradition; 22 Hebrew letters and the Tree of Life) to the Latin alphabet. The correspondence table is not standardized across authors — the product exposes the competing readings instead of picking one.',
      es: 'Adaptación moderna de principios cabalísticos (Cábala, tradición mística judía; 22 letras hebreas y el Árbol de la Vida) al alfabeto latino. La tabla de correspondencia no está estandarizada entre autores — el producto expone las lecturas concurrentes en vez de elegir una.',
    },
    sources: [
      'Adaptação latina de princípios cabalísticos (Trevisani; C. Rosa)',
      'Sefer Yetzirah (22 caminhos da Árvore da Vida)',
    ],
    canonicity: 'modern-systematization',
    standardization: 'unstandardized',
    variantDimensions: [],
  },
  supportedSubjects: SUPPORTED_SUBJECTS,
  supportedNumbers: SUPPORTED_NUMBERS,

  calculate(subject: Subject, request: CalculationRequest): Result<ReadonlyArray<CalculationTrace>, CalculationError> {
    if (!SUPPORTED_SUBJECTS.has(subject.kind)) {
      return err({ code: 'unsupported-subject', subject: subject.kind, model: 'kabbalistic' })
    }
    const unsupported = request.numbers.find((number) => !SUPPORTED_NUMBERS.has(number))
    if (unsupported !== undefined) {
      return err({ code: 'unsupported-number', number: unsupported, model: 'kabbalistic' })
    }
    if (!request.numbers.includes('kabbalistic-name')) {
      return ok([])
    }
    return ok([calculateKabbalisticName(subject.birthName)])
  },
}
