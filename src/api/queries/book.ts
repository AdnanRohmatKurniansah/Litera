import { useQuery } from '@tanstack/react-query'
import apiClient from '../../lib/axios'
import { API_ENDPOINTS } from '../endpoint'
import type { Book } from '@/types'


interface UseBooksParams {
  page?: number
  limit?: number
}

interface UseBooksFilterParams {
  keyword?: string
  category?: string
  language?: string
  minPrice?: number
  maxPrice?: number
  page?: number
  sortBy?: string
  limit?: number
}

interface UseOtherBooksParams {
  bookId?: string
  page?: number
  limit?: number
}

export function useBooks({ page = 1, limit = 10 }: UseBooksParams = {}) {
  return useQuery({
    queryKey: ['books', page, limit],
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.BOOKS.LIST, {
        params: { page, limit }
      })
      return data.data
    },
    staleTime: 30000, 
  })
}

export function useBooksFilter({ keyword, category, language, minPrice, maxPrice, page = 1, limit = 20, sortBy }: UseBooksFilterParams = {}) {
  return useQuery({
    queryKey: ['books-filter', keyword, category, language, minPrice, maxPrice, page, limit, sortBy], 
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.BOOKS.FILTER, {
        params: { keyword, category, language, minPrice, maxPrice, page, limit, sortBy }
      })
      return data.data
    },
    staleTime: 30000,
  })
}

export function useBooksDiscounted() {
  return useQuery({
    queryKey: ['books-discounted'],
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.BOOKS.DISCOUNTED)
      return data.data
    },
    staleTime: 30000, 
  })
}

export function useBooksDetail(slug: string) {
  return useQuery<{ data: Book }>({
    queryKey: ['book', slug],
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.BOOKS.DETAIL(slug))
      return data
    },
    enabled: !!slug,
  })
}

export function useOtherBooks({ bookId, page = 1, limit = 10 }: UseOtherBooksParams = {}) {
  return useQuery({
    queryKey: ['other-books', bookId, page, limit],
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.BOOKS.OTHER(bookId!), {
        params: { page, limit }
      })
      return data.data
    },
    enabled: !!bookId,
    staleTime: 30000, 
  })
}