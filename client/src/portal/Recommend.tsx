import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ApiError, api, apiUpload } from '../auth/api'
import { formatBytes } from './hooks'

type Info = {
  studentName: string
  grade: string
  schoolYear: string
  recommenderName: string
  role: string
  submitted: boolean
}

const MAX_BYTES = 10 * 1024 * 1024
const errors: Record<string, string> = {
  bad_file_type: 'Please upload a PDF, JPG or PNG file.',
  file_too_large: 'That file is too large. The limit is 10 MB.',
  already_received: 'Your recommendation has already been received. Thank you!',
  rate_limited: 'Too many attempts. Please wait a few minutes and try again.',
  expired: 'This link has expired. Please ask the family to send a new one.',
  not_found: 'This link isn’t valid.',
  error: 'Something went wrong. Please try again.',
}

// The page a recommender reaches from the emailed link. No account, no login: the link itself
// is the credential, and it only ever shows the student's name, grade and year.
export default function Recommend() {
  const { token = '' } = useParams()
  const [info, setInfo] = useState<Info | null>(null)
  const [problem, setProblem] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const input = useRef<HTMLInputElement>(null)

  useEffect(() => {
    api<Info>(`/recommend/${encodeURIComponent(token)}`)
      .then((i) => {
        setInfo(i)
        setDone(i.submitted)
      })
      .catch((e) => setProblem(errors[e instanceof ApiError ? e.code : 'error'] ?? errors.error))
  }, [token])

  async function submit() {
    if (!file) return
    if (file.size > MAX_BYTES) return setError(errors.file_too_large)
    setBusy(true)
    setError(null)
    try {
      const form = new FormData()
      form.append('file', file)
      await apiUpload(`/recommend/${encodeURIComponent(token)}`, form)
      setDone(true)
    } catch (e) {
      setError(errors[e instanceof ApiError ? e.code : 'error'] ?? errors.error)
    } finally {
      setBusy(false)
    }
  }

  const card = 'w-full max-w-xl border border-sand bg-white p-8 shadow-[0_10px_40px_rgba(18,61,40,0.08)] sm:p-10'

  if (problem) {
    return (
      <div className={card}>
        <h1 className="font-serif text-3xl">Link unavailable</h1>
        <p className="mt-4 text-ink/80">{problem}</p>
      </div>
    )
  }
  if (!info) return <p className="text-ink/70">Loading…</p>

  if (done) {
    return (
      <div className={card}>
        <h1 className="font-serif text-3xl">Thank you</h1>
        <p className="mt-4 text-ink/80">
          Your recommendation for {info.studentName} has been received. We’ve emailed you a confirmation, and nothing more is needed from you.
        </p>
      </div>
    )
  }

  return (
    <div className={card}>
      <p className="text-sm tracking-[0.14em] text-brass uppercase">Recommendation</p>
      <h1 className="mt-2 font-serif text-3xl">{info.studentName}</h1>
      <p className="mt-1 text-ink/70">
        Applying to grade {info.grade} · {info.schoolYear}
      </p>

      <p className="mt-6">Dear {info.recommenderName},</p>
      <p className="mt-3 text-ink/80">
        Thank you for supporting {info.studentName}. As their {info.role}, please upload your recommendation below. It
        takes only a couple of minutes.
      </p>

      <div className="mt-6">
        <input
          ref={input}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
          className="hidden"
          onChange={(e) => {
            setFile(e.target.files?.[0] ?? null)
            setError(null)
          }}
        />
        <button
          type="button"
          onClick={() => input.current?.click()}
          className="border border-ink px-6 py-3 text-sm font-semibold tracking-[0.14em] uppercase transition-colors hover:bg-ink hover:text-white"
        >
          {file ? 'Choose a different file' : 'Choose a file'}
        </button>
        <p className="mt-2 text-sm text-ink/60">PDF, JPG or PNG · up to 10 MB</p>
        {file && (
          <p className="mt-3 text-sm">
            <span className="font-semibold">{file.name}</span> <span className="text-ink/50">· {formatBytes(file.size)}</span>
          </p>
        )}
      </div>

      <button
        type="button"
        disabled={!file || busy}
        onClick={() => void submit()}
        className="mt-6 w-full bg-ink px-8 py-4 text-sm font-semibold tracking-[0.18em] text-white uppercase transition-colors hover:bg-brass disabled:opacity-50"
      >
        {busy ? 'Uploading…' : 'Submit recommendation'}
      </button>
      <p role="alert" className="mt-3 text-red-800">{error}</p>

      <p className="mt-6 text-sm text-ink/60">
        Your recommendation is confidential; the family cannot see it. Please don’t forward this link; it’s unique to you.
      </p>
    </div>
  )
}
