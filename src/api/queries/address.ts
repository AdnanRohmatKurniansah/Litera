import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/lib/axios'
import { API_ENDPOINTS } from '../endpoint'
import type { Address } from '@/types'
import type { AddressCreateInput, AddressUpdateInput } from '@/lib/schema/address.schema'

export function useAddress() {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.ADDRESSES.LIST)
      return data.data
    },
  })
}

export function useAddressDetail(id: string) {
  return useQuery<{ data: Address }>({
    queryKey: ['address', id],
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.ADDRESSES.DETAIL(id))
      return data
    },
    enabled: !!id,
  })
}

export function useAddressCreate() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (payload: AddressCreateInput) => {
      const response = await apiClient.post(API_ENDPOINTS.ADDRESSES.CREATE, payload)
      return response.data
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      return res
    },
  })
}

export function useAddressUpdate() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: AddressUpdateInput}) => {
      const response = await apiClient.put(API_ENDPOINTS.ADDRESSES.UPDATE(id), payload)
      return response.data
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      queryClient.invalidateQueries({ queryKey: ['address'] })
      return res
    },
  })
}

export function useAddressUpdatePrimary() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id }: { id: string}) => {
      const response = await apiClient.put(API_ENDPOINTS.ADDRESSES.UPDATE_PRIMARY(id))
      return response.data
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      queryClient.invalidateQueries({ queryKey: ['address'] })
      return res
    },
  })
}

export function useAddressDelete() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(API_ENDPOINTS.ADDRESSES.DELETE(id))
      return response.data
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      return res
    },
  })
}

export function useProvinces() {
  return useQuery({
    queryKey: ["rajaongkir", "provinces"],
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.ADDRESSES.PROVINCES)
      return data.data 
    },
    staleTime: Infinity,
  })
}

export function useCities(provinceId?: string) {
  return useQuery({
    queryKey: ["rajaongkir", "cities", provinceId],
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.ADDRESSES.CITIES(provinceId!))
      return data.data
    },
    enabled: !!provinceId,
    staleTime: Infinity,
  })
}

export function useDistricts(cityId?: string) {
  return useQuery({
    queryKey: ["rajaongkir", "districts", cityId],
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.ADDRESSES.DISTRICTS(cityId!))
      return data.data
    },
    enabled: !!cityId,
    staleTime: Infinity,
  })
}