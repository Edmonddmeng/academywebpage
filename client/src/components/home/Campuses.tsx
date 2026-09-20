import { Link } from 'react-router-dom'
import { ArrowRight } from '../icons'
import { Eyebrow } from '../ui'
import Reveal from '../Reveal'
import { useSite } from '../../content/site'
import { useLocale } from '../../content/locale'

const copy = {
  en: {
    eyebrow: 'Our Campuses',
    heading: 'Two campuses. One standard.',
    intro:
      'JMC trains in Irvine and San Diego, each paired with a day-school academic partner. Both campuses share the same daily structure and the same performance standards — which campus an athlete joins depends mainly on their sport.',
    academicPartner: 'Academic partner',
    sports: 'Sports',
    explore: 'Explore both campuses',
  },
  zh: {
    eyebrow: '我们的校区',
    heading: '两个校区,同一个标准。',
    intro:
      'JMC在尔湾与圣地亚哥两地训练,每个校区都有各自的走读学校学术合作伙伴。两个校区遵循相同的每日结构与相同的体能标准——运动员加入哪个校区主要取决于其所参与的项目。',
    academicPartner: '学术合作学校',
    sports: '体育项目',
    explore: '了解两个校区',
  },
}

export default function Campuses() {
  const site = useSite()
  const t = copy[useLocale()]
  return (
    <section className="bg-ink px-6 py-20 text-white sm:px-10 sm:py-28 lg:px-14">
      <div className="mx-auto max-w-7xl">
        <Reveal as="div" className="max-w-3xl">
          <Eyebrow onDark>{t.eyebrow}</Eyebrow>
          <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">
            {t.heading}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-white/80">
            {t.intro}
          </p>
        </Reveal>

        <ul className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-8">
          {site.campuses.map((campus, i) => (
            <Reveal
              as="li"
              key={campus.name}
              delay={i * 120}
              className="group border border-white/20 bg-white/5 transition-colors duration-300 hover:border-gold/50"
            >
              <div className="overflow-hidden">
                <img
                  src={campus.image}
                  alt={campus.imageAlt}
                  loading="lazy"
                  className="aspect-[16/9] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>

              <div className="p-7 sm:p-9">
                <Eyebrow onDark>{campus.region}</Eyebrow>
                <h3 className="mt-3 font-serif text-3xl sm:text-4xl">{campus.name}</h3>
                <p className="mt-2 text-white/70">{campus.city}</p>

                <dl className="mt-7 border-t border-white/20">
                  <div className="flex flex-wrap gap-x-6 gap-y-1 border-b border-white/20 py-4">
                    <dt className="w-36 font-condensed text-[14px] font-semibold tracking-[0.18em] text-gold uppercase">
                      {t.academicPartner}
                    </dt>
                    <dd className="flex-1 text-white/85">{campus.partner}</dd>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 border-b border-white/20 py-4">
                    <dt className="w-36 font-condensed text-[14px] font-semibold tracking-[0.18em] text-gold uppercase">
                      {t.sports}
                    </dt>
                    <dd className="flex-1 text-white/85">{campus.focus}</dd>
                  </div>
                </dl>

                <ul className="mt-6 space-y-2">
                  {campus.points.map((point) => (
                    <li key={point} className="flex gap-3 text-white/75">
                      <span aria-hidden="true" className="text-gold">
                        —
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>

                <div className="mt-7 overflow-hidden">
                  <img
                    src={campus.partnerImage}
                    alt={campus.partner}
                    loading="lazy"
                    className="aspect-[3/2] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
                <p className="mt-3 font-condensed text-[13px] font-semibold tracking-[0.18em] text-white/50 uppercase">
                  {campus.partner}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>

        <Link
          to="/about/campuses"
          className="mt-12 inline-flex items-center gap-3 font-condensed text-[17px] font-semibold tracking-[0.18em] text-gold uppercase transition-colors hover:text-white"
        >
          {t.explore}
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>
  )
}
