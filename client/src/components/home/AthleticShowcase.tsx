import { Link } from 'react-router-dom'
import { ArrowRight } from '../icons'
import { Eyebrow } from '../ui'
import Reveal from '../Reveal'
import { sportKinds, sports } from '../../content/sports'

// A photo-card row — each sport's own hero image standing in for the section's copy.
export default function AthleticShowcase() {
  return (
    <section className="bg-ivory px-6 py-20 sm:px-10 sm:py-28 lg:px-14">
      <Reveal as="div" className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-6">
        <div>
          <Eyebrow>Athletic</Eyebrow>
          <h2 className="mt-4 font-serif text-4xl leading-tight text-ink sm:text-5xl">
            Season-long, four sports
          </h2>
        </div>
        <Link
          to="/athletic"
          className="inline-flex items-center gap-3 font-condensed text-[17px] font-semibold tracking-[0.18em] text-brass uppercase transition-colors hover:text-ink"
        >
          Explore Athletics
          <ArrowRight className="h-5 w-5" />
        </Link>
      </Reveal>

      <ul className="mx-auto mt-10 grid max-w-7xl gap-1.5 sm:grid-cols-2 lg:grid-cols-4">
        {sportKinds.map((kind, i) => {
          const sport = sports.find((s) => s.kind === kind)!
          return (
            <Reveal as="li" key={kind} delay={i * 90}>
              <Link
                to={`/athletic/boys-${kind}`}
                className="group relative block aspect-[3/4] overflow-hidden"
              >
                <img
                  src={sport.hero.src}
                  alt={sport.hero.alt}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-ink/85 via-ink/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
                  <div>
                    <p className="font-serif text-2xl text-white">{sport.sport}</p>
                    <p className="mt-1 font-condensed text-[12px] font-semibold tracking-[0.16em] text-white/70 uppercase">
                      Boys · Girls
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0 text-white/70 transition-transform group-hover:translate-x-1 group-hover:text-gold" />
                </div>
              </Link>
            </Reveal>
          )
        })}
      </ul>
    </section>
  )
}
