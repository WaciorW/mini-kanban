/**
 * Repository interfaces and types
 * Generic patterns for data access layer
 */

import type { FilterOptions } from '@/types'

// Generic repository interface
export interface IRepository<T, TCreate, TUpdate> {
  /**
   * Get all items with optional filtering
   */
  getAll(filters?: FilterOptions): Promise<T[]>

  /**
   * Get single item by ID
   */
  getById(id: string): Promise<T | null>

  /**
   * Create new item
   */
  create(data: TCreate): Promise<T>

  /**
   * Update existing item
   */
  update(id: string, data: TUpdate): Promise<T>

  /**
   * Delete item by ID
   */
  delete(id: string): Promise<void>
}

// Repository error types
export class RepositoryError extends Error {
  code?: string
  details?: unknown

  constructor(message: string, code?: string, details?: unknown) {
    super(message)
    this.name = 'RepositoryError'
    this.code = code
    this.details = details
  }
}

export class NotFoundError extends RepositoryError {
  constructor(resource: string, id: string) {
    super(`${resource} with id ${id} not found`, 'NOT_FOUND')
    this.name = 'NotFoundError'
  }
}

export class ValidationError extends RepositoryError {
  errors?: Record<string, string[]>

  constructor(message: string, errors?: Record<string, string[]>) {
    super(message, 'VALIDATION_ERROR', errors)
    this.name = 'ValidationError'
    this.errors = errors
  }
}

export class UnauthorizedError extends RepositoryError {
  constructor(message = 'Unauthorized access') {
    super(message, 'UNAUTHORIZED')
    this.name = 'UnauthorizedError'
  }
}
