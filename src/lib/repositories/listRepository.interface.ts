/**
 * List Repository Interface
 * Contract for list (column) data access
 */

import type { List, CreateListInput, UpdateListInput } from '@/types'
import type { IRepository } from './types'

export interface IListRepository extends Omit<IRepository<List, CreateListInput, UpdateListInput>, 'getAll'> {
  /**
   * Get all lists for a specific board
   */
  getAllByBoardId(boardId: string): Promise<List[]>

  /**
   * Update positions of multiple lists (for reordering)
   */
  updatePositions(updates: Array<{ id: string; position: number }>): Promise<void>
}
