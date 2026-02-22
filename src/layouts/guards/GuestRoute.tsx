import { useAuth } from '@/context/UserContext'
import { Navigate, Outlet } from 'react-router'

export default function GuestRoute() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/account" replace />
  }

  return <Outlet />
}