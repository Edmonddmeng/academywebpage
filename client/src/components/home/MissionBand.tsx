import Reveal from '../Reveal'
import { useLocale } from '../../content/locale'

const copy = { en: 'Scholar. Athlete. One standard.', zh: '学者。运动员。同一标准。' }

// A short, quiet beat between the stat band and the photo-heavy sections below —
// deliberately the one section on the page with no image, no grid, almost no copy.
export default function MissionBand() {
  return (
    <section className="bg-white px-6 py-20 sm:py-28">
      <Reveal as="div" className="mx-auto max-w-3xl text-center">
        <h2 className="font-serif text-4xl leading-tight text-ink sm:text-5xl">
          {copy[useLocale()]}
        </h2>
        <span aria-hidden="true" className="mx-auto mt-8 block h-px w-16 bg-brass" />
      </Reveal>
    </section>
  )
}
