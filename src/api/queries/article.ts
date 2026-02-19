import { useQuery} from '@tanstack/react-query'
import type { Article } from '../../types'
import apiClient from '../../lib/axios'
import { API_ENDPOINTS } from '../endpoint'


interface UseArticlesParams {
  page?: number
  limit?: number
}

export function useArticles({ page = 1, limit = 10 }: UseArticlesParams = {}) {
  return useQuery({
    queryKey: ['articles', page, limit],
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.ARTICLES.LIST, {
        params: { page, limit }
      })
      return data.data
    },
    staleTime: 30000, 
  })
}

export function useArticleDetail(slug: string) {
  return useQuery<{ data: Article }>({
    queryKey: ['article', slug],
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.ARTICLES.DETAIL(slug))
      return data
    },
    enabled: !!slug,
  })
}