/**
 * Card Repository - Supabase Implementation
 * Handles all database operations for cards
 */

import { supabase } from '@/lib/supabase/client'
import { dbCardToDomain, createCardToDb } from '@/lib/mappers/cardMapper'
import { RepositoryError, NotFoundError } from './types'
import type { ICardRepository } from './cardRepository.interface'
import type { Card, CreateCardInput, UpdateCardInput, Priority } from '@/types'

export const cardRepository: ICardRepository = {
  /**
   * Get all cards for a list
   */
  async getAllByListId(listId: string): Promise<Card[]> {
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('list_id', listId)
        .order('position', { ascending: true })

      if (error) {
        throw new RepositoryError(
          `Failed to fetch cards: ${error.message}`,
          error.code,
          error
        )
      }

      return data.map(dbCardToDomain)
    } catch (error) {
      if (error instanceof RepositoryError) throw error
      throw new RepositoryError(
        'Unexpected error while fetching cards',
        'UNKNOWN_ERROR',
        error
      )
    }
  },

  /**
   * Get all cards for a board (across all lists)
   */
  async getAllByBoardId(boardId: string): Promise<Card[]> {
    try {
      const { data, error } = await supabase
        .from('cards')
        .select(`
          *,
          lists!inner(board_id)
        `)
        .eq('lists.board_id', boardId)
        .order('position', { ascending: true })

      if (error) {
        throw new RepositoryError(
          `Failed to fetch cards for board: ${error.message}`,
          error.code,
          error
        )
      }

      return data.map(dbCardToDomain)
    } catch (error) {
      if (error instanceof RepositoryError) throw error
      throw new RepositoryError(
        'Unexpected error while fetching cards for board',
        'UNKNOWN_ERROR',
        error
      )
    }
  },

  /**
   * Search cards by query (title or description)
   */
  async search(query: string, boardId?: string): Promise<Card[]> {
    try {
      let supabaseQuery = supabase
        .from('cards')
        .select(
          boardId
            ? `
          *,
          lists!inner(board_id)
        `
            : '*'
        )
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .order('updated_at', { ascending: false })

      if (boardId) {
        supabaseQuery = supabaseQuery.eq('lists.board_id', boardId)
      }

      const { data, error } = await supabaseQuery

      if (error) {
        throw new RepositoryError(
          `Failed to search cards: ${error.message}`,
          error.code,
          error
        )
      }

      return data.map(dbCardToDomain)
    } catch (error) {
      if (error instanceof RepositoryError) throw error
      throw new RepositoryError(
        'Unexpected error while searching cards',
        'UNKNOWN_ERROR',
        error
      )
    }
  },

  /**
   * Filter cards by priority
   */
  async filterByPriority(priority: Priority, boardId?: string): Promise<Card[]> {
    try {
      let supabaseQuery = supabase
        .from('cards')
        .select(
          boardId
            ? `
          *,
          lists!inner(board_id)
        `
            : '*'
        )
        .eq('priority', priority)
        .order('position', { ascending: true })

      if (boardId) {
        supabaseQuery = supabaseQuery.eq('lists.board_id', boardId)
      }

      const { data, error } = await supabaseQuery

      if (error) {
        throw new RepositoryError(
          `Failed to filter cards by priority: ${error.message}`,
          error.code,
          error
        )
      }

      return data.map(dbCardToDomain)
    } catch (error) {
      if (error instanceof RepositoryError) throw error
      throw new RepositoryError(
        'Unexpected error while filtering cards by priority',
        'UNKNOWN_ERROR',
        error
      )
    }
  },

  /**
   * Get a single card by ID
   */
  async getById(id: string): Promise<Card | null> {
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null
        }
        throw new RepositoryError(
          `Failed to fetch card: ${error.message}`,
          error.code,
          error
        )
      }

      return dbCardToDomain(data)
    } catch (error) {
      if (error instanceof RepositoryError) throw error
      throw new RepositoryError(
        'Unexpected error while fetching card',
        'UNKNOWN_ERROR',
        error
      )
    }
  },

  /**
   * Create a new card
   */
  async create(input: CreateCardInput): Promise<Card> {
    try {
      // Get the next position in the list
      const { data: cards, error: countError } = await supabase
        .from('cards')
        .select('position')
        .eq('list_id', input.listId)
        .order('position', { ascending: false })
        .limit(1)

      if (countError) {
        throw new RepositoryError(
          `Failed to get card count: ${countError.message}`,
          countError.code,
          countError
        )
      }

      const nextPosition = cards.length > 0 ? cards[0].position + 1 : 0

      const dbCard = createCardToDb(input, nextPosition)

      const { data, error } = await supabase
        .from('cards')
        .insert(dbCard)
        .select()
        .single()

      if (error) {
        throw new RepositoryError(
          `Failed to create card: ${error.message}`,
          error.code,
          error
        )
      }

      return dbCardToDomain(data)
    } catch (error) {
      if (error instanceof RepositoryError) throw error
      throw new RepositoryError(
        'Unexpected error while creating card',
        'UNKNOWN_ERROR',
        error
      )
    }
  },

  /**
   * Update a card
   */
  async update(id: string, input: UpdateCardInput): Promise<Card> {
    try {
      const updateData: any = {}
      if (input.title !== undefined) updateData.title = input.title
      if (input.description !== undefined) updateData.description = input.description
      if (input.priority !== undefined) updateData.priority = input.priority

      const { data, error } = await supabase
        .from('cards')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          throw new NotFoundError(`Card with id ${id} not found`)
        }
        throw new RepositoryError(
          `Failed to update card: ${error.message}`,
          error.code,
          error
        )
      }

      return dbCardToDomain(data)
    } catch (error) {
      if (error instanceof RepositoryError) throw error
      throw new RepositoryError(
        'Unexpected error while updating card',
        'UNKNOWN_ERROR',
        error
      )
    }
  },

  /**
   * Delete a card
   */
  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase.from('cards').delete().eq('id', id)

      if (error) {
        throw new RepositoryError(
          `Failed to delete card: ${error.message}`,
          error.code,
          error
        )
      }
    } catch (error) {
      if (error instanceof RepositoryError) throw error
      throw new RepositoryError(
        'Unexpected error while deleting card',
        'UNKNOWN_ERROR',
        error
      )
    }
  },

  /**
   * Move a card to a different list and/or position
   */
  async move(cardId: string, targetListId: string, targetPosition: number): Promise<Card> {
    try {
      const { data, error } = await supabase
        .from('cards')
        .update({
          list_id: targetListId,
          position: targetPosition,
        })
        .eq('id', cardId)
        .select()
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          throw new NotFoundError(`Card with id ${cardId} not found`)
        }
        throw new RepositoryError(
          `Failed to move card: ${error.message}`,
          error.code,
          error
        )
      }

      return dbCardToDomain(data)
    } catch (error) {
      if (error instanceof RepositoryError) throw error
      throw new RepositoryError(
        'Unexpected error while moving card',
        'UNKNOWN_ERROR',
        error
      )
    }
  },

  /**
   * Update positions of multiple cards (for reordering)
   */
  async updatePositions(updates: Array<{ id: string; position: number }>): Promise<void> {
    try {
      // Update each card's position
      const promises = updates.map(({ id, position }) =>
        supabase.from('cards').update({ position }).eq('id', id)
      )

      const results = await Promise.all(promises)

      // Check for errors
      const errors = results.filter((r) => r.error)
      if (errors.length > 0) {
        throw new RepositoryError(
          `Failed to update card positions: ${errors[0].error?.message}`,
          errors[0].error?.code,
          errors[0].error
        )
      }
    } catch (error) {
      if (error instanceof RepositoryError) throw error
      throw new RepositoryError(
        'Unexpected error while updating card positions',
        'UNKNOWN_ERROR',
        error
      )
    }
  },
}
