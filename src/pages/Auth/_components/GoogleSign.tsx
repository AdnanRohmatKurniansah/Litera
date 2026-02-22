import { Button } from "@/components/ui/button"
import { AxiosError } from "axios"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useGoogleLogin } from '@/api/queries/auth'
import { GoogleLogin } from '@react-oauth/google'
import { useNavigate } from "react-router"

interface Props {
  isPending: boolean
}

export const GoogleSignInButton = ({ isPending }: Props) => {
  const googleLoginMutation = useGoogleLogin()
  const navigate = useNavigate()

  const handleSuccess = async (credentialResponse: { credential?: string }) => {
    if (!credentialResponse.credential) {
      toast.error('Google login failed: no credential received')
      return
    }
    try {
      await googleLoginMutation.mutateAsync(credentialResponse.credential)
      toast.success('Signed in with Google!')
      navigate('/account')
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message ?? 'Google login failed')
      } else {
        toast.error('Google login failed')
      }
    }
  }

  return (
    <div className={`w-full flex text-center justify-center ${isPending || googleLoginMutation.isPending ? 'pointer-events-none opacity-50' : ''}`}>
      {googleLoginMutation.isPending ? (
        <Button type="button" variant="outline" className="w-full" disabled>
          <Loader2 className="size-4 animate-spin" />
          Signing in...
        </Button>
      ) : (
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => toast.error('Google sign-in was cancelled')}
          width="700px"
          shape="rectangular"
          size="large"
          text="continue_with"
          logo_alignment="center"
        />
      )}
    </div>
  )
}