import { Eyebrow } from '../ui'
import { site } from '../../content/site'

export default function StayConnected() {
  return (
    <section className="bg-white px-6 py-16 sm:px-10 lg:px-14">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div>
          <Eyebrow>Follow Along</Eyebrow>
          <h2 className="mt-3 font-serif text-4xl">Stay Connected</h2>
        </div>
        <ul className="flex flex-wrap gap-3">
          {site.social.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="inline-block border border-ink/20 px-5 py-3 text-sm font-semibold tracking-[0.18em] uppercase transition-colors hover:border-brass hover:text-brass"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
