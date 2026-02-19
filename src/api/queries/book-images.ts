import { useQuery } from '@tanstack/react-query'
import apiClient from '../../lib/axios'
import { API_ENDPOINTS } from '../endpoint'


interface UseBookImagesParams {
  page?: number
  limit?: number
}

export function useBookImages(bookId: string, { page = 1, limit = 10 }: UseBookImagesParams = {}) {
  return useQuery({
    queryKey: ['book_images', bookId, page, limit],
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.BOOK_IMAGES.LIST(bookId), {
        params: { page, limit }
      })
      return data
    },
    staleTime: 30000, 
    enabled: !!bookId,
  })
}