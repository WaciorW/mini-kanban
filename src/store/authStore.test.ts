/**
 * Auth Store Tests
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from './authStore'

describe('authStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    })
  })

  describe('initial state', () => {
    it('has no user initially', () => {
      const { user } = useAuthStore.getState()
      expect(user).toBeNull()
    })

    it('is not authenticated initially', () => {
      const { isAuthenticated } = useAuthStore.getState()
      expect(isAuthenticated).toBe(false)
    })

    it('is not loading initially', () => {
      const { isLoading } = useAuthStore.getState()
      expect(isLoading).toBe(false)
    })

    it('has no error initially', () => {
      const { error } = useAuthStore.getState()
      expect(error).toBeNull()
    })
  })

  describe('setUser', () => {
    it('sets user and marks as authenticated', () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
      }

      useAuthStore.getState().setUser(mockUser)

      const { user, isAuthenticated } = useAuthStore.getState()
      expect(user).toEqual(mockUser)
      expect(isAuthenticated).toBe(true)
    })

    it('clears authentication when user is null', () => {
      useAuthStore.getState().setUser(null)

      const { user, isAuthenticated } = useAuthStore.getState()
      expect(user).toBeNull()
      expect(isAuthenticated).toBe(false)
    })
  })

  describe('setLoading', () => {
    it('sets loading state', () => {
      useAuthStore.getState().setLoading(true)
      expect(useAuthStore.getState().isLoading).toBe(true)

      useAuthStore.getState().setLoading(false)
      expect(useAuthStore.getState().isLoading).toBe(false)
    })
  })

  describe('setError', () => {
    it('sets error and stops loading', () => {
      useAuthStore.setState({ isLoading: true })

      useAuthStore.getState().setError('Test error')

      const { error, isLoading } = useAuthStore.getState()
      expect(error).toBe('Test error')
      expect(isLoading).toBe(false)
    })
  })

  describe('clearError', () => {
    it('clears error', () => {
      useAuthStore.setState({ error: 'Test error' })

      useAuthStore.getState().clearError()

      expect(useAuthStore.getState().error).toBeNull()
    })
  })

  describe('logout', () => {
    it('clears user and authentication', () => {
      useAuthStore.setState({
        user: { id: '1', email: 'test@example.com' },
        isAuthenticated: true,
      })

      useAuthStore.getState().logout()

      const { user, isAuthenticated, error } = useAuthStore.getState()
      expect(user).toBeNull()
      expect(isAuthenticated).toBe(false)
      expect(error).toBeNull()
    })
  })

  describe('login', () => {
    it('sets loading state during login', async () => {
      const loginPromise = useAuthStore.getState().login('test@example.com', 'password')

      expect(useAuthStore.getState().isLoading).toBe(true)

      await loginPromise
    })

    it('sets user after successful login', async () => {
      await useAuthStore.getState().login('test@example.com', 'password')

      const { user, isAuthenticated, isLoading } = useAuthStore.getState()
      expect(user).toBeDefined()
      expect(user?.email).toBe('test@example.com')
      expect(isAuthenticated).toBe(true)
      expect(isLoading).toBe(false)
    })
  })

  describe('register', () => {
    it('sets loading state during registration', async () => {
      const registerPromise = useAuthStore.getState().register('test@example.com', 'password')

      expect(useAuthStore.getState().isLoading).toBe(true)

      await registerPromise
    })

    it('sets user after successful registration', async () => {
      await useAuthStore.getState().register('test@example.com', 'password')

      const { user, isAuthenticated, isLoading } = useAuthStore.getState()
      expect(user).toBeDefined()
      expect(user?.email).toBe('test@example.com')
      expect(isAuthenticated).toBe(true)
      expect(isLoading).toBe(false)
    })
  })
})
