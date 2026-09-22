import { Link } from 'react-router-dom'
import { ArrowRight } from '../icons'
import { Eyebrow } from '../ui'
import Reveal from '../Reveal'
import { useLocale } from '../../content/locale'

// Categories, not invented dates — JMC has no events or stories posted yet, so this
// shows the shape the section will hold rather than fabricating specific instances.
// Each links to the page that actually covers it.
const eventKindsCopy = {
  en: [
    {
      label: 'Tryouts',
      month: 'SEP',
      text: 'Athletic evaluation as part of admission.',
      to: '/admission/overview',
    },
    {
      label: 'Showcases & Combines',
      month: 'OCT',
      text: 'Where our athletes get seen by college coaches.',
      to: '/counseling/college-recruiting',
    },
    {
      label: 'Family Weekend',
      month: 'DEC',
      text: 'Campus life beyond training and school.',
      to: '/student-life/activities-and-service',
    },
    {
      label: 'Signing Day',
      month: 'JAN',
      text: 'Where commitments will be announced.',
      to: '/counseling/commitments',
    },
  ],
  zh: [
    {
      label: '选拔测试',
      month: '9月',
      text: '作为招生流程一部分的体育评估。',
      to: '/admission/overview',
    },
    {
      label: '公开赛与集训',
      month: '10月',
      text: '让我们的运动员获得大学教练关注的机会。',
      to: '/counseling/college-recruiting',
    },
    {
      label: '家庭周末',
      month: '12月',
      text: '训练与学业之外的校园生活。',
      to: '/student-life/activities-and-service',
    },
    {
      label: '签约日',
      month: '1月',
      text: '公布运动员录取承诺的日子。',
      to: '/counseling/commitments',
    },
  ],
}

const copy = {
  en: {
    upcoming: 'Upcoming Events',
    exactDates: 'Exact dates post here as the academy year is finalized.',
    calendar: 'Academy Calendar',
    latestNews: 'Latest News',
    comingSoon: 'Coming soon',
    heading: 'Season results, signings, and stories from both campuses',
  },
  zh: {
    upcoming: '近期活动',
    exactDates: '学年日程确定后，具体日期将在此发布。',
    calendar: '学院日历',
    latestNews: '最新动态',
    comingSoon: '即将上线',
    heading: '来自两个校区的赛季战绩、签约消息与故事',
  },
}

export default function NewsEvents() {
  const locale = useLocale()
  const t = copy[locale]
  const eventKinds = eventKindsCopy[locale]
  return (
    <section className="bg-ivory px-6 py-20 sm:px-10 sm:py-28 lg:px-14">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_2fr] lg:gap-16">
        <Reveal as="div">
          <Eyebrow>{t.upcoming}</Eyebrow>
          <ol className="mt-6 border-t border-ink/15">
            {eventKinds.map((event) => (
              <li key={event.label} className="border-b border-ink/15">
                <Link to={event.to} className="group flex items-center gap-4 py-4">
                  <span className="flex h-12 w-12 shrink-0 flex-col items-center justify-center border border-ink/25 text-center leading-none transition-colors group-hover:border-brass">
                    <span className="font-condensed text-[10px] font-semibold tracking-wide text-brass uppercase">
                      {event.month}
                    </span>
                  </span>
                  <span className="flex-1">
                    <span className="block font-serif text-lg text-ink">{event.label}</span>
                    <span className="block text-sm text-ink/60">{event.text}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-ink/30 transition-transform group-hover:translate-x-1 group-hover:text-brass" />
                </Link>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-ink/60">{t.exactDates}</p>
          <Link
            to="/parent-support/academy-calendar"
            className="mt-4 inline-flex items-center gap-3 font-condensed text-[15px] font-semibold tracking-[0.18em] text-brass uppercase transition-colors hover:text-ink"
          >
            {t.calendar}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>

        <Reveal as="div" delay={120}>
          <Eyebrow>{t.latestNews}</Eyebrow>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <img
              src="/images/lacrosse-action.jpg"
              alt="A lacrosse player carrying the ball upfield"
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
            />
            <div className="flex flex-col justify-center">
              <p className="font-condensed text-[13px] font-semibold tracking-[0.18em] text-ink/50 uppercase">
                {t.comingSoon}
              </p>
              <h3 className="mt-3 font-serif text-3xl leading-tight text-ink">
                {t.heading}
              </h3>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
