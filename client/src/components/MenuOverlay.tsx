import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo'
import { ChevronRight, CloseIcon } from './icons'
import { linkPath, useNavSections, useQuickLinks, useUtilityLinks } from '../content/navigation'
import { useSite } from '../content/site'
import { useLocale } from '../content/locale'

const copy = {
  en: {
    quickLinks: 'Quick Links',
    siteMenu: 'Site menu',
    utility: 'Utility',
    closeMenu: 'Close menu',
    main: 'Main',
  },
  zh: {
    quickLinks: '常用链接',
    siteMenu: '网站菜单',
    utility: '快捷导航',
    closeMenu: '关闭菜单',
    main: '主导航',
  },
}

export default function MenuOverlay({ onClose }: { onClose: () => void }) {
  const [active, setActive] = useState(0)
  const panelRef = useRef<HTMLDivElement>(null)
  const site = useSite()
  const navSections = useNavSections()
  const quickLinks = useQuickLinks()
  const utilityLinks = useUtilityLinks()
  const t = copy[useLocale()]
  const current = navSections[active]

  useEffect(() => {
    panelRef.current?.focus()
  }, [])

  const subLinks = (className: string) => (
    <ul key={current.slug} className={`animate-fade-in space-y-4 ${className}`}>
      {current.links.map((link) => (
        <li key={link.slug}>
          <Link
            to={linkPath(current, link)}
            onClick={onClose}
            className="text-lg font-medium text-ink transition-colors hover:text-brass"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  )

  const quickLinkList = (
    <ul className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
      {quickLinks.map((link) => (
        <li key={link.to}>
          <Link
            to={link.to}
            onClick={onClose}
            className="flex items-start gap-2 text-ink-soft transition-colors hover:text-brass"
          >
            <ChevronRight className="mt-1 h-4 w-4 shrink-0" />
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  )

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={t.siteMenu}>
      <div className="absolute inset-0 animate-fade-in bg-ink/45 backdrop-blur-[2px]" onClick={onClose} />

      <div
        ref={panelRef}
        tabIndex={-1}
        className="absolute inset-0 flex animate-panel-in flex-col overflow-y-auto bg-white outline-none lg:right-[26%] lg:left-[18%]"
      >
        <div className="flex items-center gap-10 px-6 pt-6 sm:px-12 lg:px-16 lg:pt-10">
          <Link to="/" onClick={onClose} aria-label={`${site.name} home`}>
            <Logo className="h-14 w-auto text-ink lg:h-16" />
          </Link>
          <nav aria-label={t.utility} className="hidden flex-wrap gap-x-8 gap-y-2 sm:flex">
            {utilityLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={onClose}
                className="text-sm font-semibold tracking-[0.24em] text-ink-soft uppercase transition-colors hover:text-brass"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto grid h-12 w-12 shrink-0 place-items-center rounded-full bg-ink text-white lg:hidden"
            aria-label={t.closeMenu}
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <nav
          aria-label={t.main}
          className="grid flex-1 gap-10 px-6 py-10 sm:px-12 lg:grid-cols-2 lg:px-16 lg:py-14"
        >
          <ul>
            {navSections.map((section, i) => {
              const isActive = i === active
              return (
                <li key={section.slug}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    aria-expanded={isActive}
                    className={`flex items-center gap-4 py-1.5 text-left font-serif text-4xl leading-tight transition-colors xl:text-5xl ${
                      isActive ? 'text-ink' : 'text-slate-400 hover:text-ink'
                    }`}
                  >
                    {section.label}
                    <ChevronRight
                      className={`h-6 w-6 text-brass transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`}
                    />
                  </button>
                  {isActive && subLinks('py-4 pl-1 lg:hidden')}
                </li>
              )
            })}
          </ul>
          {subLinks('hidden pt-4 lg:block')}
        </nav>

        <div className="px-6 pb-10 sm:px-12 lg:hidden">
          <h2 className="mb-5 font-serif text-2xl text-ink">{t.quickLinks}</h2>
          {quickLinkList}
        </div>

        <p className="max-w-lg px-6 pb-10 text-sm leading-relaxed text-slate-500 sm:px-12 lg:px-16">
          {site.description}
        </p>
      </div>

      <aside className="absolute inset-y-0 right-0 hidden w-[26%] animate-fade-in flex-col bg-white/80 backdrop-blur-md lg:flex">
        <button
          type="button"
          onClick={onClose}
          className="mt-10 mr-10 grid h-16 w-16 place-items-center self-end rounded-full bg-ink text-white transition-colors hover:bg-brass"
          aria-label={t.closeMenu}
        >
          <CloseIcon className="h-6 w-6" />
        </button>
        <div className="mt-auto px-10 pb-14">
          <h2 className="mb-6 font-serif text-3xl text-ink">{t.quickLinks}</h2>
          {quickLinkList}
        </div>
      </aside>
    </div>
  )
}
