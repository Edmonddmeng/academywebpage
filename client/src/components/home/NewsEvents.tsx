import { Link } from 'react-router-dom'
import { ArrowRight } from '../icons'
import { Eyebrow, ImagePlaceholder } from '../ui'
import Reveal from '../Reveal'

// Categories, not invented dates — JMC has no events or stories posted yet, so this
// shows the shape the section will hold rather than fabricating specific instances.
const eventKinds = ['Tryouts', 'Showcases & Combines', 'Family Weekend', 'Signing Day']

export default function NewsEvents() {
  return (
    <section className="bg-ivory px-6 py-20 sm:px-10 sm:py-28 lg:px-14">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_2fr] lg:gap-16">
        <Reveal as="div">
          <Eyebrow>Upcoming Events</Eyebrow>
          <ol className="mt-6 border-t border-ink/15">
            {eventKinds.map((kind) => (
              <li key={kind} className="flex items-center gap-4 border-b border-ink/15 py-4">
                <span className="flex h-12 w-12 shrink-0 flex-col items-center justify-center border border-ink/25 text-center leading-none">
                  <span className="font-condensed text-[10px] font-semibold tracking-wide text-brass uppercase">
                    TBD
                  </span>
                </span>
                <span className="font-serif text-lg text-ink">{kind}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-ink/60">Dates post here as the academy year is finalized.</p>
          <Link
            to="/parent-support/academy-calendar"
            className="mt-4 inline-flex items-center gap-3 font-condensed text-[15px] font-semibold tracking-[0.18em] text-brass uppercase transition-colors hover:text-ink"
          >
            Academy Calendar
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>

        <Reveal as="div" delay={120}>
          <Eyebrow>Latest News</Eyebrow>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <ImagePlaceholder label="First story from campus" className="aspect-[4/3]" />
            <div className="flex flex-col justify-center">
              <p className="font-condensed text-[13px] font-semibold tracking-[0.18em] text-ink/50 uppercase">
                Coming soon
              </p>
              <h3 className="mt-3 font-serif text-3xl leading-tight text-ink">
                Season results, signings, and stories from both campuses
              </h3>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
