import { Truck } from "lucide-react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { formatRp } from "@/lib/utils"
import { SectionCard, SectionHeader } from "./CheckoutCard"
import type { ShippingService } from "@/types"

const COURIERS = [
  { value: 'jne', label: 'JNE' },
  { value: 'jnt', label: 'J&T Express' },
  { value: 'sicepat', label: 'SiCepat' },
  { value: 'pos',label: 'POS Indonesia' },
  { value: 'tiki', label: 'TIKI' },
]

const CourierOption = ({
  selectedCourier,
  onCourierChange,
  services,
  selectedService,
  onServiceChange,
  isLoadingServices,
  addressSelected,
}: {
  selectedCourier: string
  onCourierChange: (v: string) => void
  services: ShippingService[]
  selectedService: ShippingService | null
  onServiceChange: (s: ShippingService) => void
  isLoadingServices: boolean
  addressSelected: boolean
}) => (
  <SectionCard>
    <SectionHeader>
      <span className="flex items-center gap-2"><Truck className="w-4 h-4" />Delivery</span>
    </SectionHeader>
    <div className="p-5 space-y-4">
      <div>
        <Label className="text-xs text-muted-foreground mb-2 block">Select Courier</Label>
        <div className="flex flex-wrap gap-2">
          {COURIERS.map(c => (
            <button
              key={c.value}
              type="button"
              onClick={() => onCourierChange(c.value)}
              disabled={!addressSelected}
              className={`px-3 py-1.5 rounded-md text-sm border font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                selectedCourier === c.value
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-gray-200 text-gray-600 hover:border-gray-400'
              }`}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {selectedCourier && (
        <div>
          <Label className="text-xs text-muted-foreground mb-2 block">Select Service</Label>
          {isLoadingServices ? (
            <div className="space-y-2">
              {[1,2,3].map(i => <div key={i} className="h-12 bg-gray-200 w-full rounded-md" />)}
            </div>
          ) : services.length === 0 ? (
            <p className="text-sm text-muted-foreground">No service available.</p>
          ) : (
            <RadioGroup value={selectedService?.service ?? ''}
              onValueChange={(val) => {
                const s = services.find(sv => sv.service === val)
                if (s) onServiceChange(s)
              }} >
              <div className="space-y-2">
                {services.map(s => (
                  <label key={s.service} className={`flex items-center justify-between p-3 rounded-md border cursor-pointer transition-colors ${
                      selectedService?.service === s.service
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value={s.service} />
                      <div>
                        <p className="text-sm font-medium">{s.service} <span className="font-normal text-muted-foreground">— {s.description}</span></p>
                        <p className="text-xs text-muted-foreground">Estimated {s.etd} days</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-800">{formatRp(s.cost)}</span>
                  </label>
                ))}
              </div>
            </RadioGroup>
          )}
        </div>
      )}
      {!addressSelected && (
        <p className="text-xs text-muted-foreground">Select the delivery address first.</p>
      )}
    </div>
  </SectionCard>
)

export default CourierOption