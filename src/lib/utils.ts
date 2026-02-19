import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (
  date: string | Date,
  format: 'short' | 'medium' | 'long' | 'full' = 'short'
): string => {
  if (!date) return '-'

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date

    if (isNaN(dateObj.getTime())) {
      return '-'
    }

    switch (format) {
      case 'short':
        return dateObj.toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })

      case 'medium':
        return dateObj.toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })

      case 'long':
        return dateObj.toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })

      case 'full':
        return dateObj.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })

      default:
        return dateObj.toLocaleDateString('id-ID')
    }
  } catch (error) {
    console.error('Error formatting date:', error)
    return '-'
  }
}

export const stripHtml = (html: string): string => {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return doc.body.textContent ?? ''
}