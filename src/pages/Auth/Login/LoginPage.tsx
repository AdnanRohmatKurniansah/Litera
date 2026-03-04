import { Button } from '@/components/ui/button'
import { Label } from '@radix-ui/react-dropdown-menu'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageMetadata } from '@/components/common/PageMetadata'
import { AxiosError } from 'axios'
import { UserLoginSchema, type UserRegisterInput } from '@/lib/schema/auth.schema'
import { useUserLogin } from '@/api/queries/auth'
import { useNavigate, Link } from 'react-router'
import { EyeClosedIcon, EyeIcon, Facebook, Instagram, Youtube } from 'lucide-react';
import { GoogleOAuthProvider } from '@react-oauth/google'
import { GoogleSignInButton } from '../_components/GoogleSign'

const LoginPage = () => {
  PageMetadata({ title: "Login Your Account | Litera" })

  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserRegisterInput>({
    resolver: zodResolver(UserLoginSchema),
  })

  const loginMutation = useUserLogin()

  const onSubmit = (data: UserRegisterInput) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Login successfully!')
        navigate('/account')
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          toast.error('Invalid email or password')
        } else {
          toast.error('Something went wrong')
        }
      },
    })
  }

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="flex min-h-svh flex-col items-center justify-center p-3 md:p-10 bg-gradient-to-tl from-primary/10 to-secondary/10">
        <div className="w-full md:max-w-5xl">
          <div className="flex flex-col gap-6">
            <Card className="overflow-hidden p-1 md:p-4">
              <CardContent className="grid p-0 md:grid-cols-2">
                <div className="relative p-0 md:p-8 items-center justify-center">
                  <Link to={'/'} className="flex justify-center items-center gap-2 pt-5 md:pt-0 shrink-0">
                    <img src={'/images/logo/logo.png'} width={0} height={0} sizes="100vw" className="hidden md:block h-16 w-auto" alt={'logo'}/>
                  </Link>
                  <img
                    src="/images/auth/auth-img.png"
                    alt="Image"
                    className="mx-auto w-1/2 md:w-full object-cover"
                  />
                  <ul className="social-media hidden md:flex justify-center gap-2">
                    <li className="w-6 h-6 flex items-center justify-center bg-primary rounded-[5px] border border-primary text-white transition-all">
                      <Link className="group" to={'#'}>
                        <Facebook className="w-4 h-4" />
                      </Link>
                    </li>
                    <li className="w-6 h-6 flex items-center justify-center bg-primary rounded-[5px] border border-primary text-white transition-all">
                      <Link className="group" to={'#'}>
                        <Instagram className="w-4 h-4" />
                      </Link>
                    </li>
                    <li className="w-6 h-6 flex items-center justify-center bg-primary rounded-[5px] border border-primary text-white transition-all">
                      <Link className="group" to={'#'}>
                        <Youtube className="w-4 h-4" />
                      </Link>
                    </li>
                  </ul>
                  <div className="hidden md:flex pt-4 flex-col text-center justify-center gap-4 text-[11px] md:text-[13px] text-gray-700 md:items-center">
                    <p>{`© ${new Date().getFullYear()} ARK. All rights reserved.`}</p>
                  </div>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="px-6 pt-5 pb-4 md:p-8">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col items-center text-center">
                      <h1 className="text-[20px] md:text-2xl font-bold">Sign In</h1>
                      <p className="text-muted-foreground text-balance text-sm">
                        Sign in to your Litera account
                      </p>
                    </div>
                    <GoogleSignInButton isPending={loginMutation.isPending} />
                    <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                      <span className="bg-card text-muted-foreground relative z-10 px-2">
                        or sign in with email
                      </span>
                    </div>
                    <div className="grid gap-2">
                      <Label>Email</Label>
                      <Input
                        id="email"
                        type="text"
                        placeholder="Enter your email"
                        {...register('email')}
                      />
                      {errors.email && (
                        <p className="text-red-600 text-sm mb-0 pb-0">{errors.email?.message}</p>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label>Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          {...register('password')}
                          placeholder="Enter your password"
                          type={showPassword ? 'text' : 'password'}
                        />
                        <span
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                        >
                          {showPassword ? (
                            <EyeIcon className="size-5" />
                          ) : (
                            <EyeClosedIcon className="size-5" />
                          )}
                        </span>
                      </div>
                      {errors.password && (
                        <p className="text-red-600 text-sm mb-0 pb-0">{errors.password?.message}</p>
                      )}
                    </div>

                    <Button disabled={loginMutation.isPending} type="submit" className="w-full">
                      {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
                    </Button>
                    <p className="text-center text-sm text-muted-foreground">
                      Don't have an account?{' '}
                      <Link to="/register" className="text-primary font-medium underline underline-offset-2 hover:opacity-80 transition-opacity">
                        Sign up
                      </Link>
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  )
}

export default LoginPage