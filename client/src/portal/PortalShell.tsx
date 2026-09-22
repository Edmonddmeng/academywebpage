import { Link, Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useLocale } from '../content/locale'
import { site } from '../content/site'

const copy = {
  en: { students: 'My Students', logOut: 'Log out' },
  zh: { students: '我的学生', logOut: '退出登录' },
}

// Signed-in frame for the applicant portal: compact wordmark, one tab, log out.
// No site header, menu or footer — families stay in a focused space.
export default function PortalShell() {
  const t = copy[useLocale()]
  const { user, signOut } = useAuth()
  const { pathname } = useLocation()

  if (user === undefined) return null // still checking the session
  if (user === null) return <Navigate to="/login" replace state={{ from: pathname }} />

  const isStaff = user.role === 'staff' || user.role === 'admin'
  const tabs = [
    { to: '/portal', label: t.students },
    ...(isStaff ? [{ to: '/staff', label: 'Applications' }, { to: '/staff/interviews', label: 'Interviews' }] : []),
  ]

  return (
    <div className="min-h-screen bg-white text-ink">
      <header className="mx-auto max-w-6xl px-6 pt-8">
        <div className="flex items-center justify-between gap-4">
          <Link to="/portal" className="font-serif text-2xl tracking-[0.1em] uppercase sm:text-3xl">
            {site.name}
          </Link>
          <button
            type="button"
            onClick={() => void signOut()}
            className="shrink-0 text-sm font-semibold underline-offset-4 hover:text-brass hover:underline"
          >
            {t.logOut}
          </button>
        </div>
        <nav className="mt-6 flex gap-8 border-b border-sand">
          {tabs.map((tab) => {
            // "Applications" stays lit while viewing a single application, but not on the Interviews tab.
            const active =
              tab.to === '/staff'
                ? pathname === '/staff' || pathname.startsWith('/staff/applications')
                : pathname.startsWith(tab.to)
            return (
              <Link
                key={tab.to}
                to={tab.to}
                aria-current={active ? 'page' : undefined}
                className={`-mb-px inline-block border-b-4 pb-3 font-serif text-xl ${active ? 'border-ink' : 'border-transparent text-ink/60 hover:text-ink'}`}
              >
                {tab.label}
              </Link>
            )
          })}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  )
}
