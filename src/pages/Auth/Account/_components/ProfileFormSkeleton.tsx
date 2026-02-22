import { Separator } from "@/components/ui/separator";

const ProfileFormSkeleton = () => (
  <div className="border rounded-md bg-white">
    <div className="p-4">
      <div className="h-6 w-40 mb-2 bg-gray-200" />
      <div className="h-4 w-64 bg-gray-200" />
    </div>
    <Separator />
    <div className="flex items-center gap-4 p-4">
      <div className="w-16 h-16 rounded-full shrink-0 bg-gray-200" />
      <div className="space-y-2 flex-1">
        <div className="h-4 w-32 bg-gray-200" />
        <div className="h-3 w-48 bg-gray-200" />
        <div className="h-8 w-28 bg-gray-200" />
      </div>
    </div>
    <Separator />
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <div className="h-4 w-24 bg-gray-200" />
        <div className="h-10 w-full bg-gray-200" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="h-4 w-16 bg-gray-200" />
          <div className="h-10 w-full bg-gray-200" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-24 bg-gray-200" />
          <div className="h-10 w-full bg-gray-200" />
        </div>
      </div>
    </div>
    <Separator />
    <div className="flex justify-end gap-2 p-4">
      <div className="h-10 w-20 bg-gray-200" />
      <div className="h-10 w-36 bg-gray-200" />
    </div>
  </div>
)

export default ProfileFormSkeleton