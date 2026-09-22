import { useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ApiError, api } from '../auth/api'
import ReadOnly from '../portal/ReadOnly'
import { formatBytes, formatDate, formatSlot, gradeLabel, useFormSchema, useLoad } from '../portal/hooks'
import { pick, type Data } from '../portal/types'

type Detail = {
  application: { id: string; status: string; schoolYear: string; grade: string; firstName: string | null; lastName: string | null; submittedAt: string | null }
  family: { email: string | null; name: string | null }
  sections: Record<string, { data: Data; isComplete: boolean }>
  checklist: { kind: string; status: string; notes: string | null; completedAt: string | null }[]
  documents: { id: string; kind: string; name: string; size: number; createdAt: string; byRecommender: boolean }[]
  recommendations: { kind: string; name: string; email: string; requestedAt: string; expiresAt: string; submittedAt: string | null; sendCount: number }[]
  interviews: { id: string; kind: string; status: string; startsAt: string; endsAt: string; location: string }[]
  notes: { id: string; body: string; createdAt: string; author: string }[]
  signatures: { name: string; email: string; signedAt: string; version: string }[]
}

const TITLES: Record<string, string> = {
  application_form: 'Application form',
  application_fee: 'Application fee',
  birth_certificate: 'Birth certificate',
  athletic_interview: 'Athletic interview',
  admissions_interview: 'Admissions interview',
  test_scores: 'Admission test scores (ISEE / SSAT)',
  rec_principal: 'Recommendation: principal or counselor',
  rec_math: 'Recommendation: math teacher',
  rec_english: 'Recommendation: English teacher',
  report_card: 'Report card',
}
const REC_KIND: Record<string, string> = { rec_principal: 'principal_counselor', rec_math: 'math_teacher', rec_english: 'english_teacher' }
const INTERVIEW_KIND: Record<string, string> = { athletic_interview: 'athletic', admissions_interview: 'admissions' }
const NOTE_HINT: Record<string, string> = {
  application_fee: 'e.g. Paid by check #1042, Sep 22',
  test_scores: 'e.g. ISEE received Oct 3 from ERB',
  report_card: 'e.g. Official copy received from school',
}

const field = 'border border-sand bg-white px-3 py-2 focus:border-brass focus:outline-none'
const button = 'border border-ink px-4 py-1.5 text-sm font-semibold transition-colors hover:bg-ink hover:text-white disabled:opacity-50'
const link = 'text-sm underline underline-offset-4 hover:text-brass'

async function openFile(docId: string) {
  const w = window.open('about:blank', '_blank')
  try {
    const { url } = await api<{ url: string }>(`/staff/documents/${docId}/url`)
    if (w) w.location.href = url
  } catch {
    w?.close()
  }
}

export default function StaffApplication() {
  const { id = '' } = useParams()
  const { data, error, loading, reload } = useLoad<Detail>(`/staff/applications/${id}`)
  const schema = useFormSchema()
  if (loading && !data) return <p className="text-ink/70">Loading…</p>
  if (error || !data) return <p className="text-red-800">Couldn’t load this application.</p>

  const { application: a, family } = data
  const refresh = () => reload?.()

  return (
    <div className="max-w-4xl">
      <Link to="/staff" className={link}>← Applications</Link>
      <h1 className="mt-6 font-serif text-4xl">{a.firstName} {a.lastName}</h1>
      <p className="mt-1 text-ink/70">
        {gradeLabel(a.grade, 'en')} · {a.schoolYear} · {a.submittedAt ? `Submitted ${formatDate(a.submittedAt, 'en')}` : 'Draft (not submitted)'}
      </p>
      <p className="mt-1 text-ink/70">
        Family: {family.name ?? '—'}{family.email && <> · <a href={`mailto:${family.email}`} className={link}>{family.email}</a></>}
      </p>

      <h2 className="mt-10 border-b border-ink pb-2 font-serif text-2xl">Checklist</h2>
      <ul>
        {data.checklist
          .slice()
          .sort((x, y) => Object.keys(TITLES).indexOf(x.kind) - Object.keys(TITLES).indexOf(y.kind))
          .map((c) => (
            <ChecklistRow key={`${c.kind}:${c.status}:${c.notes ?? ''}`} appId={id} c={c} detail={data} onSaved={refresh} />
          ))}
      </ul>

      <h2 className="mt-12 border-b border-ink pb-2 font-serif text-2xl">Application</h2>
      {schema.data?.steps.map((s) => (
        <details key={s.id} className="border-b border-sand py-3">
          <summary className="cursor-pointer font-semibold">
            {pick(s.title, 'en')} {data.sections[s.id]?.isComplete ? '' : <span className="font-normal text-ink/50">(incomplete)</span>}
          </summary>
          <div className="mt-4 pb-2"><ReadOnly fields={s.fields} value={data.sections[s.id]?.data ?? {}} /></div>
        </details>
      ))}

      {data.signatures.length > 0 && (
        <>
          <h2 className="mt-12 border-b border-ink pb-2 font-serif text-2xl">Signature</h2>
          {data.signatures.map((s, i) => (
            <p key={i} className="mt-3 text-sm">
              Signed by <b>{s.name}</b> ({s.email}) on {new Date(s.signedAt).toLocaleString('en-US')} · consent text {s.version}
            </p>
          ))}
        </>
      )}

      <Notes appId={id} notes={data.notes} onSaved={refresh} />
    </div>
  )
}

