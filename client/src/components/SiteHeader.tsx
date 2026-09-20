import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Logo from './Logo'
import { MenuIcon, SearchIcon } from './icons'
import { useSite } from '../content/site'
import { useLocale, otherLocalePath } from '../content/locale'

type Props = {
  onOpenMenu: () => void
  onOpenSearch: () => void
  // 'light' when the page starts on a light background, so the unscrolled header uses dark text.
  pageTone?: 'dark' | 'light'
}

export default function SiteHeader({ onOpenMenu, onOpenSearch, pageTone = 'dark' }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const site = useSite()
  const locale = useLocale()
  const { pathname } = useLocation()

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
          <Logo className="h-9 w-auto opacity-90" />
          <span className="font-serif text-lg tracking-[0.1em] uppercase sm:text-2xl">
            <span className="sm:hidden">{site.shortName}</span>
            <span className="hidden sm:inline">{site.name}</span>
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-5">
          <a
            href={otherLocalePath(pathname, locale)}
            className="p-2 text-sm font-semibold tracking-[0.14em] uppercase opacity-90 transition-opacity hover:opacity-100"
            aria-label={locale === 'en' ? 'Switch to Chinese' : '切换为英文'}
          >
            {locale === 'en' ? '中文' : 'EN'}
          </a>
          <button
            type="button"
            onClick={onOpenSearch}
            className="p-2 opacity-90 transition-opacity hover:opacity-100"
            aria-label={locale === 'en' ? 'Open search' : '打开搜索'}
          >
            <SearchIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={onOpenMenu}
            className="flex items-center gap-3 p-2 text-sm font-semibold tracking-[0.22em] uppercase"
            aria-label={locale === 'en' ? 'Open menu' : '打开菜单'}
          >
            <span className="hidden sm:inline">{locale === 'en' ? 'Menu' : '菜单'}</span>
            <MenuIcon className="h-4 w-6" />
          </button>
        </div>
      </div>
    </header>
  )
}
