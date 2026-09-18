import { Link } from 'react-router-dom'
import { ArrowRight } from '../icons'
import { Eyebrow } from '../ui'
import Reveal from '../Reveal'

const tags = ['Small classes', 'NCAA-aligned', 'Mastery-paced']

// A full-bleed photo/text split — the section's image is the point, not a paragraph.
export default function AcademicSplit() {
  return (
    <section className="grid lg:grid-cols-2">
      <Reveal as="div" className="relative aspect-[4/3] lg:aspect-auto">
        <img
          src="/images/academic-seminar.jpg"
          alt="A teacher and students working closely in a seminar-style classroom"
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
      </Reveal>

      <Reveal
        delay={120}
        className="flex flex-col justify-center bg-ink px-6 py-16 text-white sm:px-10 sm:py-20 lg:px-14"
      >
        <Eyebrow onDark>Academic</Eyebrow>
        <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
          A diploma built on inquiry
        </h2>
        <p className="mt-5 max-w-md text-lg text-white/80">
          College-preparatory academics, scheduled around training.
        </p>

        <ul className="mt-7 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li
              key={tag}
              className="border border-white/25 px-3 py-1.5 font-condensed text-[13px] font-semibold tracking-wide text-white/85 uppercase"
            >
              {tag}
            </li>
          ))}
        </ul>

        <Link
          to="/academic/ncaa-eligibility"
          className="mt-8 inline-flex w-fit items-center gap-3 font-condensed text-[17px] font-semibold tracking-[0.18em] text-gold uppercase transition-colors hover:text-white"
        >
          NCAA Eligibility
          <ArrowRight className="h-5 w-5" />
        </Link>
      </Reveal>
    </section>
  )
}
