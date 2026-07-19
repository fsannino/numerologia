import type { LocalizedText } from '@numerus/shared-kernel'
import type { RuleReference } from '../../trace/calculation-trace'

const text = (ptBR: string, en: string, es: string): LocalizedText => ({ 'pt-BR': ptBR, en, es })

/** Regras da numerologia védica (Ank Jyotish / numerologia indiana). */
export const VEDIC_RULES = {
  moolankFromBirthDay: {
    id: 'vedic/moolank-from-day',
    rule: text(
      'O Moolank (número raiz ou psíquico) é o dia do nascimento reduzido a um único dígito de 1 a 9. Ao contrário da escola pitagórica, a numerologia védica não preserva números mestres: a redução vai sempre até a raiz.',
      'The Moolank (root or psychic number) is the birth day reduced to a single digit 1–9. Unlike the Pythagorean school, Vedic numerology does not preserve master numbers: reduction always continues to the root.',
      'El Moolank (número raíz o psíquico) es el día de nacimiento reducido a un solo dígito de 1 a 9. A diferencia de la escuela pitagórica, la numerología védica no preserva números maestros: la reducción siempre llega hasta la raíz.',
    ),
    source: text(
      'Ank Jyotish (numerologia védica); tradição da astrologia indiana.',
      'Ank Jyotish (Vedic numerology); Indian astrology tradition.',
      'Ank Jyotish (numerología védica); tradición de la astrología india.',
    ),
  },
  bhagyankFromBirthDate: {
    id: 'vedic/bhagyank-from-date',
    rule: text(
      'O Bhagyank (número do destino) é a soma de todos os dígitos da data de nascimento (dia, mês e ano), reduzida a um único dígito de 1 a 9 — também sem preservar mestres.',
      'The Bhagyank (destiny number) is the sum of every digit of the birth date (day, month and year), reduced to a single digit 1–9 — also without preserving masters.',
      'El Bhagyank (número del destino) es la suma de todos los dígitos de la fecha de nacimiento (día, mes y año), reducida a un solo dígito de 1 a 9 — también sin preservar maestros.',
    ),
    source: text(
      'Ank Jyotish (numerologia védica); tradição da astrologia indiana.',
      'Ank Jyotish (Vedic numerology); Indian astrology tradition.',
      'Ank Jyotish (numerología védica); tradición de la astrología india.',
    ),
  },
  planetaryRulership: {
    id: 'vedic/planetary-rulership',
    rule: text(
      'Cada dígito 1–9 é regido por uma graha (planeta): Sol (1), Lua (2), Júpiter (3), Rahu (4), Mercúrio (5), Vênus (6), Ketu (7), Saturno (8) e Marte (9). Na tradição védica, o significado do número é o do seu planeta — vocabulário para reflexão, nunca um veredito (§9).',
      'Each digit 1–9 is ruled by a graha (planet): Sun (1), Moon (2), Jupiter (3), Rahu (4), Mercury (5), Venus (6), Ketu (7), Saturn (8) and Mars (9). In the Vedic tradition, the meaning of the number is that of its planet — vocabulary for reflection, never a verdict (§9).',
      'Cada dígito 1–9 está regido por una graha (planeta): Sol (1), Luna (2), Júpiter (3), Rahu (4), Mercurio (5), Venus (6), Ketu (7), Saturno (8) y Marte (9). En la tradición védica, el significado del número es el de su planeta — vocabulario para la reflexión, nunca un veredicto (§9).',
    ),
    source: text(
      'Ank Jyotish; correspondência clássica entre números e grahas.',
      'Ank Jyotish; classical correspondence between numbers and grahas.',
      'Ank Jyotish; correspondencia clásica entre números y grahas.',
    ),
  },
} as const satisfies Record<string, RuleReference>
