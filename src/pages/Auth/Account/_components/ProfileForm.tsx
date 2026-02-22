import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/context/UserContext'
import { useUpdateProfile } from '@/api/queries/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { UserProfileUpdateSchema, type UserProfileUpdateInput } from '@/lib/schema/auth.schema'
import AvatarUpload from './AvatarUpload'
import ProfileFormSkeleton from './ProfileFormSkeleton'
import { AxiosError } from 'axios'

const ProfileForm = () => {
  const { user, isInitialized } = useAuth()
  const updateMutation = useUpdateProfile()

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(UserProfileUpdateSchema),
    values: {
      name: user?.name ?? "",
      phone: user?.phone ?? "",
    },
  })

  const onSubmit = (data: UserProfileUpdateInput) => {
    const formData = new FormData()
    if (data.name) formData.append("name", data.name)
    if (data.phone) formData.append("phone", data.phone)

    updateMutation.mutate(formData, {
      onSuccess: (res) => toast.success(res.message),
      onError: (error) => {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data?.message)
        } else {
          toast.error('Something went wrong')
        }
      },
    })
  }

  if (!isInitialized) return <ProfileFormSkeleton />

  return (
    <div className="border rounded-md bg-white">
      <div className="p-4">
        <h3 className="font-semibold text-xl mb-1">Account Information</h3>
        <p className="text-muted-foreground text-sm">Update your personal details</p>
      </div>
      <Separator />
      <AvatarUpload user={user} updateMutation={updateMutation} />
      <Separator />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-4 space-y-4">
          <div>
            <Label className="mb-2 block">Full Name</Label>
            <Input {...register("name")} />
            {errors.name && (
              <p className="text-destructive text-xs mt-1">{errors.name.message}</p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="mb-2 block">Email</Label>
              <Input value={user?.email ?? ""} readOnly className="bg-muted cursor-not-allowed" />
            </div>
            <div>
              <Label className="mb-2 block">Phone Number</Label>
              <Input {...register("phone")} />
              {errors.phone && (
                <p className="text-destructive text-xs mt-1">{errors.phone.message}</p>
              )}
            </div>
          </div>
        </div>
        <Separator />
        <div className="flex justify-end gap-2 p-4">
          <Button variant="ghost" type="button" onClick={() => reset()} disabled={updateMutation.isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? (
              <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving...</>
            ) : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ProfileForm