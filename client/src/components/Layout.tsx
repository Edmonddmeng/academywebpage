import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import SiteHeader from './SiteHeader'
import MenuOverlay from './MenuOverlay'
import SearchOverlay from './SearchOverlay'
import Footer from './Footer'
import ScrollProgress from './ScrollProgress'
import { isSportPath } from '../content/sports'

type Overlay = 'menu' | 'search' | null

export default function Layout() {
  const [overlay, setOverlay] = useState<Overlay>(null)
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    if (!overlay) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOverlay(null)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [overlay])

  const close = () => setOverlay(null)

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollProgress />
      <SiteHeader
        onOpenMenu={() => setOverlay('menu')}
        onOpenSearch={() => setOverlay('search')}
        pageTone={isSportPath(pathname) ? 'light' : 'dark'}
      />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {overlay === 'menu' && <MenuOverlay onClose={close} />}
      {overlay === 'search' && <SearchOverlay onClose={close} />}
    </div>
  )
}
