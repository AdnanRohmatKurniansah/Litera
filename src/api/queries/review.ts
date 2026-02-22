import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../../lib/axios'
import { API_ENDPOINTS } from '../endpoint'
import type { Review } from '@/types'
import type { CreateReviewType, UpdateReviewType } from '@/lib/schema/review.schema'


interface UseBookReviewParams {
  page?: number
  limit?: number
}

export function useBookReview(bookId: string, { page = 1, limit = 10 }: UseBookReviewParams = {}) {
  return useQuery({
    queryKey: ['book-review', bookId, page, limit],
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.REVIEWS.BOOK_REVIEWS(bookId), {
        params: { page, limit }
      })
      return data
    },
    staleTime: 30000, 
    enabled: !!bookId,
  })
}

export function useBookRating(bookId: string, { page = 1, limit = 10 }: UseBookReviewParams = {}) {
  return useQuery({
    queryKey: ['book-ratings', bookId, page, limit],
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.REVIEWS.BOOK_RATING(bookId), {
        params: { page, limit }
      })
      return data
    },
    staleTime: 30000, 
    enabled: !!bookId,
  })
}


export function useRatingDetail(ratingId: string) {
  return useQuery<{ data: Review }>({
    queryKey: ['review-detail', ratingId],
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.REVIEWS.DETAIL(ratingId))
      return data
    },
    enabled: !!ratingId,
  })
}

export function useMyReview(enabled: boolean) {
  return useQuery({
    queryKey: ['my-review'],
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.REVIEWS.MY_REVIEWS)
      return data.data
    },
    enabled, 
  })
}

export const useReviewCreate = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: CreateReviewType) => {
      const { data } = await apiClient.post(API_ENDPOINTS.REVIEWS.CREATE, payload)
      return data
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['book-review'] })
      return res
    },
  })
}

export const useBooksUpdate = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateReviewType }) => {
      const { data } = await apiClient.put(API_ENDPOINTS.REVIEWS.UPDATE(id), payload)
      return data
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['book-review'] })
      queryClient.invalidateQueries({ queryKey: ['review-detail'] })
      return res
    },
  })
}

export function useBooksDelete() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(API_ENDPOINTS.REVIEWS.DELETE(id))
      return response.data
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['book-review'] })
      return res
    },
  })
}