import type { LocalizedText } from '@numerus/shared-kernel'
import type { RuleReference } from '../../trace/calculation-trace'

const text = (ptBR: string, en: string, es: string): LocalizedText => ({ 'pt-BR': ptBR, en, es })

/** Regras da Gematria (valores das letras hebraicas). */
export const GEMATRIA_RULES = {
  hebrewValues: {
    id: 'gematria/hebrew-values',
    rule: text(
      'Cada letra hebraica tem um valor (mispar hechrachi): א=1 … י=10, כ=20 … ק=100, ר=200, ש=300, ת=400. O valor do nome é a soma das letras da transliteração.',
      'Each Hebrew letter has a value (mispar hechrachi): א=1 … י=10, כ=20 … ק=100, ר=200, ש=300, ת=400. The name value is the sum of the transliteration letters.',
      'Cada letra hebrea tiene un valor (mispar hechrachi): א=1 … י=10, כ=20 … ק=100, ר=200, ש=300, ת=400. El valor del nombre es la suma de las letras de la transliteración.',
    ),
    source: text(
      'Gematria hebraica clássica (valor absoluto).',
      'Classical Hebrew gematria (absolute value).',
      'Gematría hebrea clásica (valor absoluto).',
    ),
  },
  transliterationIsReconstruction: {
    id: 'gematria/transliteration-reconstruction',
    rule: text(
      'A transliteração de um nome latino para o hebraico é AMBÍGUA e é uma reconstrução: cada letra pode ter mais de uma correspondência. O sistema mostra todas as candidatas e o espectro de valores (mínimo, padrão, máximo) — nunca uma única resposta silenciosa (ADR-0008, §9).',
      'Transliterating a Latin name into Hebrew is AMBIGUOUS and a reconstruction: each letter may have more than one match. The system shows all candidates and the value spectrum (minimum, standard, maximum) — never a single silent answer (ADR-0008, §9).',
      'Transliterar un nombre latino al hebreo es AMBIGUO y es una reconstrucción: cada letra puede tener más de una correspondencia. El sistema muestra todas las candidatas y el espectro de valores (mínimo, estándar, máximo) — nunca una única respuesta silenciosa (ADR-0008, §9).',
    ),
    source: text(
      'Postura epistêmica do produto (§9); política de transliteração (ADR-0008).',
      'Product epistemic stance (§9); transliteration policy (ADR-0008).',
      'Postura epistémica del producto (§9); política de transliteración (ADR-0008).',
    ),
  },
} as const satisfies Record<string, RuleReference>
