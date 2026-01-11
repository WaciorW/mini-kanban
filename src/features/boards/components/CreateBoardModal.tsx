/**
 * Create Board Modal
 * Modal form for creating a new board
 */

import { useState } from 'react'
import { Modal, ModalFooter } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useBoardsStore } from '@/store'
import { createBoardSchema, type CreateBoardFormData } from '@/lib/validation'

interface CreateBoardModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateBoardModal({ isOpen, onClose }: CreateBoardModalProps) {
  const { createBoard, isLoading } = useBoardsStore()
  const [formData, setFormData] = useState<CreateBoardFormData>({ name: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validate
    const result = createBoardSchema.safeParse(formData)
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
      await createBoard(result.data)
      setFormData({ name: '' })
      onClose()
    } catch (error) {
      setErrors({ submit: 'Failed to create board. Please try again.' })
    }
  }

  const handleClose = () => {
    setFormData({ name: '' })
    setErrors({})
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Board">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            label="Board Name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ name: e.target.value })}
            error={errors.name}
            placeholder="e.g., Project X"
            required
            disabled={isLoading}
            autoFocus
          />

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
            Create Board
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}
