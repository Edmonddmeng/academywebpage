import { createContext, useContext, type ReactNode } from 'react'

export type Locale = 'en' | 'zh'

// A value that differs by language. Content modules store copy this way so a
// single resolve step (useT / a resolve* function) produces the plain shape
// components already consume.
export type Localized<T> = { en: T; zh: T }

export const detectLocale = (pathname: string): Locale =>
  pathname === '/zh' || pathname.startsWith('/zh/') ? 'zh' : 'en'

const LocaleContext = createContext<Locale>('en')

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
}

export function useLocale(): Locale {
  return useContext(LocaleContext)
}

export function useT<T>(value: Localized<T>): T {
  return value[useLocale()]
}

// The app renders under a fixed router `basename` per locale (`''` or `/zh`), so
// useLocation()'s pathname is already basename-stripped (locale-neutral) either way.
// This builds an absolute href to the *other* language's version of the current page,
// for use in a plain <a> (a real navigation, since switching locale remounts the router).
export function otherLocalePath(pathname: string, locale: Locale): string {
  if (locale === 'en') return pathname === '/' ? '/zh' : `/zh${pathname}`
  return pathname
}
