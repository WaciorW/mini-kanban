/**
 * Supabase Database Types
 * Auto-generated types from Supabase schema
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      boards: {
        Row: {
          id: string
          name: string
          owner_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          owner_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          owner_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      lists: {
        Row: {
          id: string
          title: string
          board_id: string
          position: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          board_id: string
          position: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          board_id?: string
          position?: number
          created_at?: string
          updated_at?: string
        }
      }
      cards: {
        Row: {
          id: string
          title: string
          description: string | null
          list_id: string
          priority: 'low' | 'medium' | 'high'
          position: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          list_id: string
          priority?: 'low' | 'medium' | 'high'
          position: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          list_id?: string
          priority?: 'low' | 'medium' | 'high'
          position?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
