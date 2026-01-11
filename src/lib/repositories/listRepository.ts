/**
 * List Repository - Supabase Implementation
 * Handles all database operations for lists
 */

import { supabase } from '@/lib/supabase/client'
import { dbListToDomain, createListToDb } from '@/lib/mappers/listMapper'
import { RepositoryError, NotFoundError } from './types'
import type { IListRepository } from './listRepository.interface'
import type { List, CreateListInput, UpdateListInput } from '@/types'

export const listRepository: IListRepository = {
  /**
   * Get all lists for a board
   */
  async getAllByBoardId(boardId: string): Promise<List[]> {
    try {
      const { data, error } = await supabase
        .from('lists')
        .select('*')
        .eq('board_id', boardId)
        .order('position', { ascending: true })

      if (error) {
        throw new RepositoryError(
          `Failed to fetch lists: ${error.message}`,
          error.code,
          error
        )
      }

      return data.map(dbListToDomain)
    } catch (error) {
      if (error instanceof RepositoryError) throw error
      throw new RepositoryError(
        'Unexpected error while fetching lists',
        'UNKNOWN_ERROR',
        error
      )
    }
  },

  /**
   * Get a single list by ID
   */
  async getById(id: string): Promise<List | null> {
    try {
      const { data, error } = await supabase
        .from('lists')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null
        }
        throw new RepositoryError(
          `Failed to fetch list: ${error.message}`,
          error.code,
          error
        )
      }

      return dbListToDomain(data)
    } catch (error) {
      if (error instanceof RepositoryError) throw error
      throw new RepositoryError(
        'Unexpected error while fetching list',
        'UNKNOWN_ERROR',
        error
      )
    }
  },

  /**
   * Create a new list
   */
  async create(input: CreateListInput): Promise<List> {
    try {
      // Get the next position
      const { data: lists, error: countError } = await supabase
        .from('lists')
        .select('position')
        .eq('board_id', input.boardId)
        .order('position', { ascending: false })
        .limit(1)

      if (countError) {
        throw new RepositoryError(
          `Failed to get list count: ${countError.message}`,
          countError.code,
          countError
        )
      }

      const nextPosition = lists.length > 0 ? lists[0].position + 1 : 0

      const dbList = createListToDb(input, nextPosition)

      const { data, error } = await supabase
        .from('lists')
        .insert(dbList)
        .select()
        .single()

      if (error) {
        throw new RepositoryError(
          `Failed to create list: ${error.message}`,
          error.code,
          error
        )
      }

      return dbListToDomain(data)
    } catch (error) {
      if (error instanceof RepositoryError) throw error
      throw new RepositoryError(
        'Unexpected error while creating list',
        'UNKNOWN_ERROR',
        error
      )
    }
  },

  /**
   * Update a list
   */
  async update(id: string, input: UpdateListInput): Promise<List> {
    try {
      const { data, error } = await supabase
        .from('lists')
        .update({ title: input.title })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          throw new NotFoundError(`List with id ${id} not found`)
        }
        throw new RepositoryError(
          `Failed to update list: ${error.message}`,
          error.code,
          error
        )
      }

      return dbListToDomain(data)
    } catch (error) {
      if (error instanceof RepositoryError) throw error
      throw new RepositoryError(
        'Unexpected error while updating list',
        'UNKNOWN_ERROR',
        error
      )
    }
  },

  /**
   * Delete a list (cascades to cards)
   */
  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase.from('lists').delete().eq('id', id)

      if (error) {
        throw new RepositoryError(
          `Failed to delete list: ${error.message}`,
          error.code,
          error
        )
      }
    } catch (error) {
      if (error instanceof RepositoryError) throw error
      throw new RepositoryError(
        'Unexpected error while deleting list',
        'UNKNOWN_ERROR',
        error
      )
    }
  },

  /**
   * Update positions of multiple lists (for reordering)
   */
  async updatePositions(updates: Array<{ id: string; position: number }>): Promise<void> {
    try {
      // Update each list's position
      const promises = updates.map(({ id, position }) =>
        supabase.from('lists').update({ position }).eq('id', id)
      )

      const results = await Promise.all(promises)

      // Check for errors
      const errors = results.filter((r) => r.error)
      if (errors.length > 0) {
        throw new RepositoryError(
          `Failed to update list positions: ${errors[0].error?.message}`,
          errors[0].error?.code,
          errors[0].error
        )
      }
    } catch (error) {
      if (error instanceof RepositoryError) throw error
      throw new RepositoryError(
        'Unexpected error while updating list positions',
        'UNKNOWN_ERROR',
        error
      )
    }
  },
}
