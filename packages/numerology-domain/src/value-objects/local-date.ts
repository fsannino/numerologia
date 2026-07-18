import type { Result } from '@numerus/shared-kernel'
import { err, ok } from '@numerus/shared-kernel'

/**
 * Data civil pura, sem timezone (§4.4 da spec, ADR-0005). Data de nascimento
 * não tem fuso — usar `Date` do JS aqui seria fonte garantida do bug de
 * "um dia a menos". Aritmética própria, sem API de plataforma.
 */

export type LocalDateError =
  | { readonly code: 'malformed-date'; readonly input: string }
  | { readonly code: 'date-out-of-range'; readonly year: number; readonly month: number; readonly day: number }

const MIN_YEAR = 1
const MAX_YEAR = 9999
const MONTHS_PER_YEAR = 12
const DAYS_PER_MONTH: ReadonlyArray<number> = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

export function daysInMonth(year: number, month: number): number {
  if (month === 2 && isLeapYear(year)) {
    return 29
  }
  return DAYS_PER_MONTH[month - 1] ?? 0
}

export class LocalDate {
  private constructor(
    readonly year: number,
    readonly month: number,
    readonly day: number,
  ) {}

  static create(year: number, month: number, day: number): Result<LocalDate, LocalDateError> {
    const allIntegers = [year, month, day].every(Number.isInteger)
    const inRange =
      allIntegers &&
      year >= MIN_YEAR &&
      year <= MAX_YEAR &&
      month >= 1 &&
      month <= MONTHS_PER_YEAR &&
      day >= 1 &&
      day <= daysInMonth(year, month)
    if (!inRange) {
      return err({ code: 'date-out-of-range', year, month, day })
    }
    return ok(new LocalDate(year, month, day))
  }

  /** Aceita exatamente o formato ISO `YYYY-MM-DD` (o que `<input type="date">` emite). */
  static fromISO(iso: string): Result<LocalDate, LocalDateError> {
    const match = ISO_DATE_PATTERN.exec(iso)
    if (match === null) {
      return err({ code: 'malformed-date', input: iso })
    }
    return LocalDate.create(Number(match[1]), Number(match[2]), Number(match[3]))
  }

  toISO(): string {
    const pad = (value: number, width: number) => String(value).padStart(width, '0')
    return `${pad(this.year, 4)}-${pad(this.month, 2)}-${pad(this.day, 2)}`
  }
}
