import { useQuery } from '@tanstack/react-query'
import apiClient from '../../lib/axios'
import { API_ENDPOINTS } from '../endpoint'
import type { Category } from '@/types'


interface UseCategoriesParams {
  page?: number
  limit?: number
}

export function useCategories({ page = 1, limit = 10 }: UseCategoriesParams = {}) {
  return useQuery({
    queryKey: ['categories', page, limit],
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.CATEGORIES.LIST, {
        params: { page, limit }
      })
      return data.data
    },
    staleTime: 30000, 
  })
}

export function useCategoriesDetail(slug: string) {
  return useQuery<{ data: Category }>({
    queryKey: ['category', slug],
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.CATEGORIES.DETAIL(slug))
      return data
    },
    enabled: !!slug,
  })
}