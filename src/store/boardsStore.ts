/**
 * Boards Store
 * Global state for user's boards list with Supabase integration
 */

import { create } from 'zustand'
import { boardRepository } from '@/lib/repositories/boardRepository'
import { useAuthStore } from './authStore'
import type { Board, BoardSummary, CreateBoardInput, UpdateBoardInput } from '@/types'

interface BoardsState {
  // State
  boards: BoardSummary[]
  isLoading: boolean
  error: string | null

  // Actions
  setBoards: (boards: BoardSummary[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  fetchBoards: () => Promise<void>
  createBoard: (input: CreateBoardInput) => Promise<Board>
  updateBoard: (id: string, input: UpdateBoardInput) => Promise<void>
  deleteBoard: (id: string) => Promise<void>
  clearError: () => void
}

export const useBoardsStore = create<BoardsState>((set, get) => ({
  // Initial state
  boards: [],
  isLoading: false,
  error: null,

  // Actions
  setBoards: (boards) =>
    set({
      boards,
      error: null,
    }),

  setLoading: (loading) =>
    set({
      isLoading: loading,
    }),

  setError: (error) =>
    set({
      error,
      isLoading: false,
    }),

  fetchBoards: async () => {
    set({ isLoading: true, error: null })

    try {
      const userId = useAuthStore.getState().user?.id
      if (!userId) {
        throw new Error('User not authenticated')
      }

      const boards = await boardRepository.getAllByUserId(userId)

      // Convert to BoardSummary (we'll need to fetch counts separately or via SQL)
      const boardSummaries: BoardSummary[] = boards.map((board) => ({
        ...board,
        listCount: 0, // TODO: Add aggregate counts in repository query
        cardCount: 0,
      }))

      set({
        boards: boardSummaries,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch boards',
        isLoading: false,
      })
    }
  },

  createBoard: async (input) => {
    set({ isLoading: true, error: null })

    try {
      const userId = useAuthStore.getState().user?.id
      if (!userId) {
        throw new Error('User not authenticated')
      }

      const newBoard = await boardRepository.create({
        ...input,
        ownerId: userId,
      })

      const newSummary: BoardSummary = {
        ...newBoard,
        listCount: 0,
        cardCount: 0,
      }

      set({
        boards: [newSummary, ...get().boards],
        isLoading: false,
        error: null,
      })

      return newBoard
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create board',
        isLoading: false,
      })
      throw error
    }
  },

  updateBoard: async (id, input) => {
    set({ isLoading: true, error: null })

    try {
      const updatedBoard = await boardRepository.update(id, input)

      set({
        boards: get().boards.map((board) =>
          board.id === id ? { ...board, ...updatedBoard } : board
        ),
        isLoading: false,
        error: null,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update board',
        isLoading: false,
      })
      throw error
    }
  },

  deleteBoard: async (id) => {
    set({ isLoading: true, error: null })

    try {
      await boardRepository.delete(id)

      set({
        boards: get().boards.filter((board) => board.id !== id),
        isLoading: false,
        error: null,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete board',
        isLoading: false,
      })
      throw error
    }
  },

  clearError: () => {
    set({ error: null })
  },
}))
