import { Link } from 'react-router-dom'
import { ArrowRight } from '../icons'
import { Eyebrow, ImagePlaceholder } from '../ui'
import Reveal from '../Reveal'

const slots = [
  {
    label: 'Residence Life',
    kind: 'video' as const,
    src: '/videos/residence-life.mp4',
    to: '/student-life/residence-life',
  },
  {
    label: 'Campus Life',
    kind: 'video' as const,
    src: '/videos/academic-life.mp4',
    to: '/student-life/activities-and-service',
  },
  {
    label: 'Dining & Nutrition',
    kind: 'video' as const,
    src: '/videos/dining.mp4',
    to: '/student-life/dining-and-nutrition',
  },
]

// A three-slot photo/video gallery — two slots play real campus footage, cropped
// to the vertical frame with object-cover rather than re-encoded.
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
              {slot.kind === 'video' ? (
                <div className="relative aspect-[3/4] overflow-hidden">
                  <video
                    src={slot.src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="h-full w-full object-cover transition-opacity group-hover:opacity-80"
                  />
                  <span className="absolute bottom-3 left-4 font-condensed text-[11px] font-semibold tracking-[0.2em] text-white uppercase [text-shadow:0_1px_3px_rgb(0_0_0/0.6)]">
                    {slot.label}
                  </span>
                </div>
              ) : (
                <ImagePlaceholder
                  label={slot.label}
                  className="aspect-[3/4] transition-opacity group-hover:opacity-80"
                />
              )}
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
