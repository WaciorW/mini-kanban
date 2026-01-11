/**
 * Boards Page
 * List of user's boards (protected)
 */

import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MainLayout } from '@/components/layout'
import { Button, Modal, Input } from '@/components/ui'
import { getBoardRoute, ROUTES } from '@/lib/constants'
import { useBoardsStore, useAuthStore } from '@/store'

export function BoardsPage() {
  const navigate = useNavigate()
  const { logout } = useAuthStore()
  const { boards, fetchBoards, createBoard, isLoading, error } = useBoardsStore()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newBoardName, setNewBoardName] = useState('')

  useEffect(() => {
    fetchBoards()
  }, [fetchBoards])

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.LOGIN)
  }

  const handleCreateBoard = () => {
    setIsCreateModalOpen(true)
  }

  const handleSubmitCreate = async () => {
    if (!newBoardName.trim()) return

    try {
      await createBoard({ name: newBoardName })
      setNewBoardName('')
      setIsCreateModalOpen(false)
    } catch (err) {
      console.error('Failed to create board:', err)
    }
  }

  if (isLoading) {
    return (
      <MainLayout isAuthenticated onLogout={handleLogout}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-gray-500">Loading boards...</p>
        </div>
      </MainLayout>
    )
  }

  if (error) {
    return (
      <MainLayout isAuthenticated onLogout={handleLogout}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout isAuthenticated onLogout={handleLogout}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Boards</h1>
          <Button onClick={handleCreateBoard}>
            + New Board
          </Button>
        </div>

        {boards.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No boards yet
            </h3>
            <p className="text-gray-500 mb-6">
              Create your first board to get started
            </p>
            <Button onClick={handleCreateBoard}>
              Create Board
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boards.map((board) => (
              <Link
                key={board.id}
                to={getBoardRoute(board.id)}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 border border-gray-200"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {board.name}
                </h3>
                <p className="text-sm text-gray-500">
                  Updated {new Date(board.updatedAt).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Create Board Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Board"
      >
        <div className="space-y-4">
          <Input
            label="Board Name"
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            placeholder="e.g., Project X"
            autoFocus
          />
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitCreate} disabled={!newBoardName.trim()}>
              Create Board
            </Button>
          </div>
        </div>
      </Modal>
    </MainLayout>
  )
}
