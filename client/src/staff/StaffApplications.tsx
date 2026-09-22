import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatDate, gradeLabel, useLoad } from '../portal/hooks'

type Row = {
  id: string; status: string; schoolYear: string; grade: string; firstName: string | null; lastName: string | null
  submittedAt: string | null; checklist: Record<string, string>
}

// Items where a family or recommender has sent something and the school still has to look at it.
const REVIEW = ['birth_certificate', 'report_card', 'rec_principal', 'rec_math', 'rec_english']
const field = 'border border-sand bg-white px-3 py-2 focus:border-brass focus:outline-none'

export default function StaffApplications() {
  const [status, setStatus] = useState('')
  const [year, setYear] = useState('')
  const [grade, setGrade] = useState('')
  const [q, setQ] = useState('')
  const params = new URLSearchParams()
  if (status) params.set('status', status)
  if (year) params.set('year', year)
  if (grade) params.set('grade', grade)
  if (q.trim()) params.set('q', q.trim())
  const { data, loading, error } = useLoad<{ applications: Row[] }>(`/staff/applications?${params}`)
  const rows = data?.applications ?? []

  return (
    <>
      <h1 className="font-serif text-4xl">Applications</h1>
      <div className="mt-6 flex flex-wrap gap-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name" aria-label="Search by name" className={`${field} w-56`} />
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status" className={field}>
          <option value="">Submitted</option>
          <option value="draft">Drafts (not submitted)</option>
        </select>
        <select value={year} onChange={(e) => setYear(e.target.value)} aria-label="School year" className={field}>
          <option value="">All years</option>
          <option>2026-2027</option>
          <option>2027-2028</option>
        </select>
        <select value={grade} onChange={(e) => setGrade(e.target.value)} aria-label="Grade" className={field}>
          <option value="">All grades</option>
          {['6', '7', '8', '9', '10', '11', '12'].map((g) => <option key={g} value={g}>{gradeLabel(g, 'en')}</option>)}
        </select>
      </div>

      {error && <p className="mt-6 text-red-800">Couldn’t load applications.</p>}
      {loading && !data && <p className="mt-6 text-ink/70">Loading…</p>}
      {data && rows.length === 0 && <p className="mt-6 text-ink/70">No applications match.</p>}

      {rows.length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[42rem] text-left">
            <thead>
              <tr className="border-b border-ink text-sm">
                <th className="py-2 pr-4 font-semibold">Student</th>
                <th className="py-2 pr-4 font-semibold">Grade</th>
                <th className="py-2 pr-4 font-semibold">Year</th>
                <th className="py-2 pr-4 font-semibold">Submitted</th>
                <th className="py-2 pr-4 font-semibold">Checklist</th>
                <th className="py-2 font-semibold">Needs review</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const items = Object.entries(r.checklist)
                const done = items.filter(([, s]) => s !== 'pending').length
                const review = REVIEW.filter((k) => r.checklist[k] === 'submitted').length
                return (
                  <tr key={r.id} className="border-b border-sand">
                    <td className="py-3 pr-4">
                      <Link to={`/staff/applications/${r.id}`} className="font-semibold underline underline-offset-4 hover:text-brass">
                        {r.firstName} {r.lastName}
                      </Link>
                    </td>
                    <td className="py-3 pr-4">{gradeLabel(r.grade, 'en')}</td>
                    <td className="py-3 pr-4">{r.schoolYear}</td>
                    <td className="py-3 pr-4">{r.submittedAt ? formatDate(r.submittedAt, 'en') : r.status === 'draft' ? 'Draft' : '—'}</td>
                    <td className="py-3 pr-4">{done} of {items.length}</td>
                    <td className="py-3">{review > 0 ? <span className="border border-brass px-2 py-0.5 text-sm text-brass">{review} to review</span> : '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
