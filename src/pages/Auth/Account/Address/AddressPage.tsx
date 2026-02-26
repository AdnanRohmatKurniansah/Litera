import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { PageMetadata } from "@/components/common/PageMetadata"
import NavigationSide from "../_components/NavSide"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import {
  useAddress, useAddressCreate,
} from "@/api/queries/address"
import type { Address } from "@/types"
import { toast } from "sonner"
import { AxiosError } from "axios"
import { Plus } from "lucide-react"
import { useState } from "react"
import AddressForm from "./_components/AddressForm"
import { AddressCard, AddressSkeleton } from "./_components/AddressCard"
import type { AddressCreateInput } from "@/lib/schema/address.schema"

const AddressPage = () => {
  PageMetadata({ title: "My Address | Litera" })

  const [addOpen, setAddOpen] = useState(false)
  const { data, isLoading } = useAddress()
  const createMutation = useAddressCreate()

  const addresses: Address[] = data ?? []

  const handleCreate = async (formData: AddressCreateInput) => {
    try {
      await createMutation.mutateAsync(formData)
      toast.success("Address added!")
      setAddOpen(false)
    } catch (error) {
      toast.error(error instanceof AxiosError
        ? error.response?.data?.message ?? "Failed to add address"
        : "Something went wrong")
    }
  }

  return (
    <section className="books-detail">
      <div className="relative pt-6 w-full px-5 md:px-32 pb-10 md:pb-20">
        <div className="container mx-auto">
          <Breadcrumb className="pb-5 md:pb-8">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Address</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="nav-side relative md:sticky md:top-28 h-fit col-span-4 md:col-span-1">
              <NavigationSide />
            </div>
            <div className="col-span-4 md:col-span-3 mb-8">
              <div className="p-5 border border-gray-200 rounded-md">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-1">My Address</h4>
                    <p className="text-sm text-gray-500">
                      Manage your saved addresses for faster checkout.
                    </p>
                  </div>
                  <Dialog open={addOpen} onOpenChange={setAddOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="gap-1 shrink-0">
                        <Plus className="w-4 h-4" /> Add New Address
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-full">
                      <DialogHeader>
                        <DialogTitle>Add New Address</DialogTitle>
                      </DialogHeader>
                      <AddressForm onSubmit={handleCreate}
                        isPending={createMutation.isPending}
                        onCancel={() => setAddOpen(false)} />
                    </DialogContent>
                  </Dialog>
                </div>

                <Separator className="mb-5" />

                {isLoading ? (
                  <AddressSkeleton />
                ) : addresses.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <img className="mx-auto" width={160} height={160} src="/images/address-empty.png" alt="empty data" />
                    <h5 className="text-base font-semibold text-gray-800 mb-1">No addresses added yet</h5>
                    <p className="text-sm text-gray-500 max-w-sm mb-4">
                      Add a shipping address to make checkout faster and easier.
                    </p>
                    <Button size="sm" onClick={() => setAddOpen(true)} className="gap-1">
                      <Plus className="w-4 h-4" /> Add Your First Address
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((address: Address) => (
                      <AddressCard key={address.id} address={address} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AddressPage