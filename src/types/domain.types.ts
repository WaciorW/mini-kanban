/**
 * Domain types for Mini Kanban
 * Application-level types that may differ from database schema
 */

import type { Priority } from './database.types'

// User domain model
export interface User {
  id: string
  email: string
  displayName?: string
  avatarUrl?: string
}

// Board domain model (with nested lists and cards for full data)
export interface Board {
  id: string
  name: string
  ownerId: string
  createdAt: Date
  updatedAt: Date
  lists?: List[]
}

// List domain model (column)
export interface List {
  id: string
  title: string
  boardId: string
  position: number
  createdAt: Date
  updatedAt: Date
  cards?: Card[]
}

// Card domain model (task)
export interface Card {
  id: string
  title: string
  description?: string
  listId: string
  priority: Priority
  position: number
  createdAt: Date
  updatedAt: Date
}

// Lightweight versions for lists (without nested data)
export interface BoardSummary {
  id: string
  name: string
  ownerId: string
  updatedAt: Date
  listCount?: number
  cardCount?: number
}

// Form input types
export interface CreateBoardInput {
  name: string
  ownerId?: string // Optional for form, required by repository
}

export interface UpdateBoardInput {
  name?: string
}

export interface CreateListInput {
  title: string
  boardId: string
  position?: number
}

export interface UpdateListInput {
  title?: string
  position?: number
}

export interface CreateCardInput {
  title: string
  description?: string
  listId: string
  priority?: Priority
  position?: number
}

export interface UpdateCardInput {
  title?: string
  description?: string
  listId?: string
  priority?: Priority
  position?: number
}

export interface MoveCardInput {
  cardId: string
  targetListId: string
  targetPosition: number
}

// Filter types
export interface CardFilters {
  priority?: Priority
  searchQuery?: string
}

export interface FilterOptions {
  searchQuery?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// Validation errors
export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
}
