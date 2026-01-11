/**
 * Application configuration constants
 */

// Validation constraints
export const VALIDATION = {
  BOARD_NAME_MIN_LENGTH: 3,
  BOARD_NAME_MAX_LENGTH: 100,
  LIST_TITLE_MIN_LENGTH: 2,
  LIST_TITLE_MAX_LENGTH: 50,
  CARD_TITLE_MIN_LENGTH: 3,
  CARD_TITLE_MAX_LENGTH: 200,
  CARD_DESCRIPTION_MAX_LENGTH: 5000,
  PASSWORD_MIN_LENGTH: 8,
  MAX_LISTS_PER_BOARD: 10,
} as const

// Priority levels
export const PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const

// Priority labels for UI
export const PRIORITY_LABELS: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

// Priority colors for Tailwind
export const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
}

// Debounce delays (ms)
export const DEBOUNCE_DELAY = {
  SEARCH: 300,
  AUTO_SAVE: 1000,
} as const

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const
