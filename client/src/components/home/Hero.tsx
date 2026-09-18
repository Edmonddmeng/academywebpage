import { useEffect, useRef } from 'react'
import { ButtonLink } from '../ui'
import CountUp from '../CountUp'
import { site } from '../../content/site'

// Structural facts only — true by design, not projected outcomes.
const stats = [
  { value: '4', label: 'Sports' },
  { value: '8', label: 'Programs' },
  { value: '2', label: 'Campuses' },
  { value: '12', label: 'Months training' },
  { value: '5:1', label: 'Staff per athlete' },
]

export default function Hero() {
  const imgRef = useRef<HTMLImageElement>(null)

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

      <div className="relative flex flex-1 items-center px-6 pt-32 pb-16 sm:px-10 lg:px-14">
        <div className="mx-auto w-full max-w-7xl">
          <p className="font-condensed text-[15px] font-semibold tracking-[0.24em] text-gold uppercase">
            Ice Hockey · Golf · Tennis · Lacrosse
          </p>
          <h1 className="mt-6 max-w-4xl font-serif text-[2.7rem] leading-[1.03] font-normal sm:text-7xl lg:text-8xl">
            Student-athletes,
            <br />
            trained like professionals.
          </h1>
          <p className="mt-7 max-w-2xl text-lg text-balance text-white/85 sm:text-xl">
            {site.tagline}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <ButtonLink to="/admission/overview" variant="gold">
              Apply to JMC
            </ButtonLink>
            <ButtonLink to="/about/academy-overview" variant="outline-light">
              Why JMC
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
