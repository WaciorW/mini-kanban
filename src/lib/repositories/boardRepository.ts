/**
 * Board Repository - Supabase Implementation
 * Handles all database operations for boards
 */

import { supabase } from '@/lib/supabase/client'
import { dbBoardToDomain, createBoardToDb } from '@/lib/mappers/boardMapper'
import { RepositoryError, NotFoundError } from './types'
import type { IBoardRepository } from './boardRepository.interface'
import type { Board, CreateBoardInput, UpdateBoardInput, FilterOptions } from '@/types'

export const boardRepository: IBoardRepository = {
  /**
   * Get all boards for a user with optional filters
   */
  async getAllByUserId(userId: string, filters?: FilterOptions): Promise<Board[]> {
    try {
      let query = supabase
        .from('boards')
        .select('*')
        .eq('owner_id', userId)

      // Apply filters
      if (filters?.searchQuery) {
        query = query.ilike('name', `%${filters.searchQuery}%`)
      }

      // Apply sorting
      const sortField = filters?.sortBy || 'updated_at'
      const sortOrder = filters?.sortOrder || 'desc'
      query = query.order(sortField, { ascending: sortOrder === 'asc' })

      const { data, error } = await query

      if (error) {
        throw new RepositoryError(
          `Failed to fetch boards: ${error.message}`,
          error.code,
          error
        )
      }

      return data.map(dbBoardToDomain)
    } catch (error) {
      if (error instanceof RepositoryError) throw error
      throw new RepositoryError(
        'Unexpected error while fetching boards',
        'UNKNOWN_ERROR',
        error
      )
    }
  },

  /**
   * Get a single board by ID
   */
  async getById(id: string): Promise<Board | null> {
    try {
      const { data, error } = await supabase
        .from('boards')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null
        }
        throw new RepositoryError(
          `Failed to fetch board: ${error.message}`,
          error.code,
          error
        )
      }

      return dbBoardToDomain(data)
    } catch (error) {
      if (error instanceof RepositoryError) throw error
      throw new RepositoryError(
        'Unexpected error while fetching board',
        'UNKNOWN_ERROR',
        error
      )
    }
  },

  /**
   * Get a board with all its lists and cards
   */
  async getByIdWithData(id: string): Promise<Board | null> {
    try {
      const { data, error } = await supabase
        .from('boards')
        .select(`
          *,
          lists (
            *,
            cards (*)
          )
        `)
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null
        }
        throw new RepositoryError(
          `Failed to fetch board with data: ${error.message}`,
          error.code,
          error
        )
      }

      // Map the board and nested data
      const board = dbBoardToDomain(data)

      // Add lists if they exist
      if (data.lists && Array.isArray(data.lists)) {
        board.lists = data.lists.map((list: any) => ({
          id: list.id,
          title: list.title,
          boardId: list.board_id,
          position: list.position,
          createdAt: new Date(list.created_at),
          updatedAt: new Date(list.updated_at),
          cards: list.cards?.map((card: any) => ({
            id: card.id,
            title: card.title,
            description: card.description,
            listId: card.list_id,
            position: card.position,
            priority: card.priority,
            createdAt: new Date(card.created_at),
            updatedAt: new Date(card.updated_at),
          })) || [],
        }))
      }

      return board
    } catch (error) {
      if (error instanceof RepositoryError) throw error
      throw new RepositoryError(
        'Unexpected error while fetching board with data',
        'UNKNOWN_ERROR',
        error
      )
    }
  },

  /**
   * Create a new board
   */
  async create(input: CreateBoardInput): Promise<Board> {
    try {
      if (!input.ownerId) {
        throw new RepositoryError('ownerId is required', 'VALIDATION_ERROR')
      }

      const dbBoard = createBoardToDb(input, input.ownerId)

      const { data, error } = await supabase
        .from('boards')
        .insert(dbBoard)
        .select()
        .single()

      if (error) {
        throw new RepositoryError(
          `Failed to create board: ${error.message}`,
          error.code,
          error
        )
      }

      return dbBoardToDomain(data)
    } catch (error) {
      if (error instanceof RepositoryError) throw error
      throw new RepositoryError(
        'Unexpected error while creating board',
        'UNKNOWN_ERROR',
        error
      )
    }
  },

  /**
   * Update a board
   */
  async update(id: string, input: UpdateBoardInput): Promise<Board> {
    try {
      const { data, error } = await supabase
        .from('boards')
        .update({ name: input.name })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          throw new NotFoundError(`Board with id ${id} not found`)
        }
        throw new RepositoryError(
          `Failed to update board: ${error.message}`,
          error.code,
          error
        )
      }

      return dbBoardToDomain(data)
    } catch (error) {
      if (error instanceof RepositoryError) throw error
      throw new RepositoryError(
        'Unexpected error while updating board',
        'UNKNOWN_ERROR',
        error
      )
    }
  },

  /**
   * Delete a board (cascades to lists and cards)
   */
  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase.from('boards').delete().eq('id', id)

      if (error) {
        throw new RepositoryError(
          `Failed to delete board: ${error.message}`,
          error.code,
          error
        )
      }
    } catch (error) {
      if (error instanceof RepositoryError) throw error
      throw new RepositoryError(
        'Unexpected error while deleting board',
        'UNKNOWN_ERROR',
        error
      )
    }
  },

  /**
   * Check if user is the owner of a board
   */
  async isOwner(boardId: string, userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('boards')
        .select('owner_id')
        .eq('id', boardId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return false
        }
        throw new RepositoryError(
          `Failed to check board ownership: ${error.message}`,
          error.code,
          error
        )
      }

      return data.owner_id === userId
    } catch (error) {
      if (error instanceof RepositoryError) throw error
      throw new RepositoryError(
        'Unexpected error while checking board ownership',
        'UNKNOWN_ERROR',
        error
      )
    }
  },
}
