import { Link } from 'react-router-dom'
import { ArrowRight } from '../icons'
import { Eyebrow, ImagePlaceholder } from '../ui'
import Reveal from '../Reveal'

const slots: { label: string; kind: 'image' | 'video'; to: string }[] = [
  { label: 'Residence Life', kind: 'image', to: '/student-life/residence-life' },
  { label: 'Campus Life — Video', kind: 'video', to: '/student-life/activities-and-service' },
  { label: 'Dining & Nutrition', kind: 'image', to: '/student-life/dining-and-nutrition' },
]

// A three-slot photo/video gallery — real footage drops straight into these frames later.
export default function StudentLifeGallery() {
  return (
    <section className="bg-white px-6 py-20 sm:px-10 sm:py-28 lg:px-14">
      <Reveal as="div" className="mx-auto max-w-7xl text-center">
        <Eyebrow className="justify-center">Student Life</Eyebrow>
        <h2 className="mt-4 font-serif text-4xl leading-tight text-ink sm:text-5xl">
          Life outside of training
        </h2>
      </Reveal>

      <ul className="mx-auto mt-10 grid max-w-7xl gap-1.5 sm:grid-cols-3">
        {slots.map((slot, i) => (
          <Reveal as="li" key={slot.label} delay={i * 100}>
            <Link to={slot.to} className="group block">
              <ImagePlaceholder
                label={slot.label}
                kind={slot.kind}
                className="aspect-[3/4] transition-opacity group-hover:opacity-80"
              />
            </Link>
          </Reveal>
        ))}
      </ul>

      <div className="mt-10 text-center">
        <Link
          to="/student-life"
          className="inline-flex items-center gap-3 font-condensed text-[17px] font-semibold tracking-[0.18em] text-brass uppercase transition-colors hover:text-ink"
        >
          Explore Student Life
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>
  )
}
