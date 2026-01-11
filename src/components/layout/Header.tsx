/**
 * Header Component
 * Navigation header with logo and user menu
 */

import { Link } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
import { Button } from '@/components/ui'

interface HeaderProps {
  isAuthenticated?: boolean
  onLogout?: () => void
}

export function Header({ isAuthenticated = false, onLogout }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to={isAuthenticated ? ROUTES.BOARDS : ROUTES.HOME} className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">Mini Kanban</span>
            </Link>
          </div>

          <nav className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to={ROUTES.BOARDS}>
                  <Button variant="ghost" size="sm">
                    My Boards
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={onLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to={ROUTES.LOGIN}>
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to={ROUTES.REGISTER}>
                  <Button size="sm">
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