function ChecklistRow({ appId, c, detail, onSaved }: { appId: string; c: Detail['checklist'][number]; detail: Detail; onSaved: () => void }) {
  const [status, setStatus] = useState(c.status)
  const [notes, setNotes] = useState(c.notes ?? '')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const recKind = REC_KIND[c.kind]
  const rec = recKind ? detail.recommendations.find((r) => r.kind === recKind) : undefined
  const interviewKind = INTERVIEW_KIND[c.kind]
  const files = detail.documents.filter((d) => d.kind === c.kind)
  const interviews = detail.interviews.filter((i) => i.kind === interviewKind)
  const dirty = status !== c.status || notes !== (c.notes ?? '')

  async function save() {
    setBusy(true)
    setError(null)
    try {
      await api(`/staff/applications/${appId}/checklist/${c.kind}`, { status, notes }, 'PATCH')
      onSaved()
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Couldn’t save.')
      setBusy(false)
    }
  }

  async function interviewAction(interviewId: string, next: 'completed' | 'no_show' | 'cancelled') {
    if (next === 'cancelled' && !window.confirm('Cancel this interview? The slot will reopen and the family will need to rebook.')) return
    setBusy(true)
    try {
      await api(`/staff/interviews/${interviewId}`, { status: next }, 'PATCH')
      onSaved()
    } catch {
      setError('Couldn’t update the interview.')
      setBusy(false)
    }
  }

  return (
    <li className="border-b border-sand py-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="font-semibold">{TITLES[c.kind]}</p>
        {c.kind === 'application_form' ? (
          <span className="text-sm text-ink/70">{c.status === 'pending' ? 'Not submitted' : 'Submitted by family'}</span>
        ) : interviewKind ? (
          <span className="text-sm text-ink/70">{{ pending: 'Not scheduled', submitted: 'Scheduled', verified: 'Completed', waived: 'Not needed' }[c.status]}</span>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label={`${TITLES[c.kind]} status`} className={field}>
              <option value="pending">To do</option>
              <option value="submitted">Received</option>
              <option value="verified">Verified / complete</option>
              <option value="waived">Not needed</option>
            </select>
            <button type="button" disabled={!dirty || busy} onClick={() => void save()} className={button}>Save</button>
          </div>
        )}
      </div>

      {!interviewKind && c.kind !== 'application_form' && (
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={500}
          placeholder={NOTE_HINT[c.kind] ?? 'Note (optional)'}
          aria-label={`${TITLES[c.kind]} note`}
          className={`${field} mt-3 w-full`}
        />
      )}

      {rec && (
        <p className="mt-3 text-sm text-ink/80">
          {rec.name} ({rec.email}), requested {formatDate(rec.requestedAt, 'en')}
          {rec.submittedAt ? `, received ${formatDate(rec.submittedAt, 'en')}` : `, awaiting upload (link expires ${formatDate(rec.expiresAt, 'en')}, sent ${rec.sendCount}×)`}
        </p>
      )}
      {recKind && !rec && <p className="mt-3 text-sm text-ink/60">The family hasn’t requested this yet.</p>}

      {files.length > 0 && (
        <ul className="mt-3 divide-y divide-sand border border-sand">
          {files.map((d) => (
            <li key={d.id} className="flex items-center justify-between gap-3 px-4 py-2 text-sm">
              <span className="min-w-0 truncate">{d.name} <span className="text-ink/50">· {formatBytes(d.size)} · {formatDate(d.createdAt, 'en')}{d.byRecommender ? ' · from recommender' : ''}</span></span>
              <button type="button" onClick={() => void openFile(d.id)} className={link}>View</button>
            </li>
          ))}
        </ul>
      )}

      {interviewKind && (
        <div className="mt-3 space-y-2 text-sm">
          {interviews.length === 0 && <p className="text-ink/60">Nothing booked yet.</p>}
          {interviews.map((i) => (
            <div key={i.id} className="flex flex-wrap items-center justify-between gap-3 border border-sand px-4 py-2">
              <span>{formatSlot(i.startsAt, i.endsAt, 'en')} · {i.location} · <b>{i.status.replace('_', ' ')}</b></span>
              {i.status === 'scheduled' && (
                <span className="flex gap-2">
                  <button type="button" disabled={busy} onClick={() => void interviewAction(i.id, 'completed')} className={button}>Mark completed</button>
                  <button type="button" disabled={busy} onClick={() => void interviewAction(i.id, 'no_show')} className={button}>No-show</button>
                  <button type="button" disabled={busy} onClick={() => void interviewAction(i.id, 'cancelled')} className={button}>Cancel</button>
                </span>
              )}
            </div>
          ))}
        </div>
      )}
      <p role="alert" className="mt-2 text-sm text-red-800">{error}</p>
    </li>
  )
}

function Notes({ appId, notes, onSaved }: { appId: string; notes: Detail['notes']; onSaved: () => void }) {
  const [busy, setBusy] = useState(false)
  async function add(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const body = String(new FormData(form).get('body') ?? '').trim()
    if (!body) return
    setBusy(true)
    try {
      await api(`/staff/applications/${appId}/notes`, { body })
      form.reset()
      onSaved()
    } finally {
      setBusy(false)
    }
  }
  return (
    <>
      <h2 className="mt-12 border-b border-ink pb-2 font-serif text-2xl">Staff notes</h2>
      <form onSubmit={add} className="mt-4">
        <textarea name="body" rows={3} maxLength={2000} placeholder="Add an internal note (families never see these)" className={`${field} w-full`} />
        <button type="submit" disabled={busy} className={`${button} mt-2`}>Add note</button>
      </form>
      <ul className="mt-4">
        {notes.map((n) => (
          <li key={n.id} className="border-b border-sand py-3">
            <p className="whitespace-pre-wrap">{n.body}</p>
            <p className="mt-1 text-sm text-ink/60">{n.author} · {new Date(n.createdAt).toLocaleString('en-US')}</p>
          </li>
        ))}
      </ul>
    </>
  )
}
