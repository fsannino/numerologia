import type { LocalizedText, Result } from '@numerus/shared-kernel'
import { err, ok } from '@numerus/shared-kernel'
import { ENGINE_VERSION } from '../../engine-version'
import type { LocalDate } from '../../value-objects/local-date'
import type { NumerologyValue } from '../../value-objects/numerology-value'
import { reduceToValue } from '../../value-objects/numerology-value'
import type { CalculationStep, CalculationTrace, TimelineSegment } from '../../trace/calculation-trace'
import type { NumberKind } from '../../model-ids'
import type { CalculationError } from '../../ports/numerology-model'
import type { LifePathVariant } from './date-numbers'
import { calculateLifePath } from './date-numbers'
import { PYTHAGOREAN_RULES } from './rules'
import { karmicCheckStep, reductionStep, sumStep, text } from './trace-steps'

/**
 * Números de tempo (ADR-0007): dependem da data de nascimento E de uma data
 * de referência explícita — o domínio nunca lê o relógio. Todas as regras de
 * períodos usam a convenção predominante documentada no ADR.
 */

const FIRST_BOUNDARY_BASE_AGE = 36
const SECOND_CYCLE_LENGTH_YEARS = 27
const PINNACLE_LENGTH_YEARS = 9

export type TimeNumberKind =
  | 'life-cycles'
  | 'pinnacles'
  | 'challenges'
  | 'personal-year'
  | 'personal-month'
  | 'personal-day'

export type ReferenceBeforeBirthError = { readonly code: 'reference-before-birth-date' }

/** Idade em anos civis completos na data de referência — aritmética pura. */
export function ageAt(birth: LocalDate, reference: LocalDate): Result<number, ReferenceBeforeBirthError> {
  const birthdayReached =
    reference.month > birth.month || (reference.month === birth.month && reference.day >= birth.day)
  const age = reference.year - birth.year - (birthdayReached ? 0 : 1)
  if (age < 0) {
    return err({ code: 'reference-before-birth-date' })
  }
  return ok(age)
}

/** Caminho de Vida totalmente reduzido (mestres reduzidos) — só para aritmética de idade. */
function fullyReducedLifePath(birth: LocalDate, variant: LifePathVariant): number {
  const lifePath = calculateLifePath(birth, variant).finalValue
  return reduceToValue(lifePath.reduced, { preserveMasters: false }).reduced
}

function timelineStep(
  explanation: LocalizedText,
  ageAtReference: number,
  segments: ReadonlyArray<TimelineSegment>,
): CalculationStep {
  return {
    kind: 'timeline',
    title: text('Linha do tempo', 'Timeline'),
    explanation,
    input: { ageAtReference },
    output: { segments },
    visual: 'timeline',
  }
}

function currentSegment(segments: ReadonlyArray<TimelineSegment>): TimelineSegment {
  const current = segments.find((segment) => segment.isCurrent)
  if (current === undefined) {
    // Janelas cobrem [0, ∞) por construção; chegar aqui é bug de programação.
    throw new RangeError('Nenhum período vigente na linha do tempo')
  }
  return current
}

function buildSegments(
  entries: ReadonlyArray<{ readonly label: LocalizedText; readonly value: NumerologyValue }>,
  boundaries: ReadonlyArray<number>,
  age: number,
): ReadonlyArray<TimelineSegment> {
  return entries.map((entry, index) => {
    const fromAge = index === 0 ? 0 : (boundaries[index - 1] ?? 0)
    const toAge = boundaries[index]
    const isCurrent = age >= fromAge && (toAge === undefined || age < toAge)
    return {
      label: entry.label,
      value: entry.value,
      fromAge,
      ...(toAge !== undefined ? { toAge } : {}),
      isCurrent,
    }
  })
}

function baseTrace(
  resultId: NumberKind,
  finalValue: NumerologyValue,
  steps: ReadonlyArray<CalculationStep>,
  ruleRef: (typeof PYTHAGOREAN_RULES)[keyof typeof PYTHAGOREAN_RULES],
  variantSelections: Readonly<Record<string, string>>,
): CalculationTrace {
  return {
    resultId,
    model: 'pythagorean',
    engineVersion: ENGINE_VERSION,
    variantSelections,
    finalValue,
    steps,
    ruleRefs: [ruleRef, PYTHAGOREAN_RULES.masterNumbers, PYTHAGOREAN_RULES.karmicDebts],
    divergenceNotes: [],
  }
}

export function calculateLifeCycles(
  birth: LocalDate,
  reference: LocalDate,
  lifePathVariant: LifePathVariant,
): Result<CalculationTrace, CalculationError> {
  const age = ageAt(birth, reference)
  if (!age.ok) return age

  const firstBoundary = FIRST_BOUNDARY_BASE_AGE - fullyReducedLifePath(birth, lifePathVariant)
  const cycles = [
    { label: text('1º ciclo — formativo (mês)', '1st cycle — formative (month)'), value: reduceToValue(birth.month, { preserveMasters: true }) },
    { label: text('2º ciclo — produtivo (dia)', '2nd cycle — productive (day)'), value: reduceToValue(birth.day, { preserveMasters: true }) },
    { label: text('3º ciclo — colheita (ano)', '3rd cycle — harvest (year)'), value: reduceToValue(birth.year, { preserveMasters: true }) },
  ]
  const segments = buildSegments(cycles, [firstBoundary, firstBoundary + SECOND_CYCLE_LENGTH_YEARS], age.value)

  const steps: CalculationStep[] = [
    ...cycles.map((cycle) => reductionStep(cycle.label, cycle.value)),
    karmicCheckStep([birth.day]),
    timelineStep(
      text(
        `O 1º ciclo vai até a idade ${firstBoundary} (36 − Caminho de Vida), o 2º dura ${SECOND_CYCLE_LENGTH_YEARS} anos e o 3º segue até o fim. Na data de referência a idade é ${age.value}.`,
        `The 1st cycle lasts until age ${firstBoundary} (36 − Life Path), the 2nd lasts ${SECOND_CYCLE_LENGTH_YEARS} years and the 3rd runs to the end. At the reference date the age is ${age.value}.`,
      ),
      age.value,
      segments,
    ),
  ]
  return ok(baseTrace('life-cycles', currentSegment(segments).value, steps, PYTHAGOREAN_RULES.lifeCyclesFromDateParts, {}))
}

export function calculatePinnacles(
  birth: LocalDate,
  reference: LocalDate,
  lifePathVariant: LifePathVariant,
): Result<CalculationTrace, CalculationError> {
  const age = ageAt(birth, reference)
  if (!age.ok) return age

  const day = reduceToValue(birth.day, { preserveMasters: false }).reduced
  const month = reduceToValue(birth.month, { preserveMasters: false }).reduced
  const year = reduceToValue(birth.year, { preserveMasters: false }).reduced

  const p1 = reduceToValue(day + month, { preserveMasters: true })
  const p2 = reduceToValue(day + year, { preserveMasters: true })
  const p3 = reduceToValue(p1.reduced + p2.reduced, { preserveMasters: true })
  const p4 = reduceToValue(month + year, { preserveMasters: true })

  const firstBoundary = FIRST_BOUNDARY_BASE_AGE - fullyReducedLifePath(birth, lifePathVariant)
  const pinnacles = [
    { label: text('1º Pináculo (dia + mês)', '1st Pinnacle (day + month)'), value: p1 },
    { label: text('2º Pináculo (dia + ano)', '2nd Pinnacle (day + year)'), value: p2 },
    { label: text('3º Pináculo (P1 + P2)', '3rd Pinnacle (P1 + P2)'), value: p3 },
    { label: text('4º Pináculo (mês + ano)', '4th Pinnacle (month + year)'), value: p4 },
  ]
  const segments = buildSegments(
    pinnacles,
    [firstBoundary, firstBoundary + PINNACLE_LENGTH_YEARS, firstBoundary + 2 * PINNACLE_LENGTH_YEARS],
    age.value,
  )

  const steps: CalculationStep[] = [
    sumStep(
      text('Componentes reduzidos da data', 'Reduced date components'),
      [day, month, year],
      day + month + year,
      text(`Dia → ${day}, mês → ${month}, ano → ${year}: são estes os componentes combinados em cada pináculo.`, `Day → ${day}, month → ${month}, year → ${year}: these components are combined in each pinnacle.`),
    ),
    ...pinnacles.map((pinnacle) => reductionStep(pinnacle.label, pinnacle.value)),
    karmicCheckStep([p1.raw, p2.raw, p3.raw, p4.raw]),
    timelineStep(
      text(
        `P1 vai até a idade ${firstBoundary} (36 − Caminho de Vida); P2 e P3 duram ${PINNACLE_LENGTH_YEARS} anos cada; P4 segue até o fim. Na data de referência a idade é ${age.value}.`,
        `P1 lasts until age ${firstBoundary} (36 − Life Path); P2 and P3 last ${PINNACLE_LENGTH_YEARS} years each; P4 runs to the end. At the reference date the age is ${age.value}.`,
      ),
      age.value,
      segments,
    ),
  ]
  return ok(baseTrace('pinnacles', currentSegment(segments).value, steps, PYTHAGOREAN_RULES.pinnaclesFromDateParts, {}))
}

export function calculateChallenges(
  birth: LocalDate,
  reference: LocalDate,
  lifePathVariant: LifePathVariant,
): Result<CalculationTrace, CalculationError> {
  const age = ageAt(birth, reference)
  if (!age.ok) return age

  const day = reduceToValue(birth.day, { preserveMasters: false }).reduced
  const month = reduceToValue(birth.month, { preserveMasters: false }).reduced
  const year = reduceToValue(birth.year, { preserveMasters: false }).reduced

  const c1 = Math.abs(month - day)
  const c2 = Math.abs(day - year)
  const c3 = Math.abs(c1 - c2)
  const c4 = Math.abs(month - year)

  const firstBoundary = FIRST_BOUNDARY_BASE_AGE - fullyReducedLifePath(birth, lifePathVariant)
  const challenges = [
    { label: text('1º Desafio |mês − dia|', '1st Challenge |month − day|'), value: reduceToValue(c1, { preserveMasters: false }) },
    { label: text('2º Desafio |dia − ano|', '2nd Challenge |day − year|'), value: reduceToValue(c2, { preserveMasters: false }) },
    { label: text('3º Desafio |D1 − D2|', '3rd Challenge |C1 − C2|'), value: reduceToValue(c3, { preserveMasters: false }) },
    { label: text('4º Desafio |mês − ano|', '4th Challenge |month − year|'), value: reduceToValue(c4, { preserveMasters: false }) },
  ]
  const segments = buildSegments(
    challenges,
    [firstBoundary, firstBoundary + PINNACLE_LENGTH_YEARS, firstBoundary + 2 * PINNACLE_LENGTH_YEARS],
    age.value,
  )

  const steps: CalculationStep[] = [
    sumStep(
      text('Componentes reduzidos da data', 'Reduced date components'),
      [day, month, year],
      day + month + year,
      text(
        `Dia → ${day}, mês → ${month}, ano → ${year}. Os desafios são as diferenças absolutas: |${month}−${day}|=${c1}, |${day}−${year}|=${c2}, |${c1}−${c2}|=${c3}, |${month}−${year}|=${c4}.`,
        `Day → ${day}, month → ${month}, year → ${year}. Challenges are the absolute differences: |${month}−${day}|=${c1}, |${day}−${year}|=${c2}, |${c1}−${c2}|=${c3}, |${month}−${year}|=${c4}.`,
      ),
    ),
    timelineStep(
      text(
        `Mesmas janelas dos pináculos: até ${firstBoundary}, +${PINNACLE_LENGTH_YEARS}, +${PINNACLE_LENGTH_YEARS}, restante. Na data de referência a idade é ${age.value}. O desafio 0 existe e não há mestres em desafios.`,
        `Same windows as pinnacles: until ${firstBoundary}, +${PINNACLE_LENGTH_YEARS}, +${PINNACLE_LENGTH_YEARS}, rest. At the reference date the age is ${age.value}. Challenge 0 exists and there are no masters in challenges.`,
      ),
      age.value,
      segments,
    ),
  ]
  return ok(baseTrace('challenges', currentSegment(segments).value, steps, PYTHAGOREAN_RULES.challengesFromDateParts, {}))
}

type PersonalTimeKind = 'personal-year' | 'personal-month' | 'personal-day'

export function calculatePersonalTime(
  kind: PersonalTimeKind,
  birth: LocalDate,
  reference: LocalDate,
): Result<CalculationTrace, CalculationError> {
  const age = ageAt(birth, reference)
  if (!age.ok) return age

  const birthDay = reduceToValue(birth.day, { preserveMasters: false }).reduced
  const birthMonth = reduceToValue(birth.month, { preserveMasters: false }).reduced
  const referenceYear = reduceToValue(reference.year, { preserveMasters: false }).reduced

  const steps: CalculationStep[] = []
  const yearTotal = birthDay + birthMonth + referenceYear
  steps.push(
    sumStep(
      text(`Ano Pessoal de ${reference.year}`, `Personal Year for ${reference.year}`),
      [birthDay, birthMonth, referenceYear],
      yearTotal,
      text(
        `Dia de nascimento reduzido (${birthDay}) + mês de nascimento reduzido (${birthMonth}) + ano de referência reduzido (${referenceYear}).`,
        `Reduced birth day (${birthDay}) + reduced birth month (${birthMonth}) + reduced reference year (${referenceYear}).`,
      ),
    ),
  )
  const personalYear = reduceToValue(yearTotal, { preserveMasters: false })
  steps.push(karmicCheckStep([yearTotal]))
  steps.push(reductionStep(text('Redução do Ano Pessoal', 'Personal Year reduction'), personalYear))
  if (kind === 'personal-year') {
    return ok(baseTrace('personal-year', personalYear, steps, PYTHAGOREAN_RULES.personalTimeFromReference, {}))
  }

  const monthTotal = personalYear.reduced + reference.month
  const personalMonth = reduceToValue(monthTotal, { preserveMasters: false })
  steps.push(
    sumStep(
      text(`Mês Pessoal (${reference.month}/${reference.year})`, `Personal Month (${reference.month}/${reference.year})`),
      [personalYear.reduced, reference.month],
      monthTotal,
      text('Ano Pessoal + mês de referência.', 'Personal Year + reference month.'),
    ),
  )
  steps.push(reductionStep(text('Redução do Mês Pessoal', 'Personal Month reduction'), personalMonth))
  if (kind === 'personal-month') {
    return ok(baseTrace('personal-month', personalMonth, steps, PYTHAGOREAN_RULES.personalTimeFromReference, {}))
  }

  const referenceDay = reduceToValue(reference.day, { preserveMasters: false }).reduced
  const dayTotal = personalMonth.reduced + referenceDay
  const personalDay = reduceToValue(dayTotal, { preserveMasters: false })
  steps.push(
    sumStep(
      text(`Dia Pessoal (${reference.toISO()})`, `Personal Day (${reference.toISO()})`),
      [personalMonth.reduced, referenceDay],
      dayTotal,
      text('Mês Pessoal + dia de referência reduzido.', 'Personal Month + reduced reference day.'),
    ),
  )
  steps.push(reductionStep(text('Redução do Dia Pessoal', 'Personal Day reduction'), personalDay))
  return ok(baseTrace('personal-day', personalDay, steps, PYTHAGOREAN_RULES.personalTimeFromReference, {}))
}
