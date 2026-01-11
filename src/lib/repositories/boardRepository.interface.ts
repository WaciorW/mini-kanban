/**
 * Board Repository Interface
 * Contract for board data access
 */

import type { Board, CreateBoardInput, UpdateBoardInput, FilterOptions } from '@/types'
import type { IRepository } from './types'

export interface IBoardRepository extends Omit<IRepository<Board, CreateBoardInput, UpdateBoardInput>, 'getAll'> {
  /**
   * Get all boards for a specific user
   */
  getAllByUserId(userId: string, filters?: FilterOptions): Promise<Board[]>

  /**
   * Get board with all nested lists and cards
   */
  getByIdWithData(id: string): Promise<Board | null>

  /**
   * Check if user owns the board
   */
  isOwner(boardId: string, userId: string): Promise<boolean>
}
