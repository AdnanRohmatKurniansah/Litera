import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/lib/axios'
import { API_ENDPOINTS } from '../endpoint'

interface AddCartPayload {
  bookId: string
  qty: number
}

export function useCart(enabled: boolean) {
  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.CART.LIST)
      return data.data
    },
    enabled, 
  })
}

export function useAddCart() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ bookId, qty }: AddCartPayload) => {
      const { data } = await apiClient.post(API_ENDPOINTS.CART.ADD, { bookId, qty })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}

export function useDeleteCart() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (cartItemId: string) => {
      const { data } = await apiClient.delete(
        API_ENDPOINTS.CART.DELETE(cartItemId)
      )
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}