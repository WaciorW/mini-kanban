/**
 * Card Repository Interface
 * Contract for card (task) data access
 */

import type { Card, CreateCardInput, UpdateCardInput, Priority } from '@/types'
import type { IRepository } from './types'

export interface ICardRepository extends Omit<IRepository<Card, CreateCardInput, UpdateCardInput>, 'getAll'> {
  /**
   * Get all cards for a specific list
   */
  getAllByListId(listId: string): Promise<Card[]>

  /**
   * Get all cards for a board (across all lists)
   */
  getAllByBoardId(boardId: string): Promise<Card[]>

  /**
   * Search cards by title/description
   */
  search(query: string, boardId?: string): Promise<Card[]>

  /**
   * Filter by priority
   */
  filterByPriority(priority: Priority, boardId?: string): Promise<Card[]>

  /**
   * Move card to different list
   */
  move(cardId: string, targetListId: string, targetPosition: number): Promise<Card>

  /**
   * Update positions of multiple cards (for reordering)
   */
  updatePositions(updates: Array<{ id: string; position: number }>): Promise<void>
}
