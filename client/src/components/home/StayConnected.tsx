import { Eyebrow } from '../ui'
import Reveal from '../Reveal'
import { useSite } from '../../content/site'
import { useLocale } from '../../content/locale'

const copy = {
  en: { eyebrow: 'Follow Along', heading: 'Stay Connected' },
  zh: { eyebrow: '关注我们', heading: '保持联系' },
}

export default function StayConnected() {
  const site = useSite()
  const t = copy[useLocale()]
  return (
    <section className="bg-white px-6 py-16 sm:px-10 lg:px-14">
      <Reveal
        as="div"
        className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h2 className="mt-3 font-serif text-4xl">{t.heading}</h2>
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
      </Reveal>
    </section>
  )
}
