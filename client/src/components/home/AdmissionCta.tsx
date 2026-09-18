import { Link } from 'react-router-dom'
import { Eyebrow } from '../ui'

const actions = [
  { label: 'Apply to JMC', to: '/admission/how-to-apply' },
  { label: 'Inquire', to: '/contact' },
  { label: 'Visit', to: '/admission/visit' },
  { label: 'Tuition & Fees', to: '/admission/tuition-and-fees' },
]

export default function AdmissionCta() {
  return (
    <section className="relative overflow-hidden bg-ink px-6 py-24 text-white sm:px-10 sm:py-28 lg:px-14">
      <img
        src="/images/lacrosse-field.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-20"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-linear-to-b from-ink/70 to-ink/90" />
      <div className="relative mx-auto max-w-5xl text-center">
        <Eyebrow onDark className="mx-auto">
          Admission
        </Eyebrow>
        <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-6xl">
          Rolling admission for ice hockey, golf, tennis, and lacrosse athletes
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
          We welcome athletes from across the country and around the world throughout the year, at
          both the Irvine and San Diego campuses.
        </p>
        <ul className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-1.5 sm:grid-cols-4">
          {actions.map((action, i) => (
            <li key={action.to}>
              <Link
                to={action.to}
                className={`block px-4 py-5 font-condensed text-[16px] font-semibold tracking-[0.16em] uppercase transition-colors ${
                  i === 0
                    ? 'bg-gold text-ink hover:bg-white'
                    : 'border border-white/35 text-white hover:bg-white hover:text-ink'
                }`}
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
