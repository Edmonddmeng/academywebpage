import { useEffect, useState } from 'react'
import { api } from '../auth/api'
import type { FormSchema } from './types'

type Loaded<T> = { data?: T; error?: string; loading: boolean; reload?: () => void }

/** GETs a path once (and again when it changes or reload() is called), exposing loading / error / data. A null path loads nothing. */
export function useLoad<T>(path: string | null): Loaded<T> {
  const [state, setState] = useState<Loaded<T> & { path: string | null }>({ loading: path !== null, path })
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (path === null) return
    let alive = true
    api<T>(path)
      .then((data) => alive && setState({ data, loading: false, path }))
      .catch((e: Error) => alive && setState({ error: e.message, loading: false, path }))
    return () => {
      alive = false
    }
  }, [path, tick])

  const reload = () => setTick((n) => n + 1)
  // While a different path is loading, don't show the previous path's data.
  if (path === null) return { loading: false, reload }
  return state.path === path ? { ...state, reload } : { loading: true, reload }
}

// The form definition never changes during a session, so fetch it once.
let schemaPromise: Promise<FormSchema> | null = null
export function useFormSchema(): Loaded<FormSchema> {
  const [state, setState] = useState<Loaded<FormSchema>>({ loading: true })
  useEffect(() => {
    schemaPromise ??= api<FormSchema>('/applications/form')
    schemaPromise
      .then((data) => setState({ data, loading: false }))
      .catch((e: Error) => {
        schemaPromise = null
        setState({ error: e.message, loading: false })
      })
  }, [])
  return state
}

export const gradeLabel = (grade: string, locale: 'en' | 'zh') => {
  if (locale === 'zh') return `${grade}年级`
  const n = Number(grade)
  const suffix = n % 10 === 1 && n !== 11 ? 'st' : n % 10 === 2 && n !== 12 ? 'nd' : n % 10 === 3 && n !== 13 ? 'rd' : 'th'
  return `${n}${suffix} Grade`
}

export const formatDate = (iso: string, locale: 'en' | 'zh') =>
  new Date(iso).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })

const SCHOOL_TZ = 'America/Los_Angeles'

/** e.g. "Thu, Jul 9, 10:30 AM – 11:00 AM PDT" — always in the school's time zone, since interviews are on campus. */
export function formatSlot(startsAt: string, endsAt: string, locale: 'en' | 'zh') {
  const tag = locale === 'zh' ? 'zh-CN' : 'en-US'
  const start = new Date(startsAt)
  const end = new Date(endsAt)
  const day = new Intl.DateTimeFormat(tag, { timeZone: SCHOOL_TZ, weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }).format(start)
  const time = (d: Date, zone = false) =>
    new Intl.DateTimeFormat(tag, { timeZone: SCHOOL_TZ, hour: 'numeric', minute: '2-digit', ...(zone ? { timeZoneName: 'short' } : {}) }).format(d)
  return `${day}, ${time(start)} – ${time(end, true)}`
}

/** Groups items by school-time calendar day, keeping order. */
export function groupByDay<T extends { startsAt: string }>(items: T[], locale: 'en' | 'zh'): [string, T[]][] {
  const tag = locale === 'zh' ? 'zh-CN' : 'en-US'
  const fmt = new Intl.DateTimeFormat(tag, { timeZone: SCHOOL_TZ, weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  const groups = new Map<string, T[]>()
  for (const item of items) {
    const key = fmt.format(new Date(item.startsAt))
    groups.set(key, [...(groups.get(key) ?? []), item])
  }
  return [...groups]
}

export const timeOnly = (iso: string, locale: 'en' | 'zh') =>
  new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-US', { timeZone: SCHOOL_TZ, hour: 'numeric', minute: '2-digit' }).format(new Date(iso))

export const formatBytes = (n: number) => (n >= 1_048_576 ? `${(n / 1_048_576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`)
