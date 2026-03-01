import { Badge, ChevronRight, MapPin, Star } from "lucide-react"
import type { Address } from "@/types"
import { Button } from "@/components/ui/button"
import { Link } from "react-router"
import { SectionCard, SectionHeader } from "./CheckoutCard"

const DeliveryAddress = ({
  addresses,
  isLoading,
  selectedId,
  onSelect,
}: {
  addresses: Address[]
  isLoading: boolean
  selectedId: string
  onSelect: (id: string) => void
}) => {
  if (isLoading) return (
    <SectionCard>
      <SectionHeader>Delivery Address</SectionHeader>
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-200 w-1/3" />
        <div className="h-3 bg-gray-200 w-2/3" />
        <div className="h-3 bg-gray-200 w-1/2" />
      </div>
    </SectionCard>
  )

  if (addresses.length === 0) return (
    <SectionCard>
      <SectionHeader>Delivery Address</SectionHeader>
      <div className="p-5">
        <p className="text-sm text-muted-foreground mb-3">No address has been registered yet.</p>
        <Button variant="outline" size="sm" asChild>
          <Link to="/account/address">Add New Address</Link>
        </Button>
      </div>
    </SectionCard>
  )

  const selected = addresses.find(a => a.id === selectedId)

  return (
    <SectionCard>
      <div className="px-5 py-4 flex items-center justify-between border-b bg-gray-50">
        <h3 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
          <MapPin className="w-4 h-4" />Delivery Address
        </h3>
        {addresses.length > 1 && (
          <button
            type="button"
            onClick={() => {
              const idx = addresses.findIndex(a => a.id === selectedId)
              const next = addresses[(idx + 1) % addresses.length]
              onSelect(next.id)
            }}
            className="text-xs text-primary font-medium flex items-center gap-1 hover:underline"
          >
            Change Address <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>
      {selected && (
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold text-sm">{selected.name}
                <span className="ml-2 text-muted-foreground font-normal">{selected.phone}</span>
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {selected.street}, {selected.district}, {selected.city}, {selected.province} {selected.zip}
              </p>
            </div>
            {selected.is_primary && (
              <Badge variant={'secondary'} className="text-xs flex items-center justify-center font-medium px-3 py-0.5 rounded shrink-0">
               <Star /> Primary
              </Badge>
            )}
          </div>
        </div>
      )}
    </SectionCard>
  )
}

export default DeliveryAddress