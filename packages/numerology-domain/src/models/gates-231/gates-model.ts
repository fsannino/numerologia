import type { LocalizedText, Result } from '@numerus/shared-kernel'
import { err, ok } from '@numerus/shared-kernel'
import { ENGINE_VERSION } from '../../engine-version'
import type { NumberKind, SubjectKind } from '../../model-ids'
import type { Subject } from '../../entities/person-subject'
import type { CalculationStep, CalculationTrace, HebrewLetter } from '../../trace/calculation-trace'
import type {
  CalculationError,
  CalculationRequest,
  NumerologyModel,
  VariantDimension,
} from '../../ports/numerology-model'
import { reduceToValue } from '../../value-objects/numerology-value'
import { text } from '../../trace/step-builders'
import { transliterate } from '../gematria/transliteration'
import { HEBREW_ALPHABET } from './hebrew-alphabet'
import {
  DEFAULT_GATE_ACTIVATION,
  GATE_ACTIVATION_DIMENSION,
  activatedGates,
  allGates,
  type GateActivationVariant,
} from './gates'
import { GATES_RULES } from './gates-rules'

const SUPPORTED_SUBJECTS: ReadonlySet<SubjectKind> = new Set(['person'])
const SUPPORTED_NUMBERS: ReadonlySet<NumberKind> = new Set<NumberKind>(['gates-231-structure'])

const VARIANT_OPTIONS = ['distinct-letter-pairs', 'adjacent-pairs'] as const

function label(variant: GateActivationVariant): LocalizedText {
  return variant === 'distinct-letter-pairs'
    ? text('pares de letras distintas', 'distinct-letter pairs', 'pares de letras distintas')
    : text('pares de letras vizinhas', 'adjacent-letter pairs', 'pares de letras vecinas')
}

const GATE_ACTIVATION: VariantDimension = {
  dimension: GATE_ACTIVATION_DIMENSION,
  label: text('231 Portões: modo de ativação (não-canônico)', '231 Gates: activation mode (non-canonical)', '231 Puertas: modo de activación (no canónico)'),
  options: VARIANT_OPTIONS.map((id) => ({
    id,
    label: label(id),
    description: text(
      'Construção contemporânea — não há fonte canônica para aplicar os portões a um nome.',
      'Contemporary construction — there is no canonical source for applying the gates to a name.',
      'Construcción contemporánea — no hay fuente canónica para aplicar las puertas a un nombre.',
    ),
  })),
  defaultOption: DEFAULT_GATE_ACTIVATION,
}

/** Normaliza a candidata padrão para a letra do alfabeto de mesmo valor (ex.: shin). */
function alphabetLetterFor(value: number, fallback: HebrewLetter): HebrewLetter {
  return HEBREW_ALPHABET.find((letter) => letter.value === value) ?? fallback
}

function resolveVariant(request: CalculationRequest): Result<GateActivationVariant, CalculationError> {
  const chosen = request.variantSelections?.[GATE_ACTIVATION_DIMENSION]
  if (chosen === undefined) {
    return ok(DEFAULT_GATE_ACTIVATION)
  }
  if (chosen === 'distinct-letter-pairs' || chosen === 'adjacent-pairs') {
    return ok(chosen)
  }
  return err({ code: 'unknown-variant', dimension: GATE_ACTIVATION_DIMENSION, option: chosen })
}

/**
 * Escola dos 231 Portões (Sefer Yetzirah). Explorador ESTRUTURAL, não
 * interpretativo: os 231 portões são derivados das 22 letras (C(22,2)), e o
 * nome "ativa" um subconjunto por um modo explicitamente não-canônico. Zero
 * texto de leitura por portão — só estrutura, valores e a referência (ADR-0012).
 */
