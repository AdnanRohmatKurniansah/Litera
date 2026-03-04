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
import { useMyOrders, useCancelOrder, useArrivedOrder } from '@/api/queries/order'
import { loadMidtransScript } from '@/lib/midtrans'
import type { Order } from '@/types'
import { OrderCard, OrderSkeleton } from './_components/OrderCard'
import NavigationSide from '../_components/NavSide'
import PaginationData from '@/components/common/Pagination'
import { AxiosError } from 'axios'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'

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
  const [arrivedOrderId, setArrivedOrderId] = useState<string | null>(null)
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  const { data, isLoading } = useMyOrders(page, 10)
  const cancelMutation = useCancelOrder()
  const arrivedMutation = useArrivedOrder()

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
    await cancelMutation.mutateAsync(cancelOrderId, {
      onSuccess: (res) => {
        toast.success(res.message)
        setCancelOrderId(null)
      },
      onError: (error) => {            
        if (error instanceof AxiosError) {
          toast.error(error.response?.data?.message)
        } else {
          toast.error("Something went wrong")
        }
      },
    })
  }

  const handleArrived = async () => {
    if (!arrivedOrderId) return
    await arrivedMutation.mutateAsync(arrivedOrderId, {
      onSuccess: (res) => {
        toast.success(res.message)
        setArrivedOrderId(null)
      },
      onError: (error) => {            
        if (error instanceof AxiosError) {
          toast.error(error.response?.data?.message)
        } else {
          toast.error("Something went wrong")
        }
      },
    })
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
          <div className="flex items-center gap-3 mb-4 md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="text-[12px] flex items-center gap-2">
                  <Menu className="w-3 h-3" />
                  Navigation
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[320px] overflow-y-auto">
                <SheetHeader className="pb-4 border-b mt-3">
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
                <NavigationSide />
              </SheetContent>
            </Sheet>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="nav-side relative md:sticky md:top-28 h-fit col-span-4 md:col-span-1 hidden md:block">
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
                      <img className="mx-auto w-[100px] md:w-[160px] h-[100px] md:h-[160px]" src="/images/transaction-empty.png" alt="empty data"/>
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
                        onArrived={(id) => setArrivedOrderId(id)}
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

      <AlertDialog open={!!arrivedOrderId} onOpenChange={(open) => !open && setArrivedOrderId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark this order as arrived?</AlertDialogTitle>
            <AlertDialogDescription>
              Please confirm that you have received this order. This action will update the order status to "Arrived".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Not Yet</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleArrived}
              className="bg-green-600 hover:bg-green-700 focus:ring-green-600"
              disabled={arrivedMutation.isPending}>
              {arrivedMutation.isPending ? 'Processing...' : 'Yes, Order Arrived'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default TransactionsPage