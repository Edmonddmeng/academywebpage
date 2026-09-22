import { useRef, useState, type FormEvent } from 'react'
import { ApiError, api, apiUpload } from '../auth/api'
import { useLocale } from '../content/locale'
import { formatBytes, formatDate, formatSlot, groupByDay, timeOnly, useLoad } from './hooks'
import type { AppDetail } from './types'

const MAX_BYTES = 10 * 1024 * 1024

const copy = {
  en: {
    upload: 'Upload a file',
    uploading: 'Uploading…',
    hint: 'PDF, JPG or PNG · up to 10 MB · up to 5 files',
    view: 'View',
    remove: 'Remove',
    removeConfirm: 'Remove this file?',
    received: 'Received. The Admission Office will review it.',
    verified: 'Reviewed and verified by the school.',
    errors: {
      bad_file_type: 'Please upload a PDF, JPG or PNG file.',
      file_too_large: 'That file is too large. The limit is 10 MB.',
      too_many_files: 'You’ve reached the limit of 5 files here.',
      locked: 'This item has already been reviewed by the school.',
      email_failed: 'We couldn’t send the email. Please try again in a moment.',
      too_many_sends: 'This link has been sent too many times. Please contact the Admission Office.',
      already_received: 'This recommendation has already been received.',
      slot_taken: 'Sorry, someone just took that time. Please pick another.',
      slot_unavailable: 'That time is no longer available. Please pick another.',
      already_scheduled: 'You already have this interview scheduled.',
      too_late: 'Interviews can be cancelled up to 24 hours before they start. Please contact the Admission Office.',
      validation: 'Please check the details and try again.',
      error: 'Something went wrong. Please try again.',
    } as Record<string, string>,
    // recommendations
    recWho: 'Recommender’s name',
    recEmail: 'Recommender’s email',
    recForm: 'We’ll email a secure, private link to this address so they can upload their recommendation. You’ll get an email too, and again when it arrives.',
    recRequest: 'Request recommendation',
    recSend: 'Send request',
    recSending: 'Sending…',
    recCancel: 'Cancel',
    recWaiting: (name: string, email: string, d: string) => `Requested from ${name} (${email}) on ${d}. Waiting for them to upload it.`,
    recExpires: (d: string) => `The link works until ${d}.`,
    recResend: 'Send the link again',
    recChange: 'Change recommender',
    recResent: 'We sent the link again.',
    recDone: (name: string, d: string) => `Received from ${name} on ${d}.`,
    // interviews
    locked: 'Available once your child’s birth certificate has been verified.',
    schedule: 'Schedule interview',
    loadingSlots: 'Loading available times…',
    noSlots: 'No times are open right now. Please check back soon, or contact the Admission Office.',
    pickTime: 'Choose a time',
    confirm: 'Confirm this time',
    booking: 'Booking…',
    scheduled: 'Scheduled',
    cancelInterview: 'Cancel interview',
    cancelConfirm: 'Cancel this interview? You can pick a new time afterwards.',
    completed: 'This interview has been completed.',
    missed: 'This interview was missed. Please schedule a new time.',
    tzNote: 'All times are Pacific Time (campus time).',
    close: 'Close',
  },
  zh: {
    upload: '上传文件',
    uploading: '上传中……',
    hint: 'PDF、JPG 或 PNG · 最大 10 MB · 最多 5 个文件',
    view: '查看',
    remove: '删除',
    removeConfirm: '删除此文件？',
    received: '已收到，招生办公室将进行审核。',
    verified: '学校已审核并确认。',
    errors: {
      bad_file_type: '请上传 PDF、JPG 或 PNG 文件。',
      file_too_large: '文件过大，上限为 10 MB。',
      too_many_files: '此处最多可上传 5 个文件。',
      locked: '学校已审核此项。',
      email_failed: '邮件发送失败，请稍后重试。',
      too_many_sends: '该链接发送次数过多，请联系招生办公室。',
      already_received: '此推荐信已收到。',
      slot_taken: '抱歉，该时间刚刚被预约，请选择其他时间。',
      slot_unavailable: '该时间已不可用，请选择其他时间。',
      already_scheduled: '您已预约此面试。',
      too_late: '面试可在开始前 24 小时之前取消，请联系招生办公室。',
      validation: '请检查填写内容后重试。',
      error: '出现问题，请重试。',
    } as Record<string, string>,
    recWho: '推荐人姓名',
    recEmail: '推荐人邮箱',
    recForm: '我们会向该邮箱发送一个安全的私人链接，供对方上传推荐信。您也会收到邮件，推荐信送达时会再次通知您。',
    recRequest: '邀请推荐人',
    recSend: '发送邀请',
    recSending: '发送中……',
    recCancel: '取消',
    recWaiting: (name: string, email: string, d: string) => `已于 ${d} 向 ${name}（${email}）发出邀请，正在等待对方上传。`,
    recExpires: (d: string) => `链接有效期至 ${d}。`,
    recResend: '重新发送链接',
    recChange: '更换推荐人',
    recResent: '我们已重新发送链接。',
    recDone: (name: string, d: string) => `已于 ${d} 收到 ${name} 的推荐信。`,
    locked: '孩子的出生证明审核通过后即可预约。',
    schedule: '预约面试',
    loadingSlots: '正在加载可选时间……',
    noSlots: '目前没有可预约的时间，请稍后再来，或联系招生办公室。',
    pickTime: '选择时间',
    confirm: '确认此时间',
    booking: '预约中……',
    scheduled: '已预约',
    cancelInterview: '取消面试',
    cancelConfirm: '确定取消此面试吗？之后可以重新选择时间。',
    completed: '此面试已完成。',
    missed: '此面试未出席，请重新预约时间。',
    tzNote: '所有时间均为太平洋时间（校园当地时间）。',
    close: '关闭',
  },
}

const button =
  'border border-ink px-5 py-2 text-sm font-semibold tracking-[0.12em] uppercase transition-colors hover:bg-ink hover:text-white disabled:opacity-60'
const solid = 'bg-ink px-5 py-2 text-sm font-semibold tracking-[0.12em] text-white uppercase transition-colors hover:bg-brass disabled:opacity-60'
const link = 'text-sm underline underline-offset-4 hover:text-brass disabled:opacity-60'
const input = 'mt-1 w-full border border-sand bg-white px-3 py-2 focus:border-brass focus:outline-none'

const errorCode = (e: unknown) => (e instanceof ApiError ? e.code : 'error')

type Common = { appId: string; onChange: () => void }

// --- Uploads (birth certificate, report card) -------------------------------------

export function UploadPanel({
  appId, kind, docs, status, onChange,
}: Common & { kind: 'birth_certificate' | 'report_card'; docs: AppDetail['documents']; status: string }) {
  const locale = useLocale()
  const t = copy[locale]
  const fileInput = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mine = docs.filter((d) => d.kind === kind)
  const locked = status === 'verified' || status === 'waived'

  async function onPick(file: File | undefined) {
    if (!file) return
    if (file.size > MAX_BYTES) return setError(t.errors.file_too_large)
    setBusy(true)
    setError(null)
    try {
      const form = new FormData()
      form.append('kind', kind)
      form.append('file', file)
      await apiUpload(`/applications/${appId}/documents`, form)
      onChange()
    } catch (e) {
      setError(t.errors[errorCode(e)] ?? t.errors.error)
    } finally {
      setBusy(false)
      if (fileInput.current) fileInput.current.value = ''
    }
  }

  async function view(id: string) {
    const w = window.open('about:blank', '_blank') // open now so the pop-up isn't blocked, then point it at the file
    try {
      const { url } = await api<{ url: string }>(`/applications/${appId}/documents/${id}/url`)
      if (w) w.location.href = url
    } catch {
      w?.close()
      setError(t.errors.error)
    }
  }

  async function remove(id: string) {
    if (!window.confirm(t.removeConfirm)) return
    try {
      await api(`/applications/${appId}/documents/${id}`, {}, 'DELETE')
      onChange()
    } catch (e) {
      setError(t.errors[errorCode(e)] ?? t.errors.error)
    }
  }

  return (
    <div className="mt-4">
      {mine.length > 0 && (
        <ul className="divide-y divide-sand border border-sand">
          {mine.map((d) => (
            <li key={d.id} className="flex items-center justify-between gap-3 px-4 py-2 text-sm">
              <span className="min-w-0 truncate">
                {d.name} <span className="text-ink/50">· {formatBytes(d.size)}</span>
              </span>
              <span className="flex shrink-0 gap-4">
                <button type="button" onClick={() => void view(d.id)} className={link}>{t.view}</button>
                {!locked && (
                  <button type="button" onClick={() => void remove(d.id)} className={link}>{t.remove}</button>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
      {!locked && (
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <button type="button" disabled={busy} onClick={() => fileInput.current?.click()} className={button}>
            {busy ? t.uploading : t.upload}
          </button>
          <input
            ref={fileInput}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
            className="hidden"
            onChange={(e) => void onPick(e.target.files?.[0])}
          />
          <span className="text-sm text-ink/60">{t.hint}</span>
        </div>
      )}
      {mine.length > 0 && <p className="mt-2 text-sm text-ink/70">{status === 'verified' ? t.verified : t.received}</p>}
      <p role="alert" className="mt-2 text-sm text-red-800">{error}</p>
    </div>
  )
}

// --- Recommendations --------------------------------------------------------------

export function RecommendationPanel({
  appId, kind, rec, status, onChange,
}: Common & { kind: string; rec?: AppDetail['recommendations'][number]; status: string }) {
  const locale = useLocale()
  const t = copy[locale]
  const [editing, setEditing] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const received = !!rec?.submittedAt || status === 'submitted' || status === 'verified' || status === 'waived'
  if (received && rec?.submittedAt) {
    return <p className="mt-3 text-sm text-ink/70">{t.recDone(rec.name, formatDate(rec.submittedAt, locale))}</p>
  }
  if (received) return null

  async function send(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    setBusy(true)
    setError(null)
    try {
      await api(`/applications/${appId}/recommendations`, { kind, name: f.get('name'), email: f.get('email'), locale })
      setEditing(false)
      onChange()
    } catch (err) {
      setError(t.errors[errorCode(err)] ?? t.errors.error)
    } finally {
      setBusy(false)
    }
  }

  async function resend() {
    setBusy(true)
    setError(null)
    setNotice(null)
    try {
      await api(`/applications/${appId}/recommendations/${kind}/resend`, { locale })
      setNotice(t.recResent)
      onChange()
    } catch (err) {
      setError(t.errors[errorCode(err)] ?? t.errors.error)
    } finally {
      setBusy(false)
    }
  }

  if (rec && !editing) {
    return (
      <div className="mt-3 text-sm">
        <p className="text-ink/80">{t.recWaiting(rec.name, rec.email, formatDate(rec.requestedAt, locale))}</p>
        <p className="mt-1 text-ink/60">{t.recExpires(formatDate(rec.expiresAt, locale))}</p>
        <div className="mt-3 flex flex-wrap gap-5">
          <button type="button" disabled={busy} onClick={() => void resend()} className={link}>{t.recResend}</button>
          <button type="button" onClick={() => setEditing(true)} className={link}>{t.recChange}</button>
        </div>
        <p aria-live="polite" className="mt-2 text-green-800">{notice}</p>
        <p role="alert" className="mt-2 text-red-800">{error}</p>
      </div>
    )
  }

  if (!editing) {
    return (
      <div className="mt-3">
        <button type="button" onClick={() => setEditing(true)} className={button}>{t.recRequest}</button>
      </div>
    )
  }

  return (
    <form onSubmit={send} className="mt-4 space-y-4 border border-sand bg-ivory/50 p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-semibold">{t.recWho}</span>
          <input name="name" required maxLength={100} defaultValue={rec?.name} className={input} />
        </label>
        <label className="block text-sm">
          <span className="font-semibold">{t.recEmail}</span>
          <input name="email" type="email" required maxLength={254} defaultValue={rec?.email} className={input} />
        </label>
      </div>
      <p className="text-sm text-ink/70">{t.recForm}</p>
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={busy} className={solid}>{busy ? t.recSending : t.recSend}</button>
        <button type="button" onClick={() => { setEditing(false); setError(null) }} className={link}>{t.recCancel}</button>
      </div>
      <p role="alert" className="text-sm text-red-800">{error}</p>
    </form>
  )
}

// --- Interviews -------------------------------------------------------------------

type Slot = { id: string; startsAt: string; endsAt: string; location: string }
const LEAD_MS = 24 * 60 * 60 * 1000

export function InterviewPanel({
  appId, kind, interviews, unlocked, onChange,
}: Common & { kind: 'athletic' | 'admissions'; interviews: AppDetail['interviews']; unlocked: boolean }) {
  const locale = useLocale()
  const t = copy[locale]
  const [open, setOpen] = useState(false)
  const [picked, setPicked] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [now] = useState(() => Date.now()) // one reading per visit is plenty for the 24-hour cancel rule

  const mine = interviews.filter((i) => i.kind === kind)
  const scheduled = mine.find((i) => i.status === 'scheduled')
  const completed = mine.find((i) => i.status === 'completed')
  const missed = !scheduled && !completed && mine.some((i) => i.status === 'no_show')

  if (completed) return <p className="mt-3 text-sm text-ink/70">{t.completed}</p>

  if (scheduled) {
    const canCancel = new Date(scheduled.startsAt).getTime() - now >= LEAD_MS
    return (
      <div className="mt-3 text-sm">
        <p className="font-semibold">{formatSlot(scheduled.startsAt, scheduled.endsAt, locale)}</p>
        <p className="text-ink/70">{scheduled.location}</p>
        {canCancel ? (
          <button
            type="button"
            disabled={busy}
            className={`${link} mt-2`}
            onClick={async () => {
              if (!window.confirm(t.cancelConfirm)) return
              setBusy(true)
              setError(null)
              try {
                await api(`/applications/${appId}/interviews/${scheduled.id}`, { locale }, 'DELETE')
                onChange()
              } catch (e) {
                setError(t.errors[errorCode(e)] ?? t.errors.error)
              } finally {
                setBusy(false)
              }
            }}
          >
            {t.cancelInterview}
          </button>
        ) : (
          <p className="mt-2 text-ink/60">{t.errors.too_late}</p>
        )}
        <p role="alert" className="mt-2 text-red-800">{error}</p>
      </div>
    )
  }

  if (!unlocked) return <p className="mt-3 text-sm text-ink/60">{t.locked}</p>

  return (
    <div className="mt-3">
      {missed && <p className="mb-3 text-sm text-red-800">{t.missed}</p>}
      {!open ? (
        <button type="button" onClick={() => setOpen(true)} className={button}>{t.schedule}</button>
      ) : (
        <SlotPicker
          appId={appId}
          kind={kind}
          picked={picked}
          setPicked={setPicked}
          busy={busy}
          error={error}
          onClose={() => { setOpen(false); setPicked(null); setError(null) }}
          onBook={async () => {
            if (!picked) return
            setBusy(true)
            setError(null)
            try {
              await api(`/applications/${appId}/interviews`, { slotId: picked, locale })
              setOpen(false)
              setPicked(null)
              onChange()
            } catch (e) {
              setError(t.errors[errorCode(e)] ?? t.errors.error)
              setPicked(null)
            } finally {
              setBusy(false)
            }
          }}
        />
      )}
    </div>
  )
}

function SlotPicker({
  appId, kind, picked, setPicked, busy, error, onBook, onClose,
}: {
  appId: string; kind: string; picked: string | null; setPicked: (id: string | null) => void
  busy: boolean; error: string | null; onBook: () => void; onClose: () => void
}) {
  const locale = useLocale()
  const t = copy[locale]
  const { data, loading, error: loadError } = useLoad<{ slots: Slot[] }>(`/applications/${appId}/interview-slots?kind=${kind}`)
  const days = groupByDay(data?.slots ?? [], locale)

  return (
    <div className="border border-sand bg-ivory/50 p-5">
      <p className="font-semibold">{t.pickTime}</p>
      <p className="mt-1 text-sm text-ink/60">{t.tzNote}</p>
      {loading && <p className="mt-3 text-sm text-ink/70">{t.loadingSlots}</p>}
      {loadError && <p className="mt-3 text-sm text-red-800">{t.errors.error}</p>}
      {data && days.length === 0 && <p className="mt-3 text-sm text-ink/70">{t.noSlots}</p>}
      <div className="mt-4 space-y-4">
        {days.map(([day, slots]) => (
          <div key={day}>
            <p className="text-sm font-semibold">{day}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {slots.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={picked === s.id}
                  onClick={() => setPicked(s.id)}
                  className={`border px-3 py-2 text-sm ${picked === s.id ? 'border-ink bg-ink text-white' : 'border-ink/40 hover:border-ink'}`}
                >
                  {timeOnly(s.startsAt, locale)}
                  <span className="block text-xs opacity-70">{s.location}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <button type="button" disabled={!picked || busy} onClick={onBook} className={solid}>
          {busy ? t.booking : t.confirm}
        </button>
        <button type="button" onClick={onClose} className={link}>{t.close}</button>
      </div>
      <p role="alert" className="mt-3 text-sm text-red-800">{error}</p>
    </div>
  )
}
