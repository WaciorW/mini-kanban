/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 */

import { Navigate } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
import { useAuthStore } from '@/store'

interface ProtectedRouteProps {
  children: React.ReactNode
}

/**
 * Wrapper component for protected routes
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  return <>{children}</>
}
