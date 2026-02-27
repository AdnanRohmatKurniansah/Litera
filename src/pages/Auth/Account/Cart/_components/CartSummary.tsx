import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { formatRp } from '@/lib/utils'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import type { Book } from '@/types'

interface CartItem {
  id: string
  bookId: string
  qty: number
  book: Book
}

interface Props {
  items: CartItem[]
  selectedIds: Set<string>
  selectedCount: number
  totalOriginal: number
  totalDiscount: number
  subtotal: number
  isLoading: boolean
  hasOutOfStockSelected: boolean
}

const CartSummary = ({
  items,
  selectedIds,
  selectedCount,
  totalOriginal,
  totalDiscount,
  subtotal,
  isLoading,
  hasOutOfStockSelected,
}: Props) => {

  const navigate = useNavigate()

  const handleCheckout = () => {
    if (selectedIds.size === 0) {
      toast.error("Please select items to checkout")
      return
    }

    const selectedItems = items.filter((i) => selectedIds.has(i.id))

    navigate("/checkout", {
      state: { items: selectedItems }
    })
  }

  return (
    <div className="border rounded-lg bg-white p-5 space-y-4">
      <h4 className="font-bold text-base">Cart Summary</h4>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Total Price ({selectedCount} Item)</span>
          <span>{formatRp(totalOriginal)}</span>
        </div>
        {totalDiscount > 0 && (
          <div className="flex justify-between text-red-500">
            <span>Shopping Discount</span>
            <span>-{formatRp(totalDiscount)}</span>
          </div>
        )}
      </div>
      <Separator />
      <div className="flex justify-between font-bold text-base">
        <span>Subtotal</span>
        <span>{formatRp(subtotal)}</span>
      </div>
      <Button className="w-full" size="lg" onClick={handleCheckout} disabled={selectedIds.size === 0 || isLoading || hasOutOfStockSelected}>
        Checkout
      </Button>
    </div>
  )
}

export default CartSummary