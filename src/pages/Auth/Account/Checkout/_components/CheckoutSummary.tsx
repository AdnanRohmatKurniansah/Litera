import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatRp } from "@/lib/utils"
import type { CartItem } from "@/types"
import { ShieldCheck } from "lucide-react"
import { useMemo } from "react"

const CheckoutSummary = ({
  items,
  shippingCost,
  canCheckout,
  isPending,
  onCheckout,
}: {
  items: CartItem[]
  shippingCost: number
  canCheckout: boolean
  isPending: boolean
  onCheckout: () => void
}) => {
  const { totalOriginal, totalDiscount, subtotal } = useMemo(() => {
    let totalOriginal = 0
    let totalDiscount = 0
    for (const item of items) {
      const price = item.book.price
      const eff   = item.book.discount_price ?? price
      totalOriginal += price * item.qty
      totalDiscount += (price - eff) * item.qty
    }
    return { totalOriginal, totalDiscount, subtotal: totalOriginal - totalDiscount + shippingCost }
  }, [items, shippingCost])

  return (
    <div className="border rounded-lg bg-white p-5 space-y-4">
      <h4 className="font-bold text-base">Shopping Summary</h4>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Total Price ({items.reduce((s, i) => s + i.qty, 0)} Item)</span>
          <span>{formatRp(totalOriginal)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Total Shipping Costs</span>
          <span>{shippingCost > 0 ? formatRp(shippingCost) : 'Rp0'}</span>
        </div>
        {totalDiscount > 0 && (
          <div className="flex justify-between text-red-500">
            <span>Shopping Discounts</span>
            <span>-{formatRp(totalDiscount)}</span>
          </div>
        )}
      </div>

      <Separator />
      <div className="flex justify-between font-bold text-base">
        <span>Total Expenditure</span>
        <span>{formatRp(subtotal)}</span>
      </div>
      <Button className="w-full gap-2" size="lg" onClick={onCheckout} disabled={!canCheckout || isPending}>
        <ShieldCheck className="w-4 h-4" />
        {isPending ? 'Processing...' : 'Pay Now'}
      </Button>
      {!canCheckout && (
        <p className="text-xs text-center text-muted-foreground">
          Complete the address and select the courier first
        </p>
      )}
    </div>
  )
}

export default CheckoutSummary