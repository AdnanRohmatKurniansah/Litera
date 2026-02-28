import { useMutation, useQueryClient } from '@tanstack/react-query'
import { API_ENDPOINTS } from '../endpoint'
import apiClient from '../../lib/axios'
import { useAuth } from '@/context/UserContext'
import type { UserChangePasswordInput, UserLoginInput } from '@/lib/schema/auth.schema'

export function useUserLogin() {
  const { login } = useAuth()

  return useMutation({
    mutationFn: async (credentials: UserLoginInput) => {
      const { data } = await apiClient.post(API_ENDPOINTS.AUTH.USER_LOGIN, credentials)
      return data
    },
    onSuccess: async (res) => {
      await login(res.data.access_token, true)
      return res
    }
  })
}

export function useUserRegister() {
  return useMutation({
    mutationFn: async (credentials: UserLoginInput) => {
      const { data } = await apiClient.post(API_ENDPOINTS.AUTH.USER_REGISTER, credentials)
      return data
    },
    onSuccess: async (res) => {
      return res
    }
  })
}

export function useGoogleLogin() {
  const { login } = useAuth()

  return useMutation({
    mutationFn: async (access_token: string) => {
      const { data } = await apiClient.post(API_ENDPOINTS.AUTH.USER_GOOGLE_LOGIN, { access_token })
      return data
    },
    onSuccess: async (res) => {
      await login(res.data.access_token, true)
      return res
    }
  })
}

export function useLogout() {
  const { logout } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      await logout()
    },
    onSuccess: () => {
      queryClient.clear()
    },
  })
}


export function useUpdateProfile() {
  const { refetchProfile } = useAuth()

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await apiClient.post(
        API_ENDPOINTS.AUTH.USER_PROFILE_UPDATE,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      return data
    },
    onSuccess: async (res) => {
      await refetchProfile()
      return res
    }
  })
}

export function useChangePassword() {
  const { logout } = useAuth()

  return useMutation({
    mutationFn: async (payload: UserChangePasswordInput) => {
      const { data } = await apiClient.post(
        API_ENDPOINTS.AUTH.USER_CHANGE_PASSWORD,
        payload
      )
      return data
    },
    onSuccess: async (res) => {
      setTimeout(async () => {
        await logout()
      }, 2000)
      return res
    }
  })
}