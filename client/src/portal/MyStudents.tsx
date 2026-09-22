import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useLocale } from '../content/locale'
import { site } from '../content/site'
import { gradeLabel, useLoad } from './hooks'
import type { AppSummary } from './types'

const copy = {
  en: {
    welcome: (name: string) => `Welcome, ${name}`,
    students: 'Students',
    loading: 'Loading…',
    error: 'We couldn’t load your students. Please refresh the page.',
    empty: 'You haven’t added a student yet. Start an application below.',
    applying: (grade: string, year: string) => `Applying for ${grade} in ${year}`,
    inProgress: (done: number, total: number) => `Application in progress: ${done} of ${total} steps complete`,
    continue: 'Continue application',
    itemsLeft: (n: number) => `${n} ${n === 1 ? 'item' : 'items'} left`,
    viewChecklist: 'View checklist',
    complete: 'Thank you! Your application process is complete.',
    addStudent: 'Add a new student',
    addStudentNote: ': prospective students who have not yet applied',
    newYear: 'Apply for a new year',
    newYearNote: ': students who applied previously but would like to apply for a new year',
    contact: 'Contact us',
    office: 'Admission Office',
  },
  zh: {
    welcome: (name: string) => `欢迎，${name}`,
    students: '学生',
    loading: '加载中……',
    error: '无法加载学生信息，请刷新页面。',
    empty: '您还没有添加学生，请在下方开始申请。',
    applying: (grade: string, year: string) => `申请 ${year} 学年${grade}`,
    inProgress: (done: number, total: number) => `申请进行中：已完成 ${done}/${total} 步`,
    continue: '继续申请',
    itemsLeft: (n: number) => `还有 ${n} 项待完成`,
    viewChecklist: '查看清单',
    complete: '感谢您！您的申请流程已全部完成。',
    addStudent: '添加新学生',
    addStudentNote: '：尚未申请的学生',
    newYear: '申请新学年',
    newYearNote: '：曾经申请过、想申请新学年的学生',
    contact: '联系我们',
    office: '招生办公室',
  },
}

const box = 'block border border-sand bg-ivory/60 px-5 py-4 transition-colors hover:border-brass'

export default function MyStudents() {
  const locale = useLocale()
  const t = copy[locale]
  const { user } = useAuth()
  const { data, error, loading } = useLoad<{ applications: AppSummary[] }>('/applications')

  const first = user?.fullName?.split(' ')[0] ?? user?.email ?? ''
  const apps = data?.applications ?? []

  return (
    <>
      <h1 className="font-serif text-4xl">{t.welcome(first)}</h1>

      <div className="mt-10 grid gap-12 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <h2 className="border-b border-ink pb-2 font-serif text-2xl">{t.students}</h2>

          {loading && <p className="mt-6 text-ink/70">{t.loading}</p>}
          {error && <p className="mt-6 text-red-800">{t.error}</p>}
          {data && apps.length === 0 && <p className="mt-6 text-ink/70">{t.empty}</p>}

          <ul>
            {apps.map((a) => (
              <li key={a.id} className="border-b border-sand py-6">
                <p className="font-serif text-2xl">
                  {a.firstName} {a.lastName}
                </p>
                <p className="mt-1 text-ink/70">{t.applying(gradeLabel(a.grade, locale), a.schoolYear)}</p>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 italic text-ink/70">
                  {a.status === 'draft' ? (
                    <>
                      <span>{t.inProgress(a.stepsComplete, a.stepsTotal)}</span>
                      <Link
                        to={`/portal/applications/${a.id}`}
                        className="bg-ink px-6 py-2 text-sm font-semibold tracking-[0.14em] text-white uppercase not-italic transition-colors hover:bg-brass"
                      >
                        {t.continue}
                      </Link>
                    </>
                  ) : (
                    <>
                      <span>{a.itemsLeft === 0 ? t.complete : ''}</span>
                      <span>
                        {a.itemsLeft > 0 && `${t.itemsLeft(a.itemsLeft)} | `}
                        <Link to={`/portal/applications/${a.id}/checklist`} className="not-italic text-ink underline underline-offset-4 hover:text-brass">
                          {t.viewChecklist}
                        </Link>
                      </span>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 space-y-4">
            <Link to="/portal/students/new" className={box}>
              <span className="font-semibold underline underline-offset-4">{t.addStudent}</span>
              {t.addStudentNote}
            </Link>
            {apps.length > 0 && (
              <Link to="/portal/students/new-year" className={box}>
                <span className="font-semibold underline underline-offset-4">{t.newYear}</span>
                {t.newYearNote}
              </Link>
            )}
          </div>
        </section>

        <aside>
          <h2 className="border-b border-ink pb-2 font-serif text-2xl">{t.contact}</h2>
          <p className="mt-6 font-semibold">{t.office}</p>
          <p className="mt-1">{site.phone}</p>
          <a href={`mailto:${site.email}`} className="mt-1 block underline underline-offset-4 hover:text-brass">
            {site.email}
          </a>
        </aside>
      </div>
    </>
  )
}