export const gates231Model: NumerologyModel = {
  id: 'gates-231',
  metadata: {
    name: { 'pt-BR': '231 Portões', en: '231 Gates', es: '231 Puertas' },
    historicalOrigin: {
      'pt-BR':
        'Os 231 portões do Sefer Yetzirah (2:4): as combinações de pares das 22 letras hebraicas na cosmogonia da criação. A aplicação a um nome não tem fonte canônica — aqui é um explorador estrutural, com o modo de ativação marcado como construção contemporânea.',
      en: 'The 231 gates of the Sefer Yetzirah (2:4): the pairwise combinations of the 22 Hebrew letters in the cosmogony of creation. Applying it to a name has no canonical source — here it is a structural explorer, with the activation mode marked as a contemporary construction.',
      es: 'Las 231 puertas del Sefer Yetzirah (2:4): las combinaciones de pares de las 22 letras hebreas en la cosmogonía de la creación. Su aplicación a un nombre no tiene fuente canónica — aquí es un explorador estructural, con el modo de activación marcado como construcción contemporánea.',
    },
    sources: ['Sefer Yetzirah 2:4'],
    canonicity: 'contemporary-construction',
    standardization: 'unstandardized',
    variantDimensions: [GATE_ACTIVATION],
  },
  supportedSubjects: SUPPORTED_SUBJECTS,
  supportedNumbers: SUPPORTED_NUMBERS,

  calculate(subject: Subject, request: CalculationRequest): Result<ReadonlyArray<CalculationTrace>, CalculationError> {
    if (!SUPPORTED_SUBJECTS.has(subject.kind)) {
      return err({ code: 'unsupported-subject', subject: subject.kind, model: 'gates-231' })
    }
    const unsupported = request.numbers.find((number) => !SUPPORTED_NUMBERS.has(number))
    if (unsupported !== undefined) {
      return err({ code: 'unsupported-number', number: unsupported, model: 'gates-231' })
    }
    if (!request.numbers.includes('gates-231-structure')) {
      return ok([])
    }
    const variant = resolveVariant(request)
    if (!variant.ok) {
      return variant
    }

    const transliteration = transliterate(subject.birthName.allLetters)
    const sequence: ReadonlyArray<HebrewLetter> = transliteration.letters.map((entry) => {
      const standard = entry.options[0]
      return standard === undefined
        ? { hebrew: '', value: 0, name: '' }
        : alphabetLetterFor(standard.value, { hebrew: standard.hebrew, value: standard.value, name: standard.name })
    })
    const activated = activatedGates(sequence, variant.value)
    const totalGates = allGates().length

    const step: CalculationStep = {
      kind: 'gate-structure',
      title: text('Portões ativados pelo nome', 'Gates activated by the name', 'Puertas activadas por el nombre'),
      explanation: text(
        `Dos 231 portões (todos os pares das 22 letras), a transliteração padrão do nome ativa ${activated.length} pelo modo "${label(variant.value)['pt-BR']}". A aplicação a um nome é construção contemporânea (§9).`,
        `Of the 231 gates (all pairs of the 22 letters), the name's standard transliteration activates ${activated.length} via the "${label(variant.value).en}" mode. Applying it to a name is a contemporary construction (§9).`,
        `De las 231 puertas (todos los pares de las 22 letras), la transliteración estándar del nombre activa ${activated.length} por el modo "${label(variant.value).es}". Su aplicación a un nombre es una construcción contemporánea (§9).`,
      ),
      input: { name: subject.birthName.original },
      output: { totalGates, activated, standardHebrew: transliteration.standardHebrew, mode: variant.value },
      visual: 'gates-231',
    }

    return ok([
      {
        resultId: 'gates-231-structure',
        model: 'gates-231',
        engineVersion: ENGINE_VERSION,
        variantSelections: { [GATE_ACTIVATION_DIMENSION]: variant.value },
        // Escalar estrutural: quantos portões o nome ativa (0–231). Descritivo, sem veredito.
        finalValue: reduceToValue(activated.length, { preserveMasters: false }),
        steps: [step],
        ruleRefs: [GATES_RULES.gatesOfSeferYetzirah, GATES_RULES.applicationIsContemporary],
        divergenceNotes: [],
      },
    ])
  },
}
