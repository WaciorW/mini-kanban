/**
 * Card Form Modal
 * Modal form for creating/editing a card
 */

import { useState, useEffect } from 'react'
import { Modal, ModalFooter } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useBoardStore } from '@/store'
import { createCardSchema, type CreateCardFormData } from '@/lib/validation'
import type { Card, Priority } from '@/types'

interface CardFormModalProps {
  isOpen: boolean
  onClose: () => void
  listId: string
  card?: Card // If editing
}

export function CardFormModal({ isOpen, onClose, listId, card }: CardFormModalProps) {
  const { createCard, updateCard, isLoading } = useBoardStore()
  const [formData, setFormData] = useState<CreateCardFormData>({
    title: '',
    description: '',
    priority: 'medium',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Initialize form data when editing
  useEffect(() => {
    if (card) {
      setFormData({
        title: card.title,
        description: card.description || '',
        priority: card.priority,
      })
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
      })
    }
  }, [card, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validate
    const result = createCardSchema.safeParse(formData)
    if (!result.success) {
      const newErrors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        const path = issue.path.join('.')
        newErrors[path] = issue.message
      })
      setErrors(newErrors)
      return
    }

    try {
      if (card) {
        // Update existing card
        await updateCard(card.id, result.data)
      } else {
        // Create new card
        await createCard({
          ...result.data,
          listId,
        })
      }
      handleClose()
    } catch (error) {
      setErrors({
        submit: `Failed to ${card ? 'update' : 'create'} card. Please try again.`,
      })
    }
  }

  const handleClose = () => {
    setFormData({ title: '', description: '', priority: 'medium' })
    setErrors({})
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={card ? 'Edit Card' : 'Create New Card'}
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            label="Card Title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            error={errors.title}
            placeholder="e.g., Implement authentication"
            required
            disabled={isLoading}
            autoFocus
          />

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 resize-none"
              rows={4}
              placeholder="Add more details..."
              disabled={isLoading}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Priority <span className="text-red-500">*</span>
            </label>
            <select
              id="priority"
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value as Priority })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              disabled={isLoading}
              required
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            {errors.priority && (
              <p className="mt-1 text-sm text-red-600">{errors.priority}</p>
            )}
          </div>

          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{errors.submit}</p>
            </div>
          )}
        </div>

        <ModalFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading} disabled={isLoading}>
            {card ? 'Save Changes' : 'Create Card'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}
