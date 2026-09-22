import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ApiError, api } from '../auth/api'
import { useLocale } from '../content/locale'
import { gradeLabel, useFormSchema, useLoad } from './hooks'
import type { AppSummary } from './types'

const copy = {
  en: {
    back: '← My Students',
    newTitle: 'Add a new student',
    newIntro: 'Tell us who is applying. You’ll fill out the application in five short steps and can save and return at any time.',
    renewTitle: 'Apply for a new year',
    renewIntro: 'We’ll copy your earlier answers so you only need to review and update them.',
    student: 'Student',
    firstName: 'Student’s first name',
    lastName: 'Student’s last name',
    year: 'School year applying for',
    grade: 'Grade applying to',
    choose: 'Select…',
    start: 'Start application',
    working: 'One moment…',
    errors: {
      duplicate: 'An application for this student and school year already exists.',
      limit: 'You’ve reached the application limit. Please contact the Admission Office.',
      validation: 'Please check your details and try again.',
      error: 'Something went wrong. Please try again.',
    } as Record<string, string>,
  },
  zh: {
    back: '← 我的学生',
    newTitle: '添加新学生',
    newIntro: '请告诉我们申请人是谁。申请分五个简短步骤，您可以随时保存并稍后继续。',
    renewTitle: '申请新学年',
    renewIntro: '我们会复制您之前填写的内容，您只需核对并更新。',
    student: '学生',
    firstName: '学生名',
    lastName: '学生姓',
    year: '申请学年',
    grade: '申请年级',
    choose: '请选择……',
    start: '开始申请',
    working: '请稍候……',
    errors: {
      duplicate: '该学生在该学年已有一份申请。',
      limit: '已达到申请数量上限，请联系招生办公室。',
      validation: '请检查您填写的信息后重试。',
      error: '出现问题，请重试。',
    } as Record<string, string>,
  },
}

const inputClass = 'mt-2 w-full border border-sand bg-white px-4 py-3 focus:border-brass focus:outline-none'

export default function StudentForm({ mode }: { mode: 'new' | 'renew' }) {
  const locale = useLocale()
  const t = copy[locale]
  const navigate = useNavigate()
  const schema = useFormSchema()
  const list = useLoad<{ applications: AppSummary[] }>(mode === 'renew' ? '/applications' : null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const v = (n: string) => String(f.get(n) ?? '')
    setBusy(true)
    setError(null)
    try {
      const cohort = { schoolYear: v('schoolYear'), gradeApplying: v('gradeApplying') }
      const { id } =
        mode === 'new'
          ? await api<{ id: string }>('/applications', { ...cohort, firstName: v('firstName'), lastName: v('lastName') })
          : await api<{ id: string }>(`/applications/${v('source')}/renew`, cohort)
      navigate(`/portal/applications/${id}`)
    } catch (err) {
      setError(t.errors[err instanceof ApiError ? err.code : 'error'] ?? t.errors.error)
      setBusy(false)
    }
  }

  const select = (name: string, label: string, options: { value: string; label: string }[]) => (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      <select name={name} required defaultValue="" className={inputClass}>
        <option value="" disabled>
          {t.choose}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )

  const past = list.data?.applications ?? []

  return (
    <div className="mx-auto max-w-xl">
      <Link to="/portal" className="text-sm underline underline-offset-4 hover:text-brass">
        {t.back}
      </Link>
      <h1 className="mt-6 font-serif text-4xl">{mode === 'new' ? t.newTitle : t.renewTitle}</h1>
      <p className="mt-3 text-ink/70">{mode === 'new' ? t.newIntro : t.renewIntro}</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-6">
        {mode === 'new' ? (
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold">{t.firstName}</span>
              <input name="firstName" required maxLength={50} autoComplete="off" className={inputClass} />
            </label>
            <label className="block">
              <span className="text-sm font-semibold">{t.lastName}</span>
              <input name="lastName" required maxLength={50} autoComplete="off" className={inputClass} />
            </label>
          </div>
        ) : (
          select(
            'source',
            t.student,
            past.map((a) => ({
              value: a.id,
              label: `${a.firstName} ${a.lastName} (${a.schoolYear}, ${gradeLabel(a.grade, locale)})`,
            })),
          )
        )}
        {schema.data && (
          <div className="grid gap-6 sm:grid-cols-2">
            {select('schoolYear', t.year, schema.data.schoolYears.map((y) => ({ value: y, label: y })))}
            {select('gradeApplying', t.grade, schema.data.grades.map((g) => ({ value: g, label: gradeLabel(g, locale) })))}
          </div>
        )}

        <button
          type="submit"
          disabled={busy || !schema.data}
          className="w-full bg-ink px-8 py-4 text-sm font-semibold tracking-[0.18em] text-white uppercase transition-colors hover:bg-brass disabled:opacity-60"
        >
          {busy ? t.working : t.start}
        </button>
        <div aria-live="polite">{error && <p className="text-red-800">{error}</p>}</div>
      </form>
    </div>
  )
}
