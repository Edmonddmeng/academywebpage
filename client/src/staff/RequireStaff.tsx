import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

// Staff pages are for the admissions team only. (The server enforces this too; this just keeps
// families from landing on a page that would only show them errors.)
export default function RequireStaff() {
  const { user } = useAuth()
  if (user === undefined) return null
  if (!user || (user.role !== 'staff' && user.role !== 'admin')) return <Navigate to="/portal" replace />
  return <Outlet />
}
