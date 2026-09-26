import { useState, useEffect } from 'react'

/**
 * Returns formatted long date string: e.g. "Thursday, 24 September 2026"
 */
export function formatLongDate(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date)
  return d.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Returns formatted medium date string: e.g. "Thursday, 24 Sep 2026"
 */
export function formatMediumDate(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date)
  return d.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Returns formatted short date string: e.g. "24 Sep 2026"
 */
export function formatShortDate(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date)
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Returns formatted month and year: e.g. "September 2026"
 */
export function formatMonthYear(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date)
  return d.toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Returns live automated date and time string: e.g. "Thursday, 24 Sep 2026 · 1:55:02 PM"
 */
export function formatLiveDateTime(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date)
  const dateStr = d.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  const timeStr = d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })
  return `${dateStr} · ${timeStr}`
}

/**
 * React hook that automates current date and time updating live every second
 */
export function useLiveDateTime() {
  const [currentDate, setCurrentDate] = useState(() => new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return {
    date: currentDate,
    longDate: formatLongDate(currentDate),
    mediumDate: formatMediumDate(currentDate),
    shortDate: formatShortDate(currentDate),
    monthYear: formatMonthYear(currentDate),
    liveDateTime: formatLiveDateTime(currentDate),
    dayOfMonth: currentDate.getDate(),
  }
}

