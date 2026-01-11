/**
 * Database types for Mini Kanban
 * Auto-generated types that match Supabase schema
 */

export type Priority = 'low' | 'medium' | 'high'

export type ChangeType = 'created' | 'updated' | 'moved' | 'deleted'

// Database row types (what we get from DB)
export interface DbUser {
  id: string
  email: string
  created_at: string
}

export interface DbProfile {
  id: string
  email: string
  display_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface DbBoard {
  id: string
  name: string
  owner_id: string
  created_at: string
  updated_at: string
}

export interface DbList {
  id: string
  title: string
  board_id: string
  position: number
  created_at: string
  updated_at: string
}

export interface DbCard {
  id: string
  title: string
  description: string | null
  list_id: string
  priority: Priority
  position: number
  created_at: string
  updated_at: string
}

export interface DbCardHistory {
  id: string
  card_id: string
  user_id: string
  change_type: ChangeType
  old_data: Record<string, unknown> | null
  new_data: Record<string, unknown> | null
  changed_at: string
}

// Insert types (what we send to DB when creating)
export type InsertBoard = Omit<DbBoard, 'id' | 'created_at' | 'updated_at'>
export type InsertList = Omit<DbList, 'id' | 'created_at' | 'updated_at'>
export type InsertCard = Omit<DbCard, 'id' | 'created_at' | 'updated_at'>

// Update types (what we send when updating)
export type UpdateBoard = Partial<Omit<DbBoard, 'id' | 'owner_id' | 'created_at' | 'updated_at'>>
export type UpdateList = Partial<Omit<DbList, 'id' | 'board_id' | 'created_at' | 'updated_at'>>
export type UpdateCard = Partial<Omit<DbCard, 'id' | 'created_at' | 'updated_at'>>

// Supabase response types
export interface SupabaseResponse<T> {
  data: T | null
  error: Error | null
}

export interface SupabaseListResponse<T> {
  data: T[] | null
  error: Error | null
}
