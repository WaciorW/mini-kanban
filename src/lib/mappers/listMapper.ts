/**
 * List Mapper
 * Transforms between database and domain types
 */

import type { DbList, InsertList, UpdateList } from '@/types/database.types'
import type { List, CreateListInput, UpdateListInput } from '@/types/domain.types'

/**
 * Convert database list to domain list
 */
export function dbListToDomain(dbList: DbList): List {
  return {
    id: dbList.id,
    title: dbList.title,
    boardId: dbList.board_id,
    position: dbList.position,
    createdAt: new Date(dbList.created_at),
    updatedAt: new Date(dbList.updated_at),
  }
}

/**
 * Convert multiple database lists to domain lists
 */
export function dbListsToDomain(dbLists: DbList[]): List[] {
  return dbLists.map(dbListToDomain)
}

/**
 * Convert create list input to database insert format
 */
export function createListToDb(input: CreateListInput, position: number): InsertList {
  return {
    title: input.title,
    board_id: input.boardId,
    position,
  }
}

/**
 * Convert update list input to database update format
 */
export function updateListToDb(input: UpdateListInput): UpdateList {
  return {
    ...(input.title !== undefined && { title: input.title }),
    ...(input.position !== undefined && { position: input.position }),
  }
}
