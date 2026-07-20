'use client'

import { useId, useState } from 'react'
import type { FormEvent } from 'react'
import type { EventChart } from '@numerus/numerology-application'
import { calculateEventChart } from '@numerus/numerology-application'
import { useLocale } from '@/i18n/locale-context'
import { UI_MESSAGES } from '@/i18n/ui-messages'
import { NumberResultCard } from './number-result-card'

function todayISO(): string {
  const now = new Date()
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

/** Vibração de uma data específica (Evento) — só a data entra. */
export function EventCalculator() {
  const { locale } = useLocale()
  const t = UI_MESSAGES[locale]
  const eventId = useId()
  const referenceId = useId()
  const [eventDate, setEventDate] = useState('')
  const [referenceDate, setReferenceDate] = useState(todayISO)
  const [chart, setChart] = useState<EventChart | null>(null)
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(formEvent: FormEvent<HTMLFormElement>) {
    formEvent.preventDefault()
    const result = calculateEventChart({
      eventDate,
      ...(referenceDate !== '' ? { referenceDate } : {}),
    })
    if (!result.ok) {
      setChart(null)
      setError(t.errors.invalidBirthDate)
      return
    }
    setError(null)
    setChart(result.value)
  }

  return (
    <section className="flex flex-col gap-6">
      <p className="text-[15px] leading-relaxed text-anil">{t.event.intro}</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 border border-anil bg-giz p-6" aria-label={t.event.build}>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={eventId} className="font-mono text-[10px] uppercase tracking-[0.14em] text-latao">
            {t.event.dateLabel}
          </label>
          <input
            id={eventId}
            type="date"
            value={eventDate}
            onChange={(field) => setEventDate(field.target.value)}
            className="w-fit border border-anil bg-papel px-3 py-2 font-mono text-sm text-tinta"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={referenceId} className="font-mono text-[10px] uppercase tracking-[0.14em] text-latao">
            {t.form.referenceLabel} <span className="text-anil">{t.event.referenceTag}</span>
          </label>
          <input
            id={referenceId}
            type="date"
            value={referenceDate}
            onChange={(field) => setReferenceDate(field.target.value)}
            className="w-fit border border-anil bg-papel px-3 py-2 font-mono text-sm text-tinta"
          />
        </div>

        <button
          type="submit"
          className="w-fit bg-tinta px-6 py-2.5 font-mono text-[12px] uppercase tracking-[0.14em] text-giz transition hover:bg-anil"
        >
          {t.event.build}
        </button>

        {error !== null && (
          <p role="alert" className="border-l-2 border-tinta bg-papel px-4 py-3 text-[15px] font-medium text-tinta">
            {error}
          </p>
        )}
      </form>

      {chart !== null && (
        <div className="grid gap-3" aria-label={t.modes.event}>
          <NumberResultCard trace={chart.vibration} />
          {chart.personalYear !== undefined && <NumberResultCard trace={chart.personalYear} />}
        </div>
      )}
    </section>
  )
}
