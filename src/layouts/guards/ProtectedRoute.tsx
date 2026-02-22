import { useAuth } from '@/context/UserContext'
import { Navigate, Outlet, useLocation } from 'react-router'

interface ProtectedRouteProps {
  emailMethodOnly?: boolean
}

export default function ProtectedRoute({ emailMethodOnly = false }: ProtectedRouteProps) {
  const { isAuthenticated, emailMethod } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (emailMethodOnly && !emailMethod) {
    return <Navigate to="/account" replace />
  }

  return <Outlet />
}