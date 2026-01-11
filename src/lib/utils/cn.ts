/**
 * Utility for merging Tailwind CSS classes
 * Handles conditional classes and prevents conflicts
 */

type ClassValue = string | number | boolean | undefined | null | ClassValue[]

/**
 * Simple className utility
 * Combines multiple class names and filters out falsy values
 */
export function cn(...classes: ClassValue[]): string {
  return classes
    .flat()
    .filter((c): c is string | number => Boolean(c))
    .join(' ')
    .trim()
}
