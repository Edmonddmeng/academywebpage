import { Link } from 'react-router-dom'
import { ArrowRight } from '../icons'
import { Eyebrow, ImagePlaceholder } from '../ui'

const stages = [
  {
    title: 'Learn',
    text: 'A demanding New England–style curriculum built on discussion, writing, and critical thinking.',
    to: '/academics',
    image: 'Harkness classroom',
  },
  {
    title: 'Train',
    text: 'All-year development in golf, ice hockey, and lacrosse, backed by a professional performance staff.',
    to: '/athletics',
    image: 'Training session',
  },
  {
    title: 'Live',
    text: 'Residential life, athlete-focused dining, weekend adventures, and service that turn classmates into family.',
    to: '/student-life',
    image: 'Dorm life',
  },
  {
    title: 'Launch',
    text: 'Five professionals dedicated to each student’s path to college, recruitment, and beyond.',
    to: '/college-counseling',
    image: 'College visit',
  },
]

export default function Journey() {
  return (
    <section className="bg-ivory px-6 py-24 sm:px-10 sm:py-32 lg:px-14">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <Eyebrow>The Student Journey</Eyebrow>
          <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">
            Educating the complete scholar‑athlete
          </h2>
        </div>

        <ol className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {stages.map((stage, i) => (
            <li key={stage.title}>
              <Link to={stage.to} className="group block">
                <ImagePlaceholder label={stage.image} className="aspect-[4/5]" />
                <p className="mt-6 text-sm font-semibold text-brass">0{i + 1}</p>
                <h3 className="mt-1 font-serif text-3xl">{stage.title}</h3>
                <p className="mt-3 leading-relaxed text-ink/70">{stage.text}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold tracking-[0.18em] uppercase group-hover:text-brass">
                  Explore
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
