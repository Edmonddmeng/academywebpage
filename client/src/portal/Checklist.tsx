import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import { useLocale } from '../content/locale'
import { site } from '../content/site'
import { InterviewPanel, RecommendationPanel, UploadPanel } from './ChecklistPanels'
import { formatDate, gradeLabel, useLoad } from './hooks'
import type { AppDetail } from './types'

type Text = { title: string; note: string }

const items: Record<'en' | 'zh', Record<string, Text>> = {
  en: {
    application_form: { title: 'Application form', note: 'All five steps completed and signed.' },
    application_fee: { title: 'Application fee', note: 'The Admission Office will confirm your application fee here once it has been received.' },
    birth_certificate: {
      title: 'Birth certificate',
      note: 'A copy of your child’s birth certificate. Non-U.S. citizens should include a copy of their green card or visa. Once the school has verified it, your child’s interviews can be scheduled.',
    },
    athletic_interview: { title: 'Athletic interview', note: 'A conversation with our coaching staff about your child’s sport, experience and goals.' },
    admissions_interview: { title: 'Admissions interview', note: 'A conversation with our admission office about your child’s academics, interests and fit.' },
    test_scores: {
      title: 'Admission test scores (ISEE or SSAT)',
      note: 'Register your child for the ISEE or SSAT directly with the testing organization. The school checks this off when the scores arrive, so there’s nothing to upload.',
    },
    rec_principal: { title: 'Recommendation: current principal or counselor', note: 'They’ll get a private link to upload it directly.' },
    rec_math: { title: 'Recommendation: current math teacher', note: 'They’ll get a private link to upload it directly.' },
    rec_english: {
      title: 'Recommendation: current English teacher',
      note: 'If the same teacher teaches both math and English, ask your child’s previous English teacher. They’ll get a private link to upload it directly.',
    },
    report_card: {
      title: 'Report card (previous year)',
      note: 'Upload a copy of your child’s most recent report card or transcript. The school will mark this complete once it has what it needs. An official copy sent by your child’s school may also be requested.',
    },
  },
  zh: {
    application_form: { title: '申请表', note: '五个步骤已全部完成并签署。' },
    application_fee: { title: '申请费', note: '学校收到申请费后，招生办公室会在此处确认。' },
    birth_certificate: {
      title: '出生证明',
      note: '孩子的出生证明副本。非美国公民请附上绿卡或签证副本。学校审核通过后，即可预约孩子的面试。',
    },
    athletic_interview: { title: '体育面试', note: '与教练团队交流孩子的运动项目、经历和目标。' },
    admissions_interview: { title: '招生面试', note: '与招生办公室交流孩子的学业、兴趣和适合度。' },
    test_scores: {
      title: '入学考试成绩（ISEE 或 SSAT）',
      note: '请直接向考试机构为孩子报名 ISEE 或 SSAT。成绩送达后学校会勾选此项，您无需上传任何文件。',
    },
    rec_principal: { title: '推荐信：现任校长或辅导员', note: '对方会收到一个私人链接，可直接上传。' },
    rec_math: { title: '推荐信：现任数学老师', note: '对方会收到一个私人链接，可直接上传。' },
    rec_english: {
      title: '推荐信：现任英语老师',
      note: '如果数学和英语由同一位老师任教，请联系孩子上一年的英语老师。对方会收到一个私人链接，可直接上传。',
    },
    report_card: {
      title: '成绩单（上一学年）',
      note: '请上传孩子最近一学年的成绩单或成绩记录副本。学校确认所需材料齐全后会标记为完成，也可能要求由孩子所在学校直接寄送正式副本。',
    },
  },
}

const copy = {
  en: {
    back: '← My Students',
    applying: (grade: string, year: string) => `Applying for ${grade} in ${year}`,
    loading: 'Loading…',
    loadError: 'We couldn’t load this checklist. Please go back and try again.',
    thanks: 'Your application has been submitted. Thank you!',
    title: 'Checklist',
    intro: 'Please complete the items below to finish the process. Items are checked off as we receive and process them.',
    questions: 'Questions? Contact the Admission Office at',
    status: { pending: 'To do', submitted: 'Received', verified: 'Complete', waived: 'Not needed' } as Record<string, string>,
    scheduled: 'Scheduled',
    requested: 'Requested',
    on: (d: string) => `Submitted on ${d}`,
  },
  zh: {
    back: '← 我的学生',
    applying: (grade: string, year: string) => `申请 ${year} 学年${grade}`,
    loading: '加载中……',
    loadError: '无法加载此清单，请返回后重试。',
    thanks: '您的申请已提交，谢谢！',
    title: '清单',
    intro: '请完成以下事项以完成申请流程。学校收到并处理后会逐项勾选。',
    questions: '如有疑问，请联系招生办公室：',
    status: { pending: '待完成', submitted: '已收到', verified: '已完成', waived: '无需提交' } as Record<string, string>,
    scheduled: '已预约',
    requested: '已邀请',
    on: (d: string) => `提交于 ${d}`,
  },
}

