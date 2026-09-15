import { Link } from 'react-router-dom'
import { Eyebrow } from '../ui'

const actions = [
  { label: 'Inquire', to: '/contact' },
  { label: 'Visit', to: '/admission/visit' },
  { label: 'Apply', to: '/admission/apply' },
  { label: 'Tuition & Fees', to: '/admission/tuition-and-fees' },
]

export default function AdmissionCta() {
  return (
    <section className="relative overflow-hidden bg-ink px-6 py-24 text-white sm:px-10 sm:py-28 lg:px-14">
      <img
        src="/images/hero.avif"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-20"
        loading="lazy"
      />
      <div className="relative mx-auto max-w-5xl text-center">
        <Eyebrow>Admission</Eyebrow>
        <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-6xl">
          Rolling admission for boarding and day students
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
          We welcome applications from domestic and international students throughout the year,
          including a dedicated pathway for student-athletes.
        </p>
        <ul className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-px bg-white/25 sm:grid-cols-4">
          {actions.map((action) => (
            <li key={action.to}>
              <Link
                to={action.to}
                className="block bg-ink/70 px-4 py-5 text-sm font-semibold tracking-[0.2em] uppercase transition-colors hover:bg-brass"
              >
                {action.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
