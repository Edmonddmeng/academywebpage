import { Link } from 'react-router-dom'
import { ArrowRight } from '../icons'
import { ButtonLink, Eyebrow, ImagePlaceholder } from '../ui'

const programs = [
  { sport: 'Golf', team: 'Boys', slug: 'boys-golf' },
  { sport: 'Golf', team: 'Girls', slug: 'girls-golf' },
  { sport: 'Ice Hockey', team: 'Boys', slug: 'boys-ice-hockey' },
  { sport: 'Ice Hockey', team: 'Girls', slug: 'girls-ice-hockey' },
  { sport: 'Lacrosse', team: 'Boys', slug: 'boys-lacrosse' },
  { sport: 'Lacrosse', team: 'Girls', slug: 'girls-lacrosse' },
]

const performance = [
  'Strength Training',
  'Conditioning',
  'Sports Performance',
  'Mobility & Recovery',
  'Injury Prevention',
  'Nutrition Support',
  'Performance Testing',
  'Individualized Training Plans',
]

export default function AthleticsSection() {
  return (
    <section className="bg-ink px-6 py-24 text-white sm:px-10 sm:py-32 lg:px-14">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
          <div>
            <Eyebrow>Athletics</Eyebrow>
            <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-6xl">
              Year-round development. Not a season.
            </h2>
          </div>
          <p className="text-lg leading-relaxed text-white/75">
            Our core programs train all year, not just for a fall, winter, or spring season. Every
            team is led by a head coach and a full coaching staff, with a clear path from daily
            training to tournaments and college recruitment.
          </p>
        </div>

        <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <li key={program.slug}>
              <Link to={`/athletics/${program.slug}`} className="group relative block">
                <ImagePlaceholder
                  tone="dark"
                  label={`${program.team} ${program.sport}`}
                  className="aspect-[4/3] transition-opacity group-hover:opacity-80"
                />
                <div className="absolute inset-x-0 top-0 flex items-start justify-between p-6">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.28em] text-brass uppercase">
                      {program.team}
                    </p>
                    <h3 className="mt-1 font-serif text-3xl">{program.sport}</h3>
                  </div>
                  <ArrowRight className="h-6 w-6 text-white/60 transition-transform group-hover:translate-x-1 group-hover:text-white" />
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-20 grid gap-12 border-t border-white/15 pt-16 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <div>
            <Eyebrow>Strength & Conditioning</Eyebrow>
            <h3 className="mt-5 font-serif text-3xl leading-tight sm:text-4xl">
              A professional performance team behind every athlete
            </h3>
            <p className="mt-6 leading-relaxed text-white/75">
              Every student has an Athlete Performance Profile, a training plan built around their
              age, physical development, sport, position, and goals, and guided by specialists,
              not a traditional PE program.
            </p>
            <div className="mt-8">
              <ButtonLink to="/athletics/strength-and-conditioning" variant="outline-light">
                Meet the Performance Team
              </ButtonLink>
            </div>
          </div>

          <ol className="grid content-start gap-x-10 sm:grid-cols-2">
            {performance.map((item, i) => (
              <li key={item} className="flex items-baseline gap-4 border-b border-white/10 py-4">
                <span className="text-sm font-semibold text-brass">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-lg">{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
