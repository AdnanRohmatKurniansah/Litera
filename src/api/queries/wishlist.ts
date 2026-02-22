import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/lib/axios'
import { API_ENDPOINTS } from '../endpoint'

export function useWishlist(enabled: boolean) {
  return useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.WISHLIST.LIST)
      return data.data
    },
    enabled, 
  })
}

export function useAddWishlist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (bookId: string) => {
      const { data } = await apiClient.post(API_ENDPOINTS.WISHLIST.ADD, { bookId })
      return data
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
      return res
    },
  })
}

export function useDeleteWishlist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (wishlistItemId: string) => {
      const { data } = await apiClient.delete(
        API_ENDPOINTS.WISHLIST.DELETE(wishlistItemId)
      )
      return data
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
      return res
    },
  })
}