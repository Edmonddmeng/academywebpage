import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { api } from './api'

export type User = { id: string; email: string; role: 'guardian' | 'staff' | 'admin'; fullName: string | null }

type AuthState = {
  /** undefined while the first check is in flight; null when signed out. */
  user: User | null | undefined
  refresh: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined)

  const refresh = useCallback(async () => {
    try {
      const { user } = await api<{ user: User }>('/auth/me')
      setUser(user)
    } catch {
      setUser(null)
    }
  }, [])

  const signOut = useCallback(async () => {
    try {
      await api('/auth/logout', {})
    } finally {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return <AuthContext.Provider value={{ user, refresh, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
