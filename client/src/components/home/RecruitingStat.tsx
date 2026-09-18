import { Link } from 'react-router-dom'
import { ArrowRight } from '../icons'
import { Eyebrow } from '../ui'
import Reveal from '../Reveal'

// A pure typographic band — no photo, no grid — so it reads as a deliberately
// different beat from the image-led sections on either side of it.
export default function RecruitingStat() {
  return (
    <section className="bg-ink px-6 py-24 text-center text-white sm:py-32">
      <Reveal as="div" className="mx-auto max-w-2xl">
        <Eyebrow onDark className="justify-center">
          Recruiting
        </Eyebrow>
        <p className="mt-6 font-serif text-[7rem] leading-none text-gold sm:text-[10rem]">5:1</p>
        <h2 className="mt-4 font-serif text-3xl leading-tight sm:text-4xl">
          Five professionals. One athlete.
        </h2>
        <Link
          to="/counseling/5-to-1-model"
          className="mt-8 inline-flex items-center gap-3 font-condensed text-[17px] font-semibold tracking-[0.18em] text-gold uppercase transition-colors hover:text-white"
        >
          The 5-to-1 Model
          <ArrowRight className="h-5 w-5" />
        </Link>
      </Reveal>
    </section>
  )
}
