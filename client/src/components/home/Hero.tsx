import { ButtonLink } from '../ui'
import { site } from '../../content/site'

export default function Hero() {
  return (
    <section className="relative flex h-svh min-h-[640px] items-center overflow-hidden bg-ink text-white">
      <img
        src="/images/hero.avif"
        alt="Rowers on the water at sunset beneath a palm-lined shore and mountains"
        className="absolute inset-0 h-full w-full object-cover"
        fetchPriority="high"
      />
      {/* Scrims keep the white header and headline legible over the bright sky and water. */}
      <div className="absolute inset-0 bg-linear-to-b from-black/45 via-black/10 to-black/45" />
      <div className="absolute inset-0 bg-linear-to-r from-black/45 via-black/15 to-transparent" />

      <div className="relative mx-auto w-full max-w-[1600px] px-6 pt-24 sm:px-10 lg:px-[10%]">
        <h1 className="max-w-4xl font-serif text-[2.6rem] leading-[1.02] font-normal tracking-[-0.01em] sm:text-7xl lg:text-8xl">
          Scholars first.
          <br />
          Athletes every day.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-balance text-white/85 sm:text-xl">{site.tagline}</p>
        <div className="mt-10">
          <ButtonLink to="/about/why-our-school" variant="outline-light">
            Why {site.name}
          </ButtonLink>
        </div>
      </div>

      <a
        href="#at-a-glance"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-[11px] tracking-[0.3em] text-white/75 uppercase transition-colors hover:text-white sm:flex"
      >
        Explore
        <span className="h-10 w-px bg-white/60" />
      </a>
    </section>
  )
}
