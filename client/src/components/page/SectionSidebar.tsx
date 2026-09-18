import { NavLink } from 'react-router-dom'
import { Eyebrow } from '../ui'
import { linkPath, type NavSection } from '../../content/navigation'

/**
 * Persistent "in this section" nav shown alongside every inner page, so browsing
 * a section keeps its sibling pages in view rather than only linking them at the
 * bottom of the page.
 */
export default function SectionSidebar({ section }: { section: NavSection }) {
  return (
    <nav aria-label={`${section.label} pages`} className="lg:sticky lg:top-28 lg:self-start">
      <Eyebrow>{section.label}</Eyebrow>
      <ul className="mt-5 border-l border-sand">
        {section.links.map((link) => (
          <li key={link.slug}>
            <NavLink
              to={linkPath(section, link)}
              end
              className={({ isActive }) =>
                `-ml-px block border-l-2 py-2 pl-4 transition-colors ${
                  isActive
                    ? 'border-brass font-semibold text-ink'
                    : 'border-transparent text-ink/60 hover:text-ink'
                }`
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
