/**
 * Board Mapper Tests
 */

import { describe, it, expect } from 'vitest'
import { dbBoardToDomain, dbBoardsToDomain, createBoardToDb, updateBoardToDb } from './boardMapper'
import type { DbBoard } from '@/types/database.types'
import type { CreateBoardInput, UpdateBoardInput } from '@/types/domain.types'

describe('boardMapper', () => {
  describe('dbBoardToDomain', () => {
    it('converts database board to domain board', () => {
      const dbBoard: DbBoard = {
        id: '123',
        name: 'Test Board',
        owner_id: 'user-123',
        created_at: '2024-01-10T10:00:00Z',
        updated_at: '2024-01-10T11:00:00Z',
      }

      const result = dbBoardToDomain(dbBoard)

      expect(result).toEqual({
        id: '123',
        name: 'Test Board',
        ownerId: 'user-123',
        createdAt: new Date('2024-01-10T10:00:00Z'),
        updatedAt: new Date('2024-01-10T11:00:00Z'),
      })
    })

    it('converts snake_case to camelCase', () => {
      const dbBoard: DbBoard = {
        id: '123',
        name: 'Test',
        owner_id: 'user-123',
        created_at: '2024-01-10T10:00:00Z',
        updated_at: '2024-01-10T11:00:00Z',
      }

      const result = dbBoardToDomain(dbBoard)

      expect(result).toHaveProperty('ownerId')
      expect(result).toHaveProperty('createdAt')
      expect(result).toHaveProperty('updatedAt')
      expect(result).not.toHaveProperty('owner_id')
      expect(result).not.toHaveProperty('created_at')
      expect(result).not.toHaveProperty('updated_at')
    })

    it('converts ISO strings to Date objects', () => {
      const dbBoard: DbBoard = {
        id: '123',
        name: 'Test',
        owner_id: 'user-123',
        created_at: '2024-01-10T10:00:00Z',
        updated_at: '2024-01-10T11:00:00Z',
      }

      const result = dbBoardToDomain(dbBoard)

      expect(result.createdAt).toBeInstanceOf(Date)
      expect(result.updatedAt).toBeInstanceOf(Date)
    })
  })

  describe('dbBoardsToDomain', () => {
    it('converts array of database boards', () => {
      const dbBoards: DbBoard[] = [
        {
          id: '1',
          name: 'Board 1',
          owner_id: 'user-1',
          created_at: '2024-01-10T10:00:00Z',
          updated_at: '2024-01-10T11:00:00Z',
        },
        {
          id: '2',
          name: 'Board 2',
          owner_id: 'user-1',
          created_at: '2024-01-10T10:00:00Z',
          updated_at: '2024-01-10T11:00:00Z',
        },
      ]

      const result = dbBoardsToDomain(dbBoards)

      expect(result).toHaveLength(2)
      expect(result[0].id).toBe('1')
      expect(result[1].id).toBe('2')
    })

    it('returns empty array for empty input', () => {
      const result = dbBoardsToDomain([])
      expect(result).toEqual([])
    })
  })

  describe('createBoardToDb', () => {
    it('converts create input to database format', () => {
      const input: CreateBoardInput = {
        name: 'New Board',
      }

      const result = createBoardToDb(input, 'user-123')

      expect(result).toEqual({
        name: 'New Board',
        owner_id: 'user-123',
      })
    })

    it('uses provided owner ID', () => {
      const input: CreateBoardInput = {
        name: 'New Board',
      }

      const result = createBoardToDb(input, 'different-user')

      expect(result.owner_id).toBe('different-user')
    })
  })

  describe('updateBoardToDb', () => {
    it('converts update input to database format', () => {
      const input: UpdateBoardInput = {
        name: 'Updated Board',
      }

      const result = updateBoardToDb(input)

      expect(result).toEqual({
        name: 'Updated Board',
      })
    })

    it('omits undefined fields', () => {
      const input: UpdateBoardInput = {}

      const result = updateBoardToDb(input)

      expect(result).toEqual({})
      expect(Object.keys(result)).toHaveLength(0)
    })

    it('includes only defined fields', () => {
      const input: UpdateBoardInput = {
        name: 'New Name',
      }

      const result = updateBoardToDb(input)

      expect(result).toHaveProperty('name')
      expect(Object.keys(result)).toHaveLength(1)
    })
  })
})
