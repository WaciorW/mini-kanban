/**
 * Boards Page
 * List of user's boards (protected) - UPDATED WITH STORE
 */

import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MainLayout } from '@/components/layout'
import { Button } from '@/components/ui'
import { getBoardRoute } from '@/lib/constants'
import { useAuthStore, useBoardsStore } from '@/store'

export function BoardsPage() {
  const logout = useAuthStore((state) => state.logout)
  const { boards, isLoading, fetchBoards } = useBoardsStore()

  useEffect(() => {
    fetchBoards()
  }, [fetchBoards])

  const handleLogout = () => {
    logout()
  }

  const handleCreateBoard = () => {
    // TODO: Open create board modal
    console.log('Create board clicked')
  }

  if (isLoading) {
    return (
      <MainLayout isAuthenticated onLogout={handleLogout}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-gray-500">Loading boards...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout isAuthenticated onLogout={handleLogout}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Boards</h1>
          <Button onClick={handleCreateBoard}>+ New Board</Button>
        </div>

        {boards.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No boards yet</h3>
            <p className="text-gray-500 mb-6">Create your first board to get started</p>
            <Button onClick={handleCreateBoard}>Create Board</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boards.map((board) => (
              <Link
                key={board.id}
                to={getBoardRoute(board.id)}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 border border-gray-200"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{board.name}</h3>
                <p className="text-sm text-gray-500 mb-2">
                  Updated {board.updatedAt.toLocaleDateString()}
                </p>
                <div className="flex gap-4 text-xs text-gray-500">
                  <span>{board.listCount ?? 0} lists</span>
                  <span>{board.cardCount ?? 0} cards</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}
