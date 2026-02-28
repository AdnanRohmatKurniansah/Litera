import { Button } from "@/components/ui/button"
import { AxiosError } from "axios"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useGoogleLogin } from '@react-oauth/google'
import { useNavigate } from "react-router"
import apiClient from "@/lib/axios"
import { API_ENDPOINTS } from "@/api/endpoint"
import { useState } from "react"
import { useAuth } from "@/context/UserContext"

interface Props {
  isPending: boolean
}

export const GoogleSignInButton = ({ isPending }: Props) => {
  const { login } = useAuth() 
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const googleLogin = useGoogleLogin({
    flow: 'implicit',
    scope: 'openid email profile',
    onSuccess: async (tokenResponse) => {
      setIsLoading(true)
      try {
        const { data } = await apiClient.post(API_ENDPOINTS.AUTH.USER_GOOGLE_LOGIN, {
          access_token: tokenResponse.access_token,
        })

        await login(data.data.access_token, false)
        toast.success('Signed in with Google!')
        navigate('/account')
      } catch (error) {
        toast.error(
          error instanceof AxiosError
            ? error.response?.data?.message ?? 'Google login failed'
            : 'Google login failed'
        )
      } finally {
        setIsLoading(false)
      }
    },
    onError: () => toast.error('Google sign-in was cancelled or failed'),
  })

  const loading = isPending || isLoading

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full gap-2 h-10"
      onClick={() => googleLogin()}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin shrink-0" />
      ) : (
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google"
          className="w-4 h-4 shrink-0"
        />
      )}
      <span>{loading ? 'Signing in...' : 'Continue with Google'}</span>
    </Button>
  )
}