import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/lib/axios'
import { API_ENDPOINTS } from '../endpoint'
import type { CheckoutPayload, ShippingCostPayload } from '@/lib/schema/order.schema'


export function useShippingCost() {
  return useMutation({
    mutationFn: async (payload: ShippingCostPayload) => {
      const { data } = await apiClient.post(API_ENDPOINTS.ORDERS.SHIPPING_COST, payload)
      return data.data
    },
  })
}

export function useCheckout() {
  return useMutation({
    mutationFn: async (payload: CheckoutPayload) => {
      const { data } = await apiClient.post(API_ENDPOINTS.ORDERS.CHECKOUT, payload)
      return data.data
    },
  })
}

export function useMyOrders(page = 1, limit = 10) {
  return useQuery({
    queryKey: ['my-orders', page, limit],
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.ORDERS.MY_LIST, {
        params: { page, limit }
      })
      return data.data
    },
  })
}

export function useOrderDetail(orderId: string) {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.ORDERS.DETAIL(orderId))
      return data.data
    },
    enabled: !!orderId,
  })
}

export function useArrivedOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (orderId: string) => {
      const { data } = await apiClient.patch(API_ENDPOINTS.ORDERS.ARRIVED(orderId))
      return data
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['my-orders'] })
      return res
    },
  })
}

export function useCancelOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (orderId: string) => {
      const { data } = await apiClient.patch(API_ENDPOINTS.ORDERS.CANCEL(orderId))
      return data
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['my-orders'] })
      return res
    },
  })
}

