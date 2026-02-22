import type { useUpdateProfile } from "@/api/queries/auth"
import { Button } from "@/components/ui/button"
import type { User } from "@/types"
import { useRef, useState } from "react"
import { toast } from "sonner"

type UpdateProfileMutation = ReturnType<typeof useUpdateProfile>

interface AvatarUploadProps {
  user: User | null
  updateMutation: UpdateProfileMutation
}

const AvatarUpload = ({ user, updateMutation }: AvatarUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string>(
    user?.profile ?? "/images/auth/default-avatar.png"
  )
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const handleUpload = () => {
    if (!file) return
    const formData = new FormData()
    formData.append("profile", file)
    updateMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("Avatar updated!")
        setFile(null)
      },
      onError: () => toast.error("Failed to update avatar"),
    })
  }

  return (
    <div className="flex items-center gap-4 p-4">
      <div className="relative cursor-pointer" onClick={() => inputRef.current?.click()}>
        <img
          src={preview}
          alt="Avatar"
          className="w-16 h-16 rounded-full object-cover ring-2 ring-muted"
        />
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{user?.name}</p>
        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
        <div className="flex gap-2 mt-2">
          <Button size="sm" className="text-sm" variant="secondary" type="button" onClick={handleUpload} disabled={!file || updateMutation.isPending}>
            {updateMutation.isPending ? "Saving..." : "Change Avatar"}
          </Button>
          {file && (
            <Button size="sm" variant="ghost" type="button"
              onClick={() => {
                setFile(null)
                setPreview(user?.profile ?? "/images/default-avatar.png")
              }}>
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default AvatarUpload