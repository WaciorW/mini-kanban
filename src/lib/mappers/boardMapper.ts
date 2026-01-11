/**
 * Board Mapper
 * Transforms between database and domain types
 */

import type { DbBoard, InsertBoard, UpdateBoard } from '@/types/database.types'
import type { Board, CreateBoardInput, UpdateBoardInput } from '@/types/domain.types'

/**
 * Convert database board to domain board
 */
export function dbBoardToDomain(dbBoard: DbBoard): Board {
  return {
    id: dbBoard.id,
    name: dbBoard.name,
    ownerId: dbBoard.owner_id,
    createdAt: new Date(dbBoard.created_at),
    updatedAt: new Date(dbBoard.updated_at),
  }
}

/**
 * Convert multiple database boards to domain boards
 */
export function dbBoardsToDomain(dbBoards: DbBoard[]): Board[] {
  return dbBoards.map(dbBoardToDomain)
}

/**
 * Convert create board input to database insert format
 */
export function createBoardToDb(input: CreateBoardInput, ownerId: string): InsertBoard {
  return {
    name: input.name,
    owner_id: ownerId,
  }
}

/**
 * Convert update board input to database update format
 */
export function updateBoardToDb(input: UpdateBoardInput): UpdateBoard {
  return {
    ...(input.name !== undefined && { name: input.name }),
  }
}
