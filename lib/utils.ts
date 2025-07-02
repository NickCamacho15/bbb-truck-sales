import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Utility function to add consistent hover effects and cursor styling for clickable elements
 * @param additionalClasses - Additional Tailwind classes to merge with the clickable styles
 * @returns String of CSS classes for clickable elements
 */
export function clickable(...additionalClasses: ClassValue[]) {
  return cn(
    "cursor-pointer transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]",
    ...additionalClasses
  )
}