const ORDER = [
  'application_form', 'application_fee', 'birth_certificate', 'athletic_interview', 'admissions_interview',
  'test_scores', 'rec_principal', 'rec_math', 'rec_english', 'report_card',
]
const REC_OF: Record<string, string> = { rec_principal: 'principal_counselor', rec_math: 'math_teacher', rec_english: 'english_teacher' }
const INTERVIEW_OF: Record<string, 'athletic' | 'admissions'> = { athletic_interview: 'athletic', admissions_interview: 'admissions' }

const tone: Record<string, string> = {
  pending: 'border-ink/40 text-ink/70',
  submitted: 'border-ink bg-ink text-white',
  verified: 'border-ink bg-ink text-white',
  waived: 'border-sand bg-sand text-ink/70',
  info: 'border-brass text-brass',
}

export default function Checklist() {
  const { id = '' } = useParams()
  const locale = useLocale()
  const t = copy[locale]
  const justSubmitted = (useLocation().state as { submitted?: boolean } | null)?.submitted
  const { data, error, loading, reload } = useLoad<AppDetail>(`/applications/${id}`)

  if (loading && !data) return <p className="text-ink/70">{t.loading}</p>
  if (error || !data) {
    return (
      <div>
        <Link to="/portal" className="text-sm underline underline-offset-4 hover:text-brass">{t.back}</Link>
        <p className="mt-6 text-red-800">{t.loadError}</p>
      </div>
    )
  }
  const { application, checklist, documents, recommendations, interviews } = data
  if (application.status === 'draft') return <Navigate to={`/portal/applications/${id}`} replace />

  const refresh = () => reload?.()
  const statusOf = (kind: string) => checklist.find((c) => c.kind === kind)?.status ?? 'pending'
  const rows = [...checklist].sort((a, b) => ORDER.indexOf(a.kind) - ORDER.indexOf(b.kind))

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/portal" className="text-sm underline underline-offset-4 hover:text-brass">
        {t.back}
      </Link>
      <h1 className="mt-6 font-serif text-4xl">
        {application.firstName} {application.lastName}
      </h1>
      <p className="mt-1 text-ink/70">{t.applying(gradeLabel(application.grade, locale), application.schoolYear)}</p>

      {justSubmitted && (
        <p role="status" className="mt-6 border-l-4 border-ink bg-mist/60 px-5 py-4 font-semibold">
          {t.thanks}
        </p>
      )}

      <h2 className="mt-10 border-b border-ink pb-2 font-serif text-3xl">{t.title}</h2>
      <p className="mt-4 text-ink/70">{t.intro}</p>

      <ul className="mt-6">
        {rows.map((c) => {
          const text = items[locale][c.kind]
          if (!text) return null
          const interviewKind = INTERVIEW_OF[c.kind]
          const recKind = REC_OF[c.kind]
          const rec = recKind ? recommendations.find((r) => r.kind === recKind) : undefined

          // Interviews and recommendations have an in-between state that "To do" would misdescribe.
          let label = t.status[c.status] ?? c.status
          let style = tone[c.status] ?? tone.pending
          let check = c.status === 'submitted' || c.status === 'verified' || c.status === 'waived'
          if (interviewKind && c.status === 'submitted') {
            label = t.scheduled
            style = tone.info
            check = false
          } else if (recKind && c.status === 'pending' && rec) {
            label = t.requested
            style = tone.info
          }

          return (
            <li key={c.kind} className="border-b border-sand py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold">{text.title}</p>
                  <p className="mt-1 text-sm text-ink/70">
                    {c.kind === 'application_form' && application.submittedAt ? t.on(formatDate(application.submittedAt, locale)) : text.note}
                  </p>
                </div>
                <span className={`shrink-0 border px-3 py-1 text-xs font-semibold tracking-[0.1em] uppercase ${style}`}>
                  {check && '✓ '}
                  {label}
                </span>
              </div>

              {(c.kind === 'birth_certificate' || c.kind === 'report_card') && (
                <UploadPanel appId={id} kind={c.kind} docs={documents} status={c.status} onChange={refresh} />
              )}
              {recKind && <RecommendationPanel appId={id} kind={recKind} rec={rec} status={c.status} onChange={refresh} />}
              {interviewKind && (
                <InterviewPanel
                  appId={id}
                  kind={interviewKind}
                  interviews={interviews}
                  unlocked={statusOf('birth_certificate') === 'verified'}
                  onChange={refresh}
                />
              )}
            </li>
          )
        })}
      </ul>

      <p className="mt-8 text-sm text-ink/70">
        {t.questions}{' '}
        <a href={`mailto:${site.email}`} className="underline underline-offset-4 hover:text-brass">
          {site.email}
        </a>
        .
      </p>
    </div>
  )
}
