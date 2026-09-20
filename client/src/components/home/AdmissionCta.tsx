import { Link } from 'react-router-dom'
import { Eyebrow } from '../ui'
import Reveal from '../Reveal'
import { useLocale } from '../../content/locale'

const actionsCopy = {
  en: [
    { label: 'Apply to JMC', to: '/admission/overview' },
    { label: 'Inquire', to: '/contact' },
    { label: 'Visit', to: '/admission/visit' },
    { label: 'Tuition & Fees', to: '/admission/tuition-and-fees' },
  ],
  zh: [
    { label: '申请 JMC', to: '/admission/overview' },
    { label: '咨询', to: '/contact' },
    { label: '预约参观', to: '/admission/visit' },
    { label: '学费与费用', to: '/admission/tuition-and-fees' },
  ],
}

const copy = {
  en: {
    eyebrow: 'Admission',
    heading: 'Rolling admission for ice hockey, golf, tennis, fencing, and lacrosse athletes',
    intro:
      'We welcome athletes from across the country and around the world throughout the year, at both the Irvine and San Diego campuses.',
  },
  zh: {
    eyebrow: '招生',
    heading: '面向冰球、高尔夫、网球、击剑与长曲棍球运动员的滚动招生',
    intro: '我们全年欢迎来自全国及世界各地的运动员申请尔湾与圣地亚哥两个校区。',
  },
}

export default function AdmissionCta() {
  const locale = useLocale()
  const t = copy[locale]
  const actions = actionsCopy[locale]
  return (
    <section className="relative overflow-hidden bg-ink px-6 py-24 text-white sm:px-10 sm:py-28 lg:px-14">
      <img
        src="/images/lacrosse-field.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-20"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-linear-to-b from-ink/70 to-ink/90" />
      <Reveal as="div" className="relative mx-auto max-w-5xl text-center">
        <Eyebrow onDark className="mx-auto">
          {t.eyebrow}
        </Eyebrow>
        <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-6xl">
          {t.heading}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
          {t.intro}
        </p>
        <ul className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-1.5 sm:grid-cols-4">
          {actions.map((action, i) => (
            <li key={action.to}>
              <Link
                to={action.to}
                className={`block px-4 py-5 font-condensed text-[16px] font-semibold tracking-[0.16em] uppercase transition-all duration-300 hover:-translate-y-0.5 ${
                  i === 0
                    ? 'bg-gold text-ink hover:bg-white'
                    : 'border border-white/35 text-white hover:bg-white hover:text-ink'
                }`}
              >
                {action.label}
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  )
}
