import { Link } from 'react-router-dom'
import Logo from './Logo'
import { site } from '../content/site'

const heading = 'mb-5 text-xs font-semibold tracking-[0.28em] text-brass uppercase'

export default function Footer() {
  return (
    <footer className="bg-ink text-white/75">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 sm:px-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-14">
        <div>
          <Link to="/" className="flex items-center gap-3 text-white">
            <Logo className="h-11 w-auto" />
            <span className="font-serif text-2xl tracking-[0.14em] uppercase">{site.name}</span>
          </Link>
          <p className="mt-6 max-w-sm text-sm leading-relaxed">{site.description}</p>
        </div>

        <div>
          <h2 className={heading}>Visit Us</h2>
          <address className="text-sm leading-relaxed not-italic">
            {site.address.map((line) => (
              <div key={line}>{line}</div>
            ))}
            <div className="mt-3">{site.phone}</div>
            <a href={`mailto:${site.email}`} className="hover:text-white">
              {site.email}
            </a>
          </address>
        </div>

        <div>
          <h2 className={heading}>Helpful Links</h2>
          <ul className="space-y-2 text-sm">
            {site.footerLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className={heading}>Follow Us</h2>
          <ul className="space-y-2 text-sm">
            {site.social.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="hover:text-white">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-14">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="self-start tracking-[0.2em] uppercase hover:text-white sm:self-auto"
          >
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  )
}
