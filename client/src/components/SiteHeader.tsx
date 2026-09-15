import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo'
import { MenuIcon, SearchIcon } from './icons'
import { site } from '../content/site'

type Props = {
  onOpenMenu: () => void
  onOpenSearch: () => void
  // 'light' when the page starts on a light background, so the unscrolled header uses dark text.
  pageTone?: 'dark' | 'light'
}

export default function SiteHeader({ onOpenMenu, onOpenSearch, pageTone = 'dark' }: Props) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled
          ? 'bg-ink/95 text-white shadow-lg backdrop-blur'
          : pageTone === 'light'
            ? 'bg-transparent text-ink'
            : 'bg-transparent text-white'
      }`}
    >
      <div
        className={`mx-auto flex max-w-[1600px] items-center justify-between px-6 transition-[padding] duration-300 sm:px-10 lg:px-14 ${
          scrolled ? 'py-3' : 'py-6'
        }`}
      >
        <Link to="/" className="flex items-center gap-3" aria-label={`${site.name} home`}>
          <Logo className="h-9 w-auto opacity-85" />
          <span className="font-serif text-xl tracking-[0.14em] uppercase sm:text-2xl">
            {site.name}
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-5">
          <button
            type="button"
            onClick={onOpenSearch}
            className="p-2 opacity-90 transition-opacity hover:opacity-100"
            aria-label="Open search"
          >
            <SearchIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={onOpenMenu}
            className="flex items-center gap-3 p-2 text-sm font-semibold tracking-[0.22em] uppercase"
            aria-label="Open menu"
          >
            <span className="hidden sm:inline">Menu</span>
            <MenuIcon className="h-4 w-6" />
          </button>
        </div>
      </div>
    </header>
  )
}
