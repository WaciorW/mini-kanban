/**
 * Home Page
 * Landing page with welcome message
 */

import { Link } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
import { Button } from '@/components/ui'

export function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Mini Kanban
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Organize your tasks with a simple and elegant Kanban board
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={ROUTES.LOGIN}>
              <Button size="lg" className="w-full sm:w-auto">
                Login
              </Button>
            </Link>
            <Link to={ROUTES.REGISTER}>
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Get Started
              </Button>
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="text-blue-600 font-semibold mb-2">📋 Organize</div>
              <p className="text-gray-700 text-sm">
                Create boards, lists, and cards to organize your work
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-6">
              <div className="text-green-600 font-semibold mb-2">🎯 Prioritize</div>
              <p className="text-gray-700 text-sm">
                Set priorities and filter tasks to focus on what matters
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-6">
              <div className="text-purple-600 font-semibold mb-2">✨ Simple</div>
              <p className="text-gray-700 text-sm">
                Clean interface, no clutter, just productivity
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
