import { Link } from 'react-router-dom'
import { ArrowRight } from '../icons'
import { Eyebrow, ImagePlaceholder } from '../ui'
import { site } from '../../content/site'

export default function Campuses() {
  return (
    <section className="bg-ink px-6 py-20 text-white sm:px-10 sm:py-28 lg:px-14">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <Eyebrow onDark>Our Campuses</Eyebrow>
          <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">
            Two campuses. One standard.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-white/80">
            JMC trains in Irvine and San Diego, each paired with an accredited academic partner
            school. Both campuses run the same daily structure and the same performance standards —
            which campus an athlete joins depends mainly on their sport.
          </p>
        </div>

        <ul className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-8">
          {site.campuses.map((campus) => (
            <li key={campus.name} className="border border-white/20 bg-white/5">
              <img
                src={campus.image}
                alt={campus.imageAlt}
                loading="lazy"
                className="aspect-[16/9] w-full object-cover"
              />

              <div className="p-7 sm:p-9">
                <Eyebrow onDark>{campus.region}</Eyebrow>
                <h3 className="mt-3 font-serif text-3xl sm:text-4xl">{campus.name}</h3>
                <p className="mt-2 text-white/70">{campus.city}</p>

                <dl className="mt-7 border-t border-white/20">
                  <div className="flex flex-wrap gap-x-6 gap-y-1 border-b border-white/20 py-4">
                    <dt className="w-36 font-condensed text-[14px] font-semibold tracking-[0.18em] text-gold uppercase">
                      Partner school
                    </dt>
                    <dd className="flex-1 text-white/85">{campus.partner}</dd>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 border-b border-white/20 py-4">
                    <dt className="w-36 font-condensed text-[14px] font-semibold tracking-[0.18em] text-gold uppercase">
                      Sports
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

                <ImagePlaceholder
                  tone="dark"
                  label={`${campus.partner} campus`}
                  className="mt-7 aspect-[3/2]"
                />
              </div>
            </li>
          ))}
        </ul>

        <Link
          to="/about/campuses"
          className="mt-12 inline-flex items-center gap-3 font-condensed text-[17px] font-semibold tracking-[0.18em] text-gold uppercase transition-colors hover:text-white"
        >
          Explore both campuses
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>
  )
}
