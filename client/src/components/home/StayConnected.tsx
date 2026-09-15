import { Eyebrow, ImagePlaceholder } from '../ui'
import { site } from '../../content/site'

export default function StayConnected() {
  return (
    <section className="bg-white px-6 py-20 sm:px-10 lg:px-14">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Eyebrow>Follow Along</Eyebrow>
            <h2 className="mt-4 font-serif text-4xl">Stay Connected</h2>
          </div>
          <ul className="flex flex-wrap gap-6 text-sm font-semibold tracking-[0.18em] uppercase">
            {site.social.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="transition-colors hover:text-brass">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[1, 2, 3, 4].map((n) => (
            <ImagePlaceholder key={n} label="Social post" className="aspect-square" />
          ))}
        </div>
      </div>
    </section>
  )
}
