import { useEffect, useRef } from 'react'
import { ButtonLink } from '../ui'
import CountUp from '../CountUp'
import { useSite } from '../../content/site'
import { useLocale } from '../../content/locale'

// Structural facts only — true by design, not projected outcomes.
const statsCopy = {
  en: [
    { value: '4', label: 'Sports' },
    { value: '8', label: 'Programs' },
    { value: '2', label: 'Campuses' },
    { value: '6-12', label: 'Grades served' },
    { value: '5:1', label: 'Staff per athlete' },
  ],
  zh: [
    { value: '4', label: '项体育项目' },
    { value: '8', label: '个整季项目' },
    { value: '2', label: '个校区' },
    { value: '6-12', label: '招生年级' },
    { value: '5:1', label: '师生配比' },
  ],
}

const copy = {
  en: {
    sports: 'Ice Hockey · Golf · Tennis · Lacrosse',
    h1: (
      <>
        Student-athletes,
        <br />
        trained like professionals.
      </>
    ),
    explore: 'Explore',
    apply: 'Apply to JMC',
    why: 'Why JMC',
  },
  zh: {
    sports: '冰球 · 高尔夫 · 网球 · 长曲棍球',
    h1: (
      <>
        学生运动员,
        <br />
        以职业标准训练。
      </>
    ),
    explore: '了解更多',
    apply: '申请 JMC',
    why: '为什么选择 JMC',
  },
}

export default function Hero() {
  const imgRef = useRef<HTMLImageElement>(null)
  const site = useSite()
  const locale = useLocale()
  const t = copy[locale]
  const stats = statsCopy[locale]

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        // Capped so the image never scrolls far enough to expose its scaled-up edge.
        const offset = Math.min(window.scrollY * 0.25, 80)
        if (imgRef.current) {
          imgRef.current.style.transform = `translateY(${offset}px) scale(1.08)`
        }
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden bg-ink text-white">
      <img
        ref={imgRef}
        src="/images/hero.avif"
        alt=""
        aria-hidden="true"
        style={{ transform: 'translateY(0px) scale(1.08)' }}
        className="absolute inset-0 h-full w-full object-cover will-change-transform"
        fetchPriority="high"
      />
      {/* Neutral (not brand-green) scrims keep the white header and headline legible
          without tinting the photo's true colors. */}
      <div className="absolute inset-0 bg-linear-to-b from-black/65 via-black/15 to-black/80" />
      <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/25 to-transparent" />

      {/* Thin inset frame around the photo, echoing a traditional campus-portrait treatment. */}
      <div className="pointer-events-none absolute inset-6 border border-white/25 sm:inset-10 lg:inset-14" />
      <a
        href="#at-a-glance"
        className="absolute right-10 bottom-10 z-10 hidden items-center gap-3 font-condensed text-[13px] font-semibold tracking-[0.3em] text-white/80 uppercase transition-colors hover:text-gold sm:flex lg:right-14"
      >
        {t.explore}
        <span aria-hidden="true">↓</span>
      </a>

      <div className="relative flex flex-1 items-center px-6 pt-32 pb-16 sm:px-10 lg:px-14">
        <div className="mx-auto w-full max-w-7xl">
          <p className="font-condensed text-[15px] font-semibold tracking-[0.24em] text-gold uppercase">
            {t.sports}
          </p>
          <h1 className="mt-6 max-w-4xl font-serif text-[2.7rem] leading-[1.03] font-normal sm:text-7xl lg:text-8xl">
            {t.h1}
          </h1>
          <p className="mt-7 max-w-2xl text-lg text-balance text-white/85 sm:text-xl">
            {site.tagline}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <ButtonLink to="/admission/overview" variant="gold">
              {t.apply}
            </ButtonLink>
            <ButtonLink to="/about/academy-overview" variant="outline-light">
              {t.why}
            </ButtonLink>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/20 bg-ink/45 backdrop-blur-sm">
        <dl className="mx-auto grid max-w-7xl grid-cols-2 divide-white/15 px-6 sm:grid-cols-3 sm:px-10 lg:grid-cols-5 lg:divide-x lg:px-14">
          {stats.map((stat) => (
            <div key={stat.label} className="px-2 py-6 text-center lg:py-8">
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="block font-serif text-4xl leading-none text-gold lg:text-5xl">
                  <CountUp value={stat.value} />
                </span>
                <span className="mt-2 block font-condensed text-[14px] font-semibold tracking-[0.18em] text-white/80 uppercase">
                  {stat.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
