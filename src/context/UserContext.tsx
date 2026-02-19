import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { CookieService } from '../services/cookie.service'
import { API_ENDPOINTS } from '../api/endpoint'
import apiClient from '../lib/axios'
import type { User } from '@/types'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  emailMethod: boolean
  login: (token: string, emailMethod: boolean) => Promise<void>
  logout: () => Promise<void>
  refetchProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const emailMethod = user?.provider == "Email"
  const isAuthenticated = Boolean(user)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const userToken = CookieService.getUserToken()

      if (!userToken && !userToken) {
        setIsLoading(false)
        return
      }

      const response = await apiClient.get(API_ENDPOINTS.AUTH.USER_PROFILE )
      setUser(response.data.data)
    } catch (error) {
      console.error('Auth check failed:', error)
      CookieService.clearAll()
    } finally {
      setIsLoading(false)
    }
  }

  const refetchProfile = async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.AUTH.USER_PROFILE)
      setUser(response.data.data)
    } catch (error) {
      console.error('Profile refetch failed:', error)
    }
  }

  const login = async (token: string, isUserLogin: boolean) => {
    if (isUserLogin) {
      CookieService.setUserToken(token)
    } else {
      CookieService.setUserToken(token)
    }
    await checkAuth()
  }

  const logout = async () => {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.USER_LOGOUT )
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      CookieService.clearAll()
      setUser(null)
      window.location.href = '/'
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        emailMethod,
        login,
        refetchProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}