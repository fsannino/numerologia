import { ENGINE_VERSION } from '../../engine-version'
import type { ModelId } from '../../model-ids'
import type { BirthName } from '../../value-objects/birth-name'
import { reduceToValue } from '../../value-objects/numerology-value'
import { reduceToArcano } from '../../value-objects/arcano'
import type { CalculationStep, CalculationTrace, DivergenceNote, KabbalisticReading } from '../../trace/calculation-trace'
import { text } from '../../trace/step-builders'
import { pythagoreanValueOf } from '../pythagorean/letter-table'
import { chaldeanValueOf } from '../chaldean/letter-table'
import { DEFAULT_NAME_REDUCTION, calculateExpression } from '../pythagorean/name-numbers'
import { calculateChaldeanNameNumber } from '../chaldean/name-numbers'
import { DEFAULT_Y_CLASSIFICATION } from '../../value-objects/letter-classification'
import { KABBALISTIC_RULES } from './kabbalistic-rules'

type TableId = 'sequential-1-9' | 'chaldean-like-1-8'

const TABLES: ReadonlyArray<{ readonly id: TableId; readonly valueOf: (letter: string) => number; readonly coincidenceRef: ModelId }> = [
  { id: 'sequential-1-9', valueOf: pythagoreanValueOf, coincidenceRef: 'pythagorean' },
  { id: 'chaldean-like-1-8', valueOf: chaldeanValueOf, coincidenceRef: 'chaldean' },
]

function rawTotalFor(name: BirthName, valueOf: (letter: string) => number): number {
  return name.allLetters.reduce((accumulator, letter) => accumulator + valueOf(letter), 0)
}

/**
 * Número da referência que a UI mostra hoje para pitagórica e caldaica —
 * usado para detectar coincidência de forma DINÂMICA (não presumida). Como a
 * cabalística delega às mesmas tabelas, quando os números batem a coincidência
 * é provada; quando não batem (ex.: mestre na redução), simplesmente não há nota.
 */
function referenceReduced(name: BirthName, model: ModelId): number {
  if (model === 'pythagorean') {
    return calculateExpression(name, DEFAULT_NAME_REDUCTION).finalValue.reduced
  }
  return calculateChaldeanNameNumber(name, 'expression', DEFAULT_Y_CLASSIFICATION, { withDivergences: false }).finalValue.reduced
}

/** As 4 leituras (2 tabelas × 2 reduções), com proveniência provada por comparação. */
export function computeReadings(name: BirthName): ReadonlyArray<KabbalisticReading> {
  const readings: KabbalisticReading[] = []
  for (const table of TABLES) {
    const rawTotal = rawTotalFor(name, table.valueOf)
    const decimal = reduceToValue(rawTotal, { preserveMasters: true }).reduced
    const reference = referenceReduced(name, table.coincidenceRef)
    readings.push({
      table: table.id,
      reduction: 'decimal',
      rawTotal,
      value: decimal,
      ...(decimal === reference ? { coincidesWith: table.coincidenceRef } : {}),
    })
    // Arcano é próprio da cabalística: nenhuma outra escola produz 1–22.
    readings.push({ table: table.id, reduction: 'modular-22', rawTotal, value: reduceToArcano(rawTotal) })
  }
  return readings
}

const SCHOOL_LABEL: Readonly<Record<ModelId, string>> = {
  pythagorean: 'Pitagórica',
  chaldean: 'Caldaica',
  gematria: 'Gematria',
  'gates-231': '231 Portões',
  vedic: 'Védica',
  'lo-shu': 'Lo Shu',
  kabbalistic: 'Cabalística',
}

function coincidenceNotes(readings: ReadonlyArray<KabbalisticReading>): ReadonlyArray<DivergenceNote> {
  return readings
    .filter((reading): reading is KabbalisticReading & { coincidesWith: ModelId } => reading.coincidesWith !== undefined)
    .map((reading) => {
      const school = SCHOOL_LABEL[reading.coincidesWith]
      return {
        id: `kabbalistic/coincidence-${reading.table}`,
        note: text(
          `A leitura "${reading.table} · decimal" (${reading.value}) coincide com a escola ${school}. Nesta variante, a diferença para a cabalística está na interpretação, não no cálculo — e o produto diz isso em vez de fingir originalidade (§9).`,
          `The reading "${reading.table} · decimal" (${reading.value}) matches the ${school} school. In this variant, the difference from the Kabbalistic reading is in the interpretation, not the arithmetic — and the product says so instead of feigning originality (§9).`,
          `La lectura "${reading.table} · decimal" (${reading.value}) coincide con la escuela ${school}. En esta variante, la diferencia con la cabalística está en la interpretación, no en el cálculo — y el producto lo dice en vez de fingir originalidad (§9).`,
        ),
      }
    })
}

/**
 * Número do Nome cabalístico. Não é UM número — é a Matriz de Leituras: o nome
 * tem várias respostas simultâneas (tabela × redução), todas expostas com sua
 * origem. O escalar do card é o nº de valores distintos (resumo estrutural
 * honesto), como a Lo Shu usa a contagem de números presentes.
 */
export function calculateKabbalisticName(name: BirthName): CalculationTrace {
  const readings = computeReadings(name)
  const distinctValues = new Set(readings.map((reading) => reading.value)).size

  const matrixStep: CalculationStep = {
    kind: 'reading-matrix',
    title: text('Matriz de Leituras do nome', 'Reading matrix of the name', 'Matriz de Lecturas del nombre'),
    explanation: text(
      'A cabalística latina não tem tabela única: cada combinação de tabela (sequencial 1–9 / caldaica 1–8) e redução (decimal 1–9 / arcano 1–22) é uma leitura legítima. Todas aparecem, com a origem de cada número.',
      'The Latin Kabbalistic school has no single table: each combination of table (sequential 1–9 / Chaldean 1–8) and reduction (decimal 1–9 / arcano 1–22) is a legitimate reading. All are shown, each with its provenance.',
      'La cabalística latina no tiene tabla única: cada combinación de tabla (secuencial 1–9 / caldea 1–8) y reducción (decimal 1–9 / arcano 1–22) es una lectura legítima. Todas aparecen, con el origen de cada número.',
    ),
    input: { name: name.original },
    output: { readings, distinctValues },
    visual: 'reading-matrix',
  }

  return {
    resultId: 'kabbalistic-name',
    model: 'kabbalistic',
    engineVersion: ENGINE_VERSION,
    variantSelections: {},
    // Escalar honesto: nenhuma leitura é "a" resposta — o card mostra quantas leituras distintas existem.
    finalValue: reduceToValue(distinctValues, { preserveMasters: false }),
    steps: [matrixStep],
    ruleRefs: [KABBALISTIC_RULES.nameOnly, KABBALISTIC_RULES.unstandardizedTable, KABBALISTIC_RULES.arcanoReduction],
    divergenceNotes: coincidenceNotes(readings),
  }
}
