import { Button } from "@/components/ui/button"
import { formatDate, formatRp } from "@/lib/utils"
import type { Order } from "@/types"
import { CheckCircle2, ChevronDown, ChevronUp, Clock, CreditCard, MapPin, Package, Truck, XCircle } from "lucide-react"
import { useState } from "react"

const STATUS_CONFIG = {
  Pending: {
    label: 'Waiting Payment',
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    icon: <Clock className="w-3.5 h-3.5" />
  },
  Paid: {
    label: 'Paid',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: <CreditCard className="w-3.5 h-3.5" />
  },
  Processing: {
    label: 'Processing',
    color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    icon: <Package className="w-3.5 h-3.5" />
  },
  Completed: {
    label: 'Completed',
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />
  },
  Cancelled: {
    label: 'Cancelled',
    color: 'bg-gray-100 text-gray-500 border-gray-200',
    icon: <XCircle className="w-3.5 h-3.5" />
  },
  Failed: {
    label: 'Failed',
    color: 'bg-red-100 text-red-600 border-red-200',
    icon: <XCircle className="w-3.5 h-3.5" />
  }
}

const OrderCard = ({
  order,
  onPay,
  onCancel
}: {
  order: Order
  onPay: (token: string) => void
  onCancel: (orderId: string) => void
}) => {
  const [expanded, setExpanded] = useState(false)
  const status = STATUS_CONFIG[order.status]

  const canPay = order.status === 'Pending' && order.payment?.token
  const canCancel = order.status === 'Pending' || order.status === 'Paid'

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground font-mono">#{order.id.slice(-8).toUpperCase()}</span>
            {order.receipt_number && (
              <span className="text-xs text-muted-foreground">· {order.receipt_number}</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{formatDate(order.created_at, 'long')}</p>
        </div>
        <div className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${status.color}`}>
          {status.icon}
          {status.label}
        </div>
      </div>

      <div className="px-5 py-4">
        <div className="flex gap-3">
          <div className="flex -space-x-3">
            {order.items.slice(0, 3).map((item) => (
              <img key={item.id} src={item.book.image_url} alt={item.book.name} className="w-12 h-16 object-cover rounded-md border-2 border-white shadow-sm"/>
            ))}
            {order.items.length > 3 && (
              <div className="w-12 h-16 rounded-md border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-500 shadow-sm">
                +{order.items.length - 3}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 line-clamp-1">
              {order.items[0]?.book.name}
              {order.items.length > 1 && ` & ${order.items.length - 1} more`}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {order.items.reduce((acc, i) => acc + i.qty, 0)} item(s)
            </p>
            {order.shipping && (
              <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
                <Truck className="w-3 h-3" />
                <span>
                  {order.shipping.courier} - {order.shipping.service} - {formatRp(order.shipping.cost)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="px-5 pb-4 space-y-4 border-t border-gray-50 pt-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Items</p>
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <img src={item.book.image_url} alt={item.book.name} className="w-10 h-14 object-cover rounded-md border" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{item.book.name}</p>
                  <p className="text-xs text-muted-foreground">{item.book.author}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-medium">{formatRp(item.price)}</p>
                  <p className="text-xs text-muted-foreground">×{item.qty}</p>
                </div>
              </div>
            ))}
          </div>
          {order.address && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Delivery Address
              </p>
              <div className="flex items-start gap-2 text-sm text-gray-700">
                <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                <div>
                  <p className="font-medium">{order.address.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {order.address.street}, {order.address.district}, {order.address.city},{' '}
                    {order.address.province} {order.address.zip}
                  </p>
                </div>
              </div>
            </div>
          )}
          {order.payment && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Payment
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CreditCard className="w-4 h-4 text-muted-foreground" />
                <span className="capitalize">{order.payment.method ?? 'Not yet paid'}</span>
                {order.payment.paid_at && (
                  <span className="text-xs text-muted-foreground">{formatDate(order.payment.paid_at, 'long')}
                  </span>
                )}
              </div>
            </div>
          )}
          {order.note && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Note</p>
              <p className="text-sm text-gray-600 italic">"{order.note}"</p>
            </div>
          )}
        </div>
      )}
      <div className="flex items-center justify-between px-5 py-3 bg-gray-50/50 border-t border-gray-100">
        <div>
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="text-base font-bold text-gray-900">{formatRp(order.total)}</p>
        </div>

        <div className="flex items-center gap-2">
          <button  onClick={() => setExpanded((v) => !v)} className="text-xs text-muted-foreground flex items-center gap-1 hover:text-gray-700 transition-colors">
            {expanded ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" /> Less
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" /> Details
              </>
            )}
          </button>

          {canCancel && (
            <Button size="sm" variant="outline" className="text-xs border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300" onClick={() => onCancel(order.id)} >
              Cancel
            </Button>
          )}
          {canPay && (
            <Button size="sm" onClick={() => onPay(order.payment!.token)} className="text-xs">
              <CreditCard className="w-3.5 h-3.5 mr-1.5" />
              Pay Now
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

const OrderSkeleton = () => (
  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden space-y-0">
    <div className="flex justify-between px-5 py-4 border-b">
      <div className="space-y-1.5">
        <div className="h-3 bg-gray-200 w-32" />
        <div className="h-3 bg-gray-200 w-24" />
      </div>
      <div className="h-6 w-24 rounded-full" />
    </div>
    <div className="px-5 py-4 flex gap-3">
      <div className="flex -space-x-3">
        {[1, 2].map((i) => (
          <div key={i} className="w-12 bg-gray-200 h-16 rounded-md border-2 border-white" />
        ))}
      </div>
      <div className="space-y-2 flex-1">
        <div className="h-4 bg-gray-200 w-48" />
        <div className="h-3 bg-gray-200 w-20" />
        <div className="h-3 bg-gray-200 w-32" />
      </div>
    </div>
    <div className="flex justify-between px-5 py-3 bg-gray-50/50 border-t">
      <div className="h-5 bg-gray-200 w-24" />
      <div className="h-8 bg-gray-200 w-20 rounded-md" />
    </div>
  </div>
)

export { OrderCard, OrderSkeleton}