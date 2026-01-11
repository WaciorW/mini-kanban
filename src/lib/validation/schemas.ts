/**
 * Validation Schemas
 * Zod schemas for all forms
 */

import { z } from 'zod'
import { VALIDATION } from '@/lib/constants'

// Board schemas
export const createBoardSchema = z.object({
  name: z
    .string()
    .min(VALIDATION.BOARD_NAME_MIN_LENGTH, {
      message: `Board name must be at least ${VALIDATION.BOARD_NAME_MIN_LENGTH} characters`,
    })
    .max(VALIDATION.BOARD_NAME_MAX_LENGTH, {
      message: `Board name must be at most ${VALIDATION.BOARD_NAME_MAX_LENGTH} characters`,
    })
    .trim(),
})

export const updateBoardSchema = createBoardSchema.partial()

export type CreateBoardFormData = z.infer<typeof createBoardSchema>
export type UpdateBoardFormData = z.infer<typeof updateBoardSchema>

// List schemas
export const createListSchema = z.object({
  title: z
    .string()
    .min(VALIDATION.LIST_TITLE_MIN_LENGTH, {
      message: `List title must be at least ${VALIDATION.LIST_TITLE_MIN_LENGTH} characters`,
    })
    .max(VALIDATION.LIST_TITLE_MAX_LENGTH, {
      message: `List title must be at most ${VALIDATION.LIST_TITLE_MAX_LENGTH} characters`,
    })
    .trim(),
})

export const updateListSchema = createListSchema.partial()

export type CreateListFormData = z.infer<typeof createListSchema>
export type UpdateListFormData = z.infer<typeof updateListSchema>

// Card schemas
export const createCardSchema = z.object({
  title: z
    .string()
    .min(VALIDATION.CARD_TITLE_MIN_LENGTH, {
      message: `Card title must be at least ${VALIDATION.CARD_TITLE_MIN_LENGTH} characters`,
    })
    .max(VALIDATION.CARD_TITLE_MAX_LENGTH, {
      message: `Card title must be at most ${VALIDATION.CARD_TITLE_MAX_LENGTH} characters`,
    })
    .trim(),
  description: z
    .string()
    .max(VALIDATION.CARD_DESCRIPTION_MAX_LENGTH, {
      message: `Description must be at most ${VALIDATION.CARD_DESCRIPTION_MAX_LENGTH} characters`,
    })
    .optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
})

export const updateCardSchema = createCardSchema.partial()

export type CreateCardFormData = z.infer<typeof createCardSchema>
export type UpdateCardFormData = z.infer<typeof updateCardSchema>

// Auth schemas
export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please enter a valid email address' })
    .trim(),
  password: z
    .string()
    .min(VALIDATION.PASSWORD_MIN_LENGTH, {
      message: `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`,
    }),
})

export const registerSchema = z
  .object({
    email: z
      .string()
      .email({ message: 'Please enter a valid email address' })
      .trim(),
    password: z
      .string()
      .min(VALIDATION.PASSWORD_MIN_LENGTH, {
        message: `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`,
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>

/**
 * Helper to validate data with a schema
 */
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean
  data?: T
  errors?: Record<string, string>
} {
  const result = schema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  const errors: Record<string, string> = {}
  result.error.issues.forEach((issue) => {
    const path = issue.path.join('.')
    errors[path] = issue.message
  })

  return { success: false, errors }
}
