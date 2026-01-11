/**
 * Auth Store
 * Global authentication state management with Supabase
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/lib/supabase/client'
import type { User } from '@/types'

interface AuthState {
  // State
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // Actions
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
  restoreSession: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
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

      login: async (email, password) => {
        set({ isLoading: true, error: null })

        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          })

          if (error) {
            throw error
          }

          if (!data.user) {
            throw new Error('No user data returned')
          }

          const user: User = {
            id: data.user.id,
            email: data.user.email!,
            displayName: data.user.user_metadata?.displayName || data.user.email!.split('@')[0],
          }

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
        } catch (error: any) {
          set({
            error: error.message || 'Login failed',
            isLoading: false,
          })
        }
      },

      register: async (email, password) => {
        set({ isLoading: true, error: null })

        try {
          console.log('Attempting registration with:', email)
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          })

          console.log('Registration response:', { data, error })

          if (error) {
            console.error('Registration error:', error)
            throw error
          }

          if (!data.user) {
            throw new Error('No user data returned')
          }

          const user: User = {
            id: data.user.id,
            email: data.user.email!,
            displayName: data.user.user_metadata?.displayName || data.user.email!.split('@')[0],
          }

          console.log('User created successfully:', user)

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
        } catch (error: any) {
          console.error('Registration failed:', error)
          set({
            error: error.message || 'Registration failed',
            isLoading: false,
          })
        }
      },

      logout: async () => {
        try {
          await supabase.auth.signOut()
          set({
            user: null,
            isAuthenticated: false,
            error: null,
          })
        } catch (error: any) {
          set({
            error: error.message || 'Logout failed',
          })
        }
      },

      clearError: () => {
        set({ error: null })
      },

      restoreSession: async () => {
        try {
          const { data, error } = await supabase.auth.getSession()

          if (error) {
            throw error
          }

          if (data.session?.user) {
            const user: User = {
              id: data.session.user.id,
              email: data.session.user.email!,
              displayName:
                data.session.user.user_metadata?.displayName ||
                data.session.user.email!.split('@')[0],
            }

            set({
              user,
              isAuthenticated: true,
            })
          }
        } catch (error: any) {
          set({
            user: null,
            isAuthenticated: false,
          })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
