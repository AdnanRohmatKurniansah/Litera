import type { CartItem } from "@/types"
import { useMemo } from "react"
import { SectionCard } from "./CheckoutCard"
import { Store } from "lucide-react"
import { formatRp } from "@/lib/utils"

const OrderItemsSection = ({ items }: { items: CartItem[] }) => {
  const total = useMemo(() => {
    return items.reduce((sum, item) => {
      const price = item.book.discount_price ?? item.book.price
      return sum + price * item.qty
    }, 0)
  }, [items])

  return (
    <SectionCard>
      <div className="px-5 py-4 bg-gray-50 border-b flex items-center gap-2">
        <Store className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-semibold text-gray-700">Orders</span>
        <span className="text-xs text-muted-foreground">({items.length} items)</span>
      </div>
      <div className="divide-y">
        {items.map((item) => {
          const effPrice = item.book.discount_price ?? item.book.price
          const hasDiscount = !!item.book.discount_price
          const pct = hasDiscount
            ? Math.round((1 - item.book.discount_price! / item.book.price) * 100)
            : 0

          return (
            <div key={item.id} className="px-5 py-4 flex gap-4">
              <img
                src={item.book.image_url}
                alt={item.book.name}
                className="w-14 h-18 object-contain shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{item.book.author}</p>
                <p className="text-sm font-medium text-gray-800 line-clamp-2">{item.book.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.qty} items</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-semibold">{formatRp(effPrice)}</span>
                  {hasDiscount && (
                    <>
                      <span className="text-xs text-gray-400 line-through">{formatRp(item.book.price)}</span>
                      <span className="text-xs font-semibold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">{pct}%</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="px-5 py-3 flex justify-between border-t">
        <span className="text-sm font-medium text-gray-600">Total Orders</span>
        <span className="text-sm font-bold">{formatRp(total)}</span>
      </div>
    </SectionCard>
  )
}

export default OrderItemsSection