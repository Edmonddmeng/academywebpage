import { Link } from 'react-router-dom'
import { ArrowRight } from '../icons'
import { Eyebrow, ImagePlaceholder } from '../ui'

const features = [
  {
    title: 'Dorm Life',
    text: 'Double rooms, dedicated dorm parents, evening study hours, and weekends that turn classmates into family.',
    to: '/student-life/boarding-life',
  },
  {
    title: 'Dining & Nutrition',
    text: 'An athlete nutrition program with balanced daily menus, pre- and post-training snacks, and recovery meals.',
    to: '/student-life/dining',
  },
  {
    title: 'Activities & Service',
    text: 'Weekend adventures, field trips, community service, competitions, and college visits from the earliest grades.',
    to: '/student-life/weekend-activities',
  },
]

export default function LifeSection() {
  return (
    <section className="bg-white px-6 py-24 sm:px-10 sm:py-32 lg:px-14">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>Student Life</Eyebrow>
          <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">
            Life beyond the classroom
          </h2>
        </div>

        <ul className="mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
          {features.map((feature) => (
            <li key={feature.title}>
              <Link to={feature.to} className="group block">
                <ImagePlaceholder label={feature.title} className="aspect-[4/3]" />
                <h3 className="mt-6 flex items-center justify-between font-serif text-3xl">
                  {feature.title}
                  <ArrowRight className="h-6 w-6 text-brass transition-transform group-hover:translate-x-1" />
                </h3>
                <p className="mt-3 leading-relaxed text-ink/70">{feature.text}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
