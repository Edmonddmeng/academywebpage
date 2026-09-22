import { useEffect } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { site } from '../content/site'

// Bare shell for the applicant portal: no site header, menu or footer, so families
// feel they've stepped into a focused, separate space. Only the wordmark remains.
export default function PortalLayout() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-white text-ink">
      <header className="px-6 pt-10 pb-4 text-center sm:pt-14">
        <Link to="/" className="font-serif text-4xl leading-tight tracking-[0.1em] text-balance uppercase sm:text-6xl lg:text-8xl">
          {site.name}
        </Link>
      </header>
      <main className="flex flex-1 items-start justify-center px-4 pt-6 pb-16 sm:items-center sm:px-6 sm:pt-0">
        <Outlet />
      </main>
    </div>
  )
}
