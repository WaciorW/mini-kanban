/**
 * Card Mapper
 * Transforms between database and domain types
 */

import type { DbCard, InsertCard, UpdateCard } from '@/types/database.types'
import type { Card, CreateCardInput, UpdateCardInput } from '@/types/domain.types'

/**
 * Convert database card to domain card
 */
export function dbCardToDomain(dbCard: DbCard): Card {
  return {
    id: dbCard.id,
    title: dbCard.title,
    description: dbCard.description ?? undefined,
    listId: dbCard.list_id,
    priority: dbCard.priority,
    position: dbCard.position,
    createdAt: new Date(dbCard.created_at),
    updatedAt: new Date(dbCard.updated_at),
  }
}

/**
 * Convert multiple database cards to domain cards
 */
export function dbCardsToDomain(dbCards: DbCard[]): Card[] {
  return dbCards.map(dbCardToDomain)
}

/**
 * Convert create card input to database insert format
 */
export function createCardToDb(input: CreateCardInput, position: number): InsertCard {
  return {
    title: input.title,
    description: input.description ?? null,
    list_id: input.listId,
    priority: input.priority ?? 'medium',
    position,
  }
}

/**
 * Convert update card input to database update format
 */
export function updateCardToDb(input: UpdateCardInput): UpdateCard {
  return {
    ...(input.title !== undefined && { title: input.title }),
    ...(input.description !== undefined && { description: input.description ?? null }),
    ...(input.listId !== undefined && { list_id: input.listId }),
    ...(input.priority !== undefined && { priority: input.priority }),
    ...(input.position !== undefined && { position: input.position }),
  }
}
