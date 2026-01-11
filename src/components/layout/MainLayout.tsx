/**
 * Main Layout Component
 * Wrapper layout with header and main content area
 */

import { Header } from './Header'

interface MainLayoutProps {
  children: React.ReactNode
  isAuthenticated?: boolean
  onLogout?: () => void
}

export function MainLayout({ children, isAuthenticated, onLogout }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header isAuthenticated={isAuthenticated} onLogout={onLogout} />
      <main>{children}</main>
    </div>
  )
}
