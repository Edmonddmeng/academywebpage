import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ApiError, api } from '../auth/api'
import { useLocale } from '../content/locale'
import FormEngine from './FormEngine'
import { gradeLabel, useFormSchema, useLoad } from './hooks'
import { pick, type AppDetail, type Data, type FormSchema } from './types'

const copy = {
  en: {
    back: '← My Students',
    applying: (grade: string, year: string) => `Applying for ${grade} in ${year}`,
    step: (n: number, total: number) => `Step ${n} of ${total}`,
    loading: 'Loading…',
    loadError: 'We couldn’t load this application. Please go back and try again.',
    back_: 'Back',
    next: 'Save and continue',
    submit: 'Submit application',
    working: 'One moment…',
    saving: 'Saving…',
    saved: 'All changes saved',
    saveError: 'Couldn’t save. Check your connection.',
    fixErrors: 'Please complete the highlighted questions to continue.',
    locked: 'Finish the earlier steps first',
    stepsLeft: (titles: string) => `These steps still need answers: ${titles}.`,
    submitError: 'We couldn’t submit your application. Please try again.',
  },
  zh: {
    back: '← 我的学生',
    applying: (grade: string, year: string) => `申请 ${year} 学年${grade}`,
    step: (n: number, total: number) => `第 ${n} 步，共 ${total} 步`,
    loading: '加载中……',
    loadError: '无法加载此申请，请返回后重试。',
    back_: '上一步',
    next: '保存并继续',
    submit: '提交申请',
    working: '请稍候……',
    saving: '保存中……',
    saved: '所有更改已保存',
    saveError: '保存失败，请检查网络连接。',
    fixErrors: '请完成标出的问题后再继续。',
    locked: '请先完成前面的步骤',
    stepsLeft: (titles: string) => `以下步骤还需填写：${titles}。`,
    submitError: '无法提交申请，请重试。',
  },
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error'
const AUTOSAVE_MS = 1000

export default function Application() {
  const { id = '' } = useParams()
  const t = copy[useLocale()]
  const schema = useFormSchema()
  const detail = useLoad<AppDetail>(`/applications/${id}`)

  if (schema.error || detail.error) {
    return (
      <div>
        <Link to="/portal" className="text-sm underline underline-offset-4 hover:text-brass">{t.back}</Link>
        <p className="mt-6 text-red-800">{t.loadError}</p>
      </div>
    )
  }
  if (!schema.data || !detail.data) return <p className="text-ink/70">{t.loading}</p>
  if (detail.data.application.status !== 'draft') return <Navigate to={`/portal/applications/${id}/checklist`} replace />
  return <Wizard schema={schema.data} detail={detail.data} />
}

const clamp = (n: number, max: number) => Math.min(Math.max(n, 0), max)

// Drop errors for any top-level field whose value just changed, so stale red text disappears as the user edits.
function pruneErrors(errors: Record<string, string>, before: Data, after: Data) {
  const changed = new Set(
    [...new Set([...Object.keys(before), ...Object.keys(after)])].filter(
      (k) => JSON.stringify(before[k]) !== JSON.stringify(after[k]),
    ),
  )
  return Object.fromEntries(Object.entries(errors).filter(([path]) => !changed.has(path.split('.')[0])))
}

function Wizard({ schema, detail }: { schema: FormSchema; detail: AppDetail }) {
  const locale = useLocale()
  const t = copy[locale]
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const { application } = detail
  const steps = schema.steps

  // Steps are taken in order: you can only reach the first step that still has unanswered questions.
  // A ?step= in the URL is clamped to that, so it can't be used to skip ahead either.
  const [index, setIndex] = useState(() => {
    const firstOpen = steps.findIndex((s) => !detail.sections[s.id]?.isComplete)
    const furthest = firstOpen < 0 ? steps.length - 1 : firstOpen
    const fromUrl = Number(params.get('step'))
    return Number.isInteger(fromUrl) && fromUrl >= 1 ? clamp(fromUrl - 1, furthest) : furthest
  })
  const [values, setValues] = useState<Record<string, Data>>(() =>
    Object.fromEntries(steps.map((s) => [s.id, detail.sections[s.id]?.data ?? {}])),
  )
  const [complete, setComplete] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(steps.map((s) => [s.id, !!detail.sections[s.id]?.isComplete])),
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  const step = steps[index]
  const firstIncomplete = steps.findIndex((s) => !complete[s.id])
  const furthest = firstIncomplete < 0 ? steps.length - 1 : firstIncomplete
  const pending = useRef<{ stepId: string; data: Data } | null>(null)
  const timer = useRef<number | undefined>(undefined)
  const topRef = useRef<HTMLDivElement>(null)

  const put = (stepId: string, data: Data, wantComplete: boolean) =>
    api<{ ok: true; isComplete: boolean }>(`/applications/${application.id}/sections/${stepId}`, { data, complete: wantComplete }, 'PUT')

  async function save(stepId: string, data: Data, wantComplete: boolean): Promise<{ ok: boolean; errors?: Record<string, string> }> {
    setSaveState('saving')
    try {
      const r = await put(stepId, data, wantComplete)
      setComplete((c) => ({ ...c, [stepId]: r.isComplete }))
      setSaveState('saved')
      return { ok: true }
    } catch (e) {
      if (e instanceof ApiError && e.code === 'incomplete') {
        setComplete((c) => ({ ...c, [stepId]: false }))
        setSaveState('saved')
        return { ok: false, errors: e.body.errors as Record<string, string> }
      }
      setSaveState('error')
      return { ok: false }
    }
  }

  async function flush() {
    window.clearTimeout(timer.current)
    const p = pending.current
    pending.current = null
    if (p) await save(p.stepId, p.data, false)
  }

  // If the page is left with edits still waiting, send them (fire-and-forget).
  useEffect(
    () => () => {
      window.clearTimeout(timer.current)
      const p = pending.current
      if (p) void put(p.stepId, p.data, false).catch(() => {})
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  function change(next: Data) {
    setValues((v) => ({ ...v, [step.id]: next }))
    setErrors((e) => pruneErrors(e, values[step.id], next))
    setNotice(null)
    setSaveState('idle')
    pending.current = { stepId: step.id, data: next }
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => void flush(), AUTOSAVE_MS)
  }

  function goTo(i: number) {
    setIndex(i)
    setErrors({})
    setNotice(null)
    setParams({ step: String(i + 1) }, { replace: true })
    topRef.current?.scrollIntoView({ block: 'start' })
  }

  async function jump(i: number) {
    if (i === index || busy || i > furthest) return
    await flush()
    goTo(i)
  }

  function showErrors(e: Record<string, string>) {
    setErrors(e)
    setNotice(t.fixErrors)
    requestAnimationFrame(() =>
      document.querySelector('[data-invalid="true"]')?.scrollIntoView({ block: 'center', behavior: 'smooth' }),
    )
  }

  async function next() {
    setBusy(true)
    await flush()
    const r = await save(step.id, values[step.id], true)
    if (!r.ok) {
      if (r.errors) showErrors(r.errors)
      setBusy(false)
      return
    }
    setErrors({})
    if (index < steps.length - 1) {
      goTo(index + 1)
      setBusy(false)
      return
    }
    try {
      await api(`/applications/${application.id}/submit`, {})
      navigate(`/portal/applications/${application.id}/checklist`, { replace: true, state: { submitted: true } })
    } catch (e) {
      if (e instanceof ApiError && e.code === 'incomplete_steps') {
        const ids = e.body.steps as string[]
        setNotice(t.stepsLeft(ids.map((sid) => pick(steps.find((s) => s.id === sid)!.title, locale)).join(', ')))
        setComplete((c) => ({ ...c, ...Object.fromEntries(ids.map((sid) => [sid, false])) }))
      } else {
        setNotice(t.submitError)
      }
      setBusy(false)
    }
  }

  const name = [application.firstName, application.lastName].filter(Boolean).join(' ')
  const isLast = index === steps.length - 1

  return (
    <div className="mx-auto max-w-3xl" ref={topRef}>
      <Link to="/portal" className="text-sm underline underline-offset-4 hover:text-brass">
        {t.back}
      </Link>
      <h1 className="mt-6 font-serif text-4xl">{name}</h1>
      <p className="mt-1 text-ink/70">{t.applying(gradeLabel(application.grade, locale), application.schoolYear)}</p>

      <ol className="mt-8 flex items-start gap-1 sm:gap-3" aria-label="Steps">
        {steps.map((s, i) => {
          const current = i === index
          const locked = i > furthest
          return (
            <li key={s.id} className="min-w-0 flex-1">
              <button
                type="button"
                onClick={() => void jump(i)}
                disabled={locked}
                title={locked ? t.locked : undefined}
                aria-current={current ? 'step' : undefined}
                className="group w-full cursor-pointer text-left disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className={`block h-1.5 ${current ? 'bg-brass' : complete[s.id] ? 'bg-ink' : 'bg-sand'}`} />
                <span className={`mt-2 flex items-start gap-2 text-sm ${current ? 'font-semibold' : 'text-ink/70 group-hover:text-ink'}`}>
                  <span
                    className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border text-xs ${
                      complete[s.id] ? 'border-ink bg-ink text-white' : current ? 'border-brass text-brass' : 'border-ink/40'
                    }`}
                  >
                    {complete[s.id] ? '✓' : i + 1}
                  </span>
                  <span className="hidden leading-tight sm:inline">{pick(s.title, locale)}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>

      <section className="mt-10">
        <p className="text-sm tracking-[0.14em] text-brass uppercase">{t.step(index + 1, steps.length)}</p>
        <h2 className="mt-1 border-b border-ink pb-2 font-serif text-3xl">{pick(step.title, locale)}</h2>
        {step.intro && <p className="mt-4 text-ink/70">{pick(step.intro, locale)}</p>}

        <div className="mt-8">
          <FormEngine key={step.id} fields={step.fields} value={values[step.id]} onChange={change} errors={errors} />
        </div>

        <div aria-live="polite" className="mt-8 min-h-6">
          {notice && <p className="text-red-800">{notice}</p>}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-sand pt-6">
          <button
            type="button"
            onClick={() => void jump(index - 1)}
            disabled={index === 0 || busy}
            className="border border-ink px-8 py-3 text-sm font-semibold tracking-[0.14em] uppercase transition-colors hover:bg-ink hover:text-white disabled:invisible"
          >
            {t.back_}
          </button>
          <span className={`text-sm ${saveState === 'error' ? 'text-red-800' : 'text-ink/60'}`} aria-live="polite">
            {saveState === 'saving' && t.saving}
            {saveState === 'saved' && t.saved}
            {saveState === 'error' && t.saveError}
          </span>
          <button
            type="button"
            onClick={() => void next()}
            disabled={busy}
            className="bg-ink px-8 py-3 text-sm font-semibold tracking-[0.14em] text-white uppercase transition-colors hover:bg-brass disabled:opacity-60"
          >
            {busy ? t.working : isLast ? t.submit : t.next}
          </button>
        </div>
      </section>
    </div>
  )
}
