/**
 * Board Page
 * Single board view with lists and cards (protected)
 */

import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MainLayout } from '@/components/layout'
import { Button, Modal, Input } from '@/components/ui'
import { useBoardStore, useAuthStore } from '@/store'
import { ROUTES } from '@/lib/constants'
import type { Priority } from '@/types'

const priorityColors = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
}

export function BoardPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { logout } = useAuthStore()
  const { board, lists, cards, fetchBoard, createList, createCard, isLoading, error } = useBoardStore()

  const [isAddListModalOpen, setIsAddListModalOpen] = useState(false)
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false)
  const [selectedListId, setSelectedListId] = useState<string | null>(null)
  const [newListTitle, setNewListTitle] = useState('')
  const [newCardTitle, setNewCardTitle] = useState('')
  const [newCardDescription, setNewCardDescription] = useState('')
  const [newCardPriority, setNewCardPriority] = useState<Priority>('medium')
  const [searchQuery, setSearchQuery] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<Priority | ''>('')

  useEffect(() => {
    if (id) {
      fetchBoard(id)
    }
  }, [id, fetchBoard])

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.LOGIN)
  }

  const handleAddList = () => {
    setIsAddListModalOpen(true)
  }

  const handleCreateList = async () => {
    if (!id || !newListTitle.trim()) return

    try {
      await createList({ title: newListTitle, boardId: id })
      setNewListTitle('')
      setIsAddListModalOpen(false)
    } catch (err) {
      console.error('Failed to create list:', err)
    }
  }

  const handleOpenAddCard = (listId: string) => {
    setSelectedListId(listId)
    setIsAddCardModalOpen(true)
  }

  const handleCreateCard = async () => {
    if (!selectedListId || !newCardTitle.trim()) return

    try {
      await createCard({
        title: newCardTitle,
        description: newCardDescription || undefined,
        listId: selectedListId,
        priority: newCardPriority,
      })
      setNewCardTitle('')
      setNewCardDescription('')
      setNewCardPriority('medium')
      setIsAddCardModalOpen(false)
      setSelectedListId(null)
    } catch (err) {
      console.error('Failed to create card:', err)
    }
  }

  const getCardsForList = (listId: string) => {
    let filteredCards = cards.filter((card) => card.listId === listId)

    // Apply search filter
    if (searchQuery) {
      filteredCards = filteredCards.filter(
        (card) =>
          card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          card.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply priority filter
    if (priorityFilter) {
      filteredCards = filteredCards.filter((card) => card.priority === priorityFilter)
    }

    return filteredCards.sort((a, b) => a.position - b.position)
  }

  if (isLoading) {
    return (
      <MainLayout isAuthenticated onLogout={handleLogout}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-gray-500">Loading board...</p>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {board?.name || 'Board'}
          </h1>

          <div className="flex gap-4 mb-6">
            <input
              type="text"
              placeholder="Search cards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as Priority | '')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4">
          {lists.map((list) => {
            const listCards = getCardsForList(list.id)
            return (
              <div key={list.id} className="flex-shrink-0 w-80 bg-gray-100 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-900">{list.title}</h3>
                  <span className="text-sm text-gray-500">{listCards.length}</span>
                </div>

                <div className="space-y-3 mb-4">
                  {listCards.map((card) => (
                    <div
                      key={card.id}
                      className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <h4 className="text-gray-900 font-medium mb-2">{card.title}</h4>
                      {card.description && (
                        <p className="text-sm text-gray-600 mb-2">{card.description}</p>
                      )}
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${priorityColors[card.priority]}`}>
                        {card.priority}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleOpenAddCard(list.id)}
                  className="w-full py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
                >
                  + Add card
                </button>
              </div>
            )
          })}

          <div className="flex-shrink-0 w-80">
            <Button variant="ghost" onClick={handleAddList} className="w-full h-full min-h-[100px] border-2 border-dashed border-gray-300">
              + Add list
            </Button>
          </div>
        </div>
      </div>

      {/* Add List Modal */}
      <Modal
        isOpen={isAddListModalOpen}
        onClose={() => setIsAddListModalOpen(false)}
        title="Add New List"
      >
        <div className="space-y-4">
          <Input
            label="List Title"
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
            placeholder="e.g., To Do"
            autoFocus
          />
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setIsAddListModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateList} disabled={!newListTitle.trim()}>
              Create List
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Card Modal */}
      <Modal
        isOpen={isAddCardModalOpen}
        onClose={() => setIsAddCardModalOpen(false)}
        title="Add New Card"
      >
        <div className="space-y-4">
          <Input
            label="Card Title"
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            placeholder="e.g., Implement authentication"
            autoFocus
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (optional)
            </label>
            <textarea
              value={newCardDescription}
              onChange={(e) => setNewCardDescription(e.target.value)}
              placeholder="Add more details..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={newCardPriority}
              onChange={(e) => setNewCardPriority(e.target.value as Priority)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setIsAddCardModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCard} disabled={!newCardTitle.trim()}>
              Create Card
            </Button>
          </div>
        </div>
      </Modal>
    </MainLayout>
  )
}
