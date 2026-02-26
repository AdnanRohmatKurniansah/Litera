import { useAddressDelete, useAddressUpdate, useAddressUpdatePrimary } from "@/api/queries/address"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { AddressUpdateInput } from "@/lib/schema/address.schema"
import type { Address } from "@/types"
import { AxiosError } from "axios"
import { Pencil, Star, Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import AddressForm from "./AddressForm"
import { Badge } from "@/components/ui/badge"

const AddressSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="border rounded-lg p-4 space-y-3 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-5 bg-gray-200 w-32" />
          <div className="h-6 bg-gray-200 w-16 rounded-full" />
        </div>
        <div className="h-4 bg-gray-200 w-24" />
        <div className="h-4 bg-gray-200 w-3/4" />
        <div className="flex gap-2 pt-1">
          <div className="h-8 bg-gray-200 w-20" />
          <div className="h-8 bg-gray-200 w-20" />
          <div className="h-8 bg-gray-200 w-28" />
        </div>
      </div>
    ))}
  </div>
)

interface AddressCardProps {
  address: Address
}

const AddressCard = ({ address }: AddressCardProps) => {
  const [editOpen, setEditOpen] = useState(false)
  const updateMutation     = useAddressUpdate()
  const deleteMutation     = useAddressDelete()
  const setPrimaryMutation = useAddressUpdatePrimary()

  const handleUpdate = async (data: AddressUpdateInput) => {
    await updateMutation.mutateAsync({ id: address.id, payload: data }, {
        onSuccess: (res) => {
          toast.success(res.message)
          setEditOpen(false)
        }, 
        onError: (error) => {
          toast.error(error instanceof AxiosError
          ? error.response?.data?.message ?? "Failed to update"
          : "Something went wrong")
        }
    })
  }

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(address.id, {
      onSuccess: (res) => {
        toast.success(res.message)
      }, 
      onError: (error) => {
        toast.error(error instanceof AxiosError
        ? error.response?.data?.message ?? "Failed to delete"
        : "Something went wrong")
      }
    })
  }

  const handleSetPrimary = async () => {
    await setPrimaryMutation.mutateAsync({ id: address.id }, {
      onSuccess: (res) => {
        toast.success(res.message)
      }, 
      onError: (error) => {
        toast.error(error instanceof AxiosError
        ? error.response?.data?.message ?? "Failed to set primary"
        : "Something went wrong")
      }
    })
  }

  return (
    <div className={`rounded-lg p-4 transition-colors border`}>
      <div className="flex items-center justify-between mb-1">
        <p className="font-semibold text-gray-800">{address.name}</p>
        {address.is_primary && (
          <Badge variant="secondary" className="text-[11px] rounded gap-1 font-semibold">
            <Star className="w-3 h-3" /> Primary
          </Badge>
        )}
      </div>
      <p className="text-sm text-muted-foreground mb-1">{address.phone}</p>
      <p className="text-sm text-gray-600">
        {address.street}, {address.district}, {address.city}, {address.province} {address.zip}
      </p>

      <div className="flex flex-wrap gap-2 mt-3">
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="gap-1">
              <Pencil className="w-3.5 h-3.5" /> Edit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Address</DialogTitle>
            </DialogHeader>
            <AddressForm
              defaultValues={{
                name: address.name,
                phone: address.phone,
                province: address.province,
                province_id: address.province_id, 
                city: address.city,
                city_id: address.city_id,     
                district: address.district,
                district_id: address.district_id, 
                street: address.street,
                zip: address.zip,
              }}
              onSubmit={handleUpdate}
              isPending={updateMutation.isPending}
              onCancel={() => setEditOpen(false)}
            />
          </DialogContent>
        </Dialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="gap-1 text-destructive hover:text-destructive border-destructive/30 hover:border-destructive"
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="w-3.5 h-3.5" />
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this address?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The address will be permanently removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {!address.is_primary && (
          <Button
            size="sm"
            variant="outline"
            className="gap-1"
            onClick={handleSetPrimary}
            disabled={setPrimaryMutation.isPending}
          >
            <Star className="w-3.5 h-3.5" />
            {setPrimaryMutation.isPending ? "Updating..." : "Set as Primary"}
          </Button>
        )}
      </div>
    </div>
  )
}

export { AddressSkeleton, AddressCard }