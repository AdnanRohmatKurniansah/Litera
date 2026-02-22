import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useChangePassword } from '../../../../api/queries/auth'
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router';
import { UserChangePasswordSchema, type UserChangePasswordInput } from '@/lib/schema/auth.schema';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const UpdatePassword = () => {
  const changePassword = useChangePassword()
  const navigate = useNavigate()

  const { register, handleSubmit, reset, formState: { errors }} = useForm<UserChangePasswordInput>({
    resolver: zodResolver(UserChangePasswordSchema),
  })

  const handleSave = handleSubmit((data) => {
    changePassword.mutate(
      {
        old_password: data.old_password,
        new_password: data.new_password,
      },
      {
        onSuccess: (res) => {
          toast.success(res.message)
          reset()
        },
        onError: (error) => {
          if (error instanceof AxiosError) {
            toast.error(error.response?.data?.message)
          } else {
            toast.error("Something went wrong")
          }
        },
      }
    )
  })

  return (
    <div className='mt-6 p-5 border border-gray-200 rounded-md dark:border-gray-800'>
      <div className="flex flex-col gap-6">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-1">
            Change Password
          </h4>
          <p className="text-sm text-gray-600 pb-4">
            You will be logged out after changing your password
          </p>
          <Separator />
          <form className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5" onSubmit={handleSave}>
            <div>
              <Label className='mb-2 block' htmlFor="old_password">Old Password</Label>
              <Input id="old_password" type="password" {...register("old_password")} placeholder='Enter old password' />
              {errors.old_password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.old_password.message}
                </p>
              )}
            </div>
            <div>
              <Label className='mb-2 block' htmlFor="new_password">New Password</Label>
              <Input id="new_password" type="password" {...register("new_password")} placeholder='Enter new password' />
              {errors.new_password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.new_password.message}
                </p>
              )}
            </div>
            <div className="col-span-2 flex items-center gap-3 mt-3 lg:justify-end">
              <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={changePassword.isPending}>
                Cancel
              </Button>
              <Button type='submit' disabled={changePassword.isPending}>
                {changePassword.isPending ? "Changing..." : "Change Password"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UpdatePassword