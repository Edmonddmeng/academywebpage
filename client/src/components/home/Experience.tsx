import type { ComponentType } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from '../icons'
import { Eyebrow } from '../ui'
import Reveal from '../Reveal'
import {
  BedSymbol,
  BookSymbol,
  CapSymbol,
  CompassSymbol,
  PlateSymbol,
  ResidenceSymbol,
  StopwatchSymbol,
} from '../symbols'

const items: {
  title: string
  text: string
  to: string
  Glyph: ComponentType<{ className?: string }>
}[] = [
  {
    title: 'Residence Life',
    text: 'Two athletes per room, residential staff on every floor, supervised evening study, and protected lights-out.',
    to: '/student-life/residence-life',
    Glyph: BedSymbol,
  },
  {
    title: 'A High Standard of Living',
    text: 'Clean, well-kept residences with common areas, laundry including training-gear turnaround, and the essentials handled.',
    to: '/student-life/residence-life',
    Glyph: ResidenceSymbol,
  },
  {
    title: 'Nutrition',
    text: 'An athlete nutrition programme: meals timed to the training day, plus pre-training, post-training, and evening fuelling.',
    to: '/student-life/dining-and-nutrition',
    Glyph: PlateSymbol,
  },
  {
    title: 'Strength & Conditioning',
    text: 'Individual plans built from an Athlete Performance Profile, coached daily and re-tested through the year.',
    to: '/athletic/strength-and-conditioning',
    Glyph: StopwatchSymbol,
  },
  {
    title: 'Recovery & Medical Coordination',
    text: 'Sports medicine, treatment, and staged return-to-play, coordinated with coaches and reported to families.',
    to: '/student-life/recovery-and-medical',
    Glyph: BookSymbol,
  },
  {
    title: 'Competition Travel',
    text: 'Staff travel with athletes, coursework travels with them, and families get the itinerary before wheels up.',
    to: '/student-life/competition-travel',
    Glyph: CompassSymbol,
  },
  {
    title: 'College Exposure',
    text: 'Campus visits, coach meetings, and showcase events scheduled alongside the competition calendar.',
    to: '/counseling/college-recruiting',
    Glyph: CapSymbol,
  },
]

export default function Experience() {
  return (
    <section className="bg-ivory px-6 py-20 sm:px-10 sm:py-28 lg:px-14">
      <div className="mx-auto max-w-7xl">
        <Reveal as="div" className="max-w-3xl">
          <Eyebrow>The JMC Experience</Eyebrow>
          <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">
            Everything around the training
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-ink/75">
            What separates a serious academy from a club programme is everything that happens
            between sessions. At JMC each of these has a staff member accountable for it.
          </p>
        </Reveal>

        <ul className="mt-14 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ title, text, to, Glyph }, i) => (
            <Reveal as="li" key={title} delay={(i % 3) * 80}>
              <Link
                to={to}
                className="group flex h-full flex-col border border-ink/20 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brass hover:shadow-[0_14px_28px_-16px_rgba(18,61,40,0.3)]"
              >
                <div className="flex items-start justify-between">
                  <Glyph className="h-11 w-11 text-brass" />
                  <ArrowRight className="h-5 w-5 text-ink/30 transition-transform group-hover:translate-x-1 group-hover:text-brass" />
                </div>
                <h3 className="mt-8 font-serif text-2xl leading-tight">{title}</h3>
                <p className="mt-3 leading-relaxed text-ink/70">{text}</p>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
