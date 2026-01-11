/**
 * Board Store
 * State for single board view (lists, cards, filters) with Supabase integration
 */

import { create } from 'zustand'
import { boardRepository } from '@/lib/repositories/boardRepository'
import { listRepository } from '@/lib/repositories/listRepository'
import { cardRepository } from '@/lib/repositories/cardRepository'
import type {
  Board,
  List,
  Card,
  CreateListInput,
  UpdateListInput,
  CreateCardInput,
  UpdateCardInput,
  CardFilters,
} from '@/types'

interface BoardState {
  // State
  board: Board | null
  lists: List[]
  cards: Card[]
  filters: CardFilters
  isLoading: boolean
  error: string | null

  // Computed getters
  getFilteredCards: (listId: string) => Card[]
  getCardsByListId: (listId: string) => Card[]

  // Board actions
  setBoard: (board: Board | null) => void
  fetchBoard: (id: string) => Promise<void>

  // List actions
  createList: (input: CreateListInput) => Promise<void>
  updateList: (id: string, input: UpdateListInput) => Promise<void>
  deleteList: (id: string) => Promise<void>

  // Card actions
  createCard: (input: CreateCardInput) => Promise<void>
  updateCard: (id: string, input: UpdateCardInput) => Promise<void>
  deleteCard: (id: string) => Promise<void>
  moveCard: (cardId: string, targetListId: string, targetPosition: number) => Promise<void>

  // Filter actions
  setFilters: (filters: Partial<CardFilters>) => void
  clearFilters: () => void

  // Utility actions
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  reset: () => void
}

export const useBoardStore = create<BoardState>((set, get) => ({
  // Initial state
  board: null,
  lists: [],
  cards: [],
  filters: {},
  isLoading: false,
  error: null,

  // Computed getters
  getFilteredCards: (listId) => {
    const { cards, filters } = get()
    let filtered = cards.filter((card) => card.listId === listId)

    // Apply priority filter
    if (filters.priority) {
      filtered = filtered.filter((card) => card.priority === filters.priority)
    }

    // Apply search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      filtered = filtered.filter(
        (card) =>
          card.title.toLowerCase().includes(query) ||
          card.description?.toLowerCase().includes(query)
      )
    }

    // Sort by position
    return filtered.sort((a, b) => a.position - b.position)
  },

  getCardsByListId: (listId) => {
    return get()
      .cards.filter((card) => card.listId === listId)
      .sort((a, b) => a.position - b.position)
  },

  // Board actions
  setBoard: (board) =>
    set({
      board,
      error: null,
    }),

  fetchBoard: async (id) => {
    set({ isLoading: true, error: null })

    try {
      const board = await boardRepository.getByIdWithData(id)

      if (!board) {
        throw new Error('Board not found')
      }

      set({
        board,
        lists: board.lists || [],
        cards: board.lists?.flatMap((list) => list.cards || []) || [],
        isLoading: false,
        error: null,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch board',
        isLoading: false,
      })
    }
  },

  // List actions
  createList: async (input) => {
    set({ isLoading: true, error: null })

    try {
      const newList = await listRepository.create(input)

      set({
        lists: [...get().lists, newList],
        isLoading: false,
        error: null,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create list',
        isLoading: false,
      })
      throw error
    }
  },

  updateList: async (id, input) => {
    set({ isLoading: true, error: null })

    try {
      const updatedList = await listRepository.update(id, input)

      set({
        lists: get().lists.map((list) => (list.id === id ? updatedList : list)),
        isLoading: false,
        error: null,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update list',
        isLoading: false,
      })
      throw error
    }
  },

  deleteList: async (id) => {
    set({ isLoading: true, error: null })

    try {
      await listRepository.delete(id)

      // Cards are cascade deleted by the database
      set({
        lists: get().lists.filter((list) => list.id !== id),
        cards: get().cards.filter((card) => card.listId !== id),
        isLoading: false,
        error: null,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete list',
        isLoading: false,
      })
      throw error
    }
  },

  // Card actions
  createCard: async (input) => {
    set({ isLoading: true, error: null })

    try {
      const newCard = await cardRepository.create(input)

      set({
        cards: [...get().cards, newCard],
        isLoading: false,
        error: null,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create card',
        isLoading: false,
      })
      throw error
    }
  },

  updateCard: async (id, input) => {
    set({ isLoading: true, error: null })

    try {
      const updatedCard = await cardRepository.update(id, input)

      set({
        cards: get().cards.map((card) => (card.id === id ? updatedCard : card)),
        isLoading: false,
        error: null,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update card',
        isLoading: false,
      })
      throw error
    }
  },

  deleteCard: async (id) => {
    set({ isLoading: true, error: null })

    try {
      await cardRepository.delete(id)

      set({
        cards: get().cards.filter((card) => card.id !== id),
        isLoading: false,
        error: null,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete card',
        isLoading: false,
      })
      throw error
    }
  },

  moveCard: async (cardId, targetListId, targetPosition) => {
    set({ isLoading: true, error: null })

    try {
      const movedCard = await cardRepository.move(cardId, targetListId, targetPosition)

      set({
        cards: get().cards.map((card) => (card.id === cardId ? movedCard : card)),
        isLoading: false,
        error: null,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to move card',
        isLoading: false,
      })
      throw error
    }
  },

  // Filter actions
  setFilters: (filters) =>
    set({
      filters: { ...get().filters, ...filters },
    }),

  clearFilters: () =>
    set({
      filters: {},
    }),

  // Utility actions
  setLoading: (loading) =>
    set({
      isLoading: loading,
    }),

  setError: (error) =>
    set({
      error,
      isLoading: false,
    }),

  clearError: () => {
    set({ error: null })
  },

  reset: () => {
    set({
      board: null,
      lists: [],
      cards: [],
      filters: {},
      isLoading: false,
      error: null,
    })
  },
}))
