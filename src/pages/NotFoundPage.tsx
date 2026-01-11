/**
 * Not Found Page (404)
 * Displayed when route doesn't exist
 */

import { Link } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
import { Button } from '@/components/ui'

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-300">404</h1>
        <h2 className="text-3xl font-semibold text-gray-900 mt-4 mb-2">
          Page not found
        </h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to={ROUTES.HOME}>
          <Button>
            Go back home
          </Button>
        </Link>
      </div>
    </div>
  )
}
