import { PageMetadata } from '@/components/common/PageMetadata'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Separator } from '@/components/ui/separator'
import { useState } from 'react'
import { toast } from 'sonner'
import { useMyOrders, useCancelOrder } from '@/api/queries/order'
import { loadMidtransScript } from '@/lib/midtrans'
import type { Order } from '@/types'
import { OrderCard, OrderSkeleton } from './_components/OrderCard'
import NavigationSide from '../_components/NavSide'
import PaginationData from '@/components/common/Pagination'

const FILTER_TABS: { label: string; value: Order['status'] | 'All' }[] = [
  { label: 'All', value: 'All' },
  { label: 'Waiting Payment', value: 'Pending' },
  { label: 'Paid', value: 'Paid' },
  { label: 'Processing', value: 'Processing' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Cancelled', value: 'Cancelled' },
  { label: 'Failed', value: 'Failed' }
]

const TransactionsPage = () => {
  PageMetadata({ title: 'My Transactions | Litera' })

  const [activeFilter, setActiveFilter] = useState<Order['status'] | 'All'>('All')
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  const { data, isLoading } = useMyOrders(page, 10)
  const cancelMutation = useCancelOrder()

  const orders = data?.data ?? []
  const total = data?.total ?? 0

  const filteredOrders =
    activeFilter === 'All' ? orders : (orders as Order[]).filter((o) => o.status === activeFilter)

  const handlePay = async (token: string) => {
    try {
      await loadMidtransScript()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const snap = (window as any).snap
      if (snap) {
        snap.pay(token, {
          onSuccess: () => toast.success('Payment successful!'),
          onPending: () => toast.info('Payment pending, check back soon.'),
          onError: () => toast.error('Payment failed. Please try again.'),
          onClose: () => toast.info('Payment window closed.')
        })
      } else {
        toast.error('Midtrans is not available. Please try again.')
      }
    } catch {
      toast.error('Failed to load payment gateway.')
    }
  }

  const handleCancel = async () => {
    if (!cancelOrderId) return
    try {
      await cancelMutation.mutateAsync(cancelOrderId)
      toast.success('Order cancelled successfully')
    } catch {
      toast.error('Failed to cancel order')
    } finally {
      setCancelOrderId(null)
    }
  }

  return (
    <>
      <div className="relative pt-6 w-full px-5 md:px-32 pb-10 md:pb-20">
        <div className="container mx-auto">
          <Breadcrumb className="pb-5 md:pb-8">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>My Transactions</BreadcrumbPage>
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
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-semibold text-gray-800">My Transactions</h4>
                      {total > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {total} orders
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Track and manage all your orders here.
                    </p>
                  </div>
                </div>
                <Separator className="mb-5" />
                <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-none">
                  {FILTER_TABS.map((tab) => {
                    const count =
                      tab.value === 'All'
                        ? orders.length
                        : (orders as Order[]).filter((o) => o.status === tab.value).length

                    return (
                      <button key={tab.value} onClick={() => setActiveFilter(tab.value)}
                        className={`shrink-0  px-2.5 md:px-3.5  py-1 md:py-1.5 rounded-full text-xs md:text-sm font-medium transition-all border ${
                          activeFilter === tab.value
                            ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                        }`}>
                        {tab.label}
                        {count > 0 && (
                          <span className={`ml-1.5 text-xs ${activeFilter === tab.value ? 'opacity-80' : 'text-muted-foreground'}`}>
                            ({count})
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
                <div className="space-y-4">
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => <OrderSkeleton key={i} />)
                  ) : filteredOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <img className="mx-auto" width={180}  height={180} src="/images/transaction-empty.png" alt="empty data"/>
                      <h5 className="text-base font-semibold text-gray-800 mb-1">
                        No transactions found
                      </h5>
                      <p className="text-sm text-gray-500 max-w-sm mb-4">
                        {activeFilter !== 'All'
                          ? `You have no ${activeFilter.toLowerCase()} orders.`
                          : "You haven't made any orders yet."}
                      </p>
                      {activeFilter === 'All' && (
                        <Button asChild size="sm">
                          <a href="/books">Browse Books</a>
                        </Button>
                      )}
                    </div>
                  ) : (
                    filteredOrders.map((order: Order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        onPay={handlePay}
                        onCancel={(id) => setCancelOrderId(id)}
                      />
                    ))
                  )}
                </div>
                {!isLoading && total > 10 && (
                  <div className="mt-8">
                    <PaginationData
                      page={page}
                      totalPages={Math.ceil(total / 10)}
                      onPageChange={setPage}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <AlertDialog open={!!cancelOrderId} onOpenChange={(open) => !open && setCancelOrderId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this order?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The order will be permanently cancelled and you will
              need to place a new order.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Order</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              disabled={cancelMutation.isPending}>
              {cancelMutation.isPending ? 'Cancelling...' : 'Yes, Cancel Order'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default TransactionsPage