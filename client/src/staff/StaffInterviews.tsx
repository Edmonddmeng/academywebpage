import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ApiError, api } from '../auth/api'
import { formatSlot, groupByDay, timeOnly, useLoad } from '../portal/hooks'

type Slot = {
  id: string; kind: 'athletic' | 'admissions'; startsAt: string; endsAt: string; location: string
  booking: { interviewId: string; applicationId: string; status: string; student: string } | null
}

const field = 'mt-1 w-full border border-sand bg-white px-3 py-2 focus:border-brass focus:outline-none'
const button = 'border border-ink px-3 py-1 text-sm font-semibold transition-colors hover:bg-ink hover:text-white disabled:opacity-50'
const LOCATIONS = ['Irvine campus', 'San Diego campus', 'Video call']

export default function StaffInterviews() {
  const { data, loading, error, reload } = useLoad<{ slots: Slot[] }>('/staff/interview-slots')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)
  const [kind, setKind] = useState<'all' | 'athletic' | 'admissions'>('all')

  async function create(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    setBusy(true)
    setMessage(null)
    try {
      const r = await api<{ created: number; skipped: number }>('/staff/interview-slots', {
        kind: f.get('kind'), location: f.get('location'), date: f.get('date'),
        startTime: f.get('startTime'), endTime: f.get('endTime'), minutes: Number(f.get('minutes')),
      })
      setMessage({ ok: true, text: `Opened ${r.created} slot${r.created === 1 ? '' : 's'}${r.skipped ? ` (${r.skipped} already existed)` : ''}.` })
      reload?.()
    } catch (err) {
      setMessage({ ok: false, text: err instanceof ApiError ? err.message : 'Couldn’t create slots.' })
    } finally {
      setBusy(false)
    }
  }

  async function act(run: () => Promise<unknown>, confirm?: string) {
    if (confirm && !window.confirm(confirm)) return
    setMessage(null)
    try {
      await run()
      reload?.()
    } catch (err) {
      setMessage({ ok: false, text: err instanceof ApiError ? err.message : 'Something went wrong.' })
    }
  }

  const slots = (data?.slots ?? []).filter((s) => kind === 'all' || s.kind === kind)
  const days = groupByDay(slots, 'en')

  return (
    <>
      <h1 className="font-serif text-4xl">Interviews</h1>
      <p className="mt-2 max-w-2xl text-ink/70">
        Open times for families to book. Athletic and admissions interviews have separate slots. All times are Pacific (campus) time.
      </p>

      <form onSubmit={create} className="mt-8 grid max-w-3xl gap-4 border border-sand bg-ivory/50 p-5 sm:grid-cols-3">
        <label className="text-sm font-semibold">Type
          <select name="kind" className={field} defaultValue="admissions"><option value="admissions">Admissions</option><option value="athletic">Athletic</option></select>
        </label>
        <label className="text-sm font-semibold">Location
          <select name="location" className={field}>{LOCATIONS.map((l) => <option key={l}>{l}</option>)}</select>
        </label>
        <label className="text-sm font-semibold">Date
          <input name="date" type="date" required className={field} />
        </label>
        <label className="text-sm font-semibold">From
          <input name="startTime" type="time" required defaultValue="09:00" className={field} />
        </label>
        <label className="text-sm font-semibold">Until
          <input name="endTime" type="time" required defaultValue="12:00" className={field} />
        </label>
        <label className="text-sm font-semibold">Each slot (minutes)
          <select name="minutes" className={field} defaultValue="30">{[15, 20, 30, 45, 60, 90].map((m) => <option key={m}>{m}</option>)}</select>
        </label>
        <div className="sm:col-span-3">
          <button type="submit" disabled={busy} className="bg-ink px-6 py-2 text-sm font-semibold tracking-[0.14em] text-white uppercase transition-colors hover:bg-brass disabled:opacity-60">
            {busy ? 'Opening…' : 'Open slots'}
          </button>
          <span role="status" className={`ml-4 text-sm ${message?.ok ? 'text-green-800' : 'text-red-800'}`}>{message?.text}</span>
        </div>
      </form>

      <div className="mt-10 flex items-center justify-between border-b border-ink pb-2">
        <h2 className="font-serif text-2xl">Schedule</h2>
        <select value={kind} onChange={(e) => setKind(e.target.value as typeof kind)} aria-label="Filter" className="border border-sand bg-white px-3 py-1 text-sm">
          <option value="all">All interviews</option><option value="admissions">Admissions</option><option value="athletic">Athletic</option>
        </select>
      </div>
      {error && <p className="mt-4 text-red-800">Couldn’t load slots.</p>}
      {loading && !data && <p className="mt-4 text-ink/70">Loading…</p>}
      {data && days.length === 0 && <p className="mt-4 text-ink/70">No slots yet. Open some above.</p>}

      {days.map(([day, list]) => (
        <div key={day} className="mt-6">
          <p className="font-semibold">{day}</p>
          <ul className="mt-2 divide-y divide-sand border border-sand">
            {list.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 text-sm">
                <span title={formatSlot(s.startsAt, s.endsAt, 'en')}>
                  {timeOnly(s.startsAt, 'en')} · {s.kind === 'athletic' ? 'Athletic' : 'Admissions'} · {s.location}
                </span>
                {!s.booking ? (
                  <span className="flex items-center gap-3">
                    <span className="text-ink/50">Open</span>
                    <button type="button" className={button} onClick={() => void act(() => api(`/staff/interview-slots/${s.id}`, {}, 'DELETE'), 'Delete this open slot?')}>Delete</button>
                  </span>
                ) : (
                  <span className="flex flex-wrap items-center gap-3">
                    <Link to={`/staff/applications/${s.booking.applicationId}`} className="font-semibold underline underline-offset-4 hover:text-brass">{s.booking.student}</Link>
                    <span className="text-ink/60">{s.booking.status.replace('_', ' ')}</span>
                    {s.booking.status === 'scheduled' && (
                      <>
                        <button type="button" className={button} onClick={() => void act(() => api(`/staff/interviews/${s.booking!.interviewId}`, { status: 'completed' }, 'PATCH'))}>Completed</button>
                        <button type="button" className={button} onClick={() => void act(() => api(`/staff/interviews/${s.booking!.interviewId}`, { status: 'no_show' }, 'PATCH'))}>No-show</button>
                        <button type="button" className={button} onClick={() => void act(() => api(`/staff/interviews/${s.booking!.interviewId}`, { status: 'cancelled' }, 'PATCH'), 'Cancel this interview and reopen the slot?')}>Cancel</button>
                      </>
                    )}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  )
}
