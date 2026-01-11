/**
 * Application routes
 * Centralized route definitions
 */

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  BOARDS: '/boards',
  BOARD: '/board/:id',
  NOT_FOUND: '*',
} as const

/**
 * Generate board route with ID
 */
export function getBoardRoute(id: string): string {
  return `/board/${id}`
}

/**
 * Check if route requires authentication
 */
export function isProtectedRoute(path: string): boolean {
  const protectedRoutes = [ROUTES.BOARDS, '/board']
  return protectedRoutes.some((route) => path.startsWith(route))
}
