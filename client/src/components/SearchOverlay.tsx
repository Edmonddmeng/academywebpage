import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CloseIcon } from './icons'
import { linkPath, navSections, sectionPath } from '../content/navigation'

const pages = navSections.flatMap((section) => [
  { label: section.label, group: 'Main section', to: sectionPath(section) },
  ...section.links.map((link) => ({
    label: link.label,
    group: section.label,
    to: linkPath(section, link),
  })),
])

export default function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const results = q
    ? pages.filter((p) => `${p.label} ${p.group}`.toLowerCase().includes(q)).slice(0, 12)
    : []

  return (
    <div
      className="fixed inset-0 z-50 animate-fade-in overflow-y-auto bg-ink/97 text-white"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-6 right-6 grid h-12 w-12 place-items-center rounded-full border border-white/30 transition-colors hover:bg-white hover:text-ink sm:top-10 sm:right-10"
        aria-label="Close search"
      >
        <CloseIcon className="h-5 w-5" />
      </button>

      <div className="mx-auto max-w-3xl px-6 pt-32 pb-20">
        <label htmlFor="site-search" className="text-xs font-semibold tracking-[0.28em] text-brass uppercase">
          Search
        </label>
        <input
          id="site-search"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What are you looking for?"
          className="mt-4 w-full border-b border-white/30 bg-transparent pb-4 font-serif text-3xl placeholder:text-white/35 focus:border-brass focus:outline-none sm:text-5xl"
        />

        <ul className="mt-8 divide-y divide-white/10">
          {results.map((page) => (
            <li key={page.to}>
              <Link
                to={page.to}
                onClick={onClose}
                className="flex items-baseline justify-between gap-6 py-4 transition-colors hover:text-brass"
              >
                <span className="text-xl">{page.label}</span>
                <span className="text-xs tracking-[0.2em] text-white/50 uppercase">{page.group}</span>
              </Link>
            </li>
          ))}
        </ul>
        {q && results.length === 0 && (
          <p className="mt-8 text-white/60">No pages match “{query}”.</p>
        )}
      </div>
    </div>
  )
}
