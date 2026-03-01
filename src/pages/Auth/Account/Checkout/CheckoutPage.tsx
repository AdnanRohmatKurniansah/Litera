import { PageMetadata } from '@/components/common/PageMetadata'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { useLocation, useNavigate } from 'react-router'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import { useCheckout, useShippingCost } from '@/api/queries/order'
import { useAddress } from '@/api/queries/address'
import type { Address, CartItem, ShippingService } from '@/types'
import DeliveryAddress from './_components/DelivaryAddress'
import CourierOption from './_components/CourierOption'
import OrderItemsSection from './_components/OrderItemsSection'
import CheckoutNote from './_components/CheckoutNote'
import CheckoutSummary from './_components/CheckoutSummary'
import { loadMidtransScript } from '@/lib/midtrans'
import type { CourierType } from '@/lib/schema/order.schema'

const CheckoutPage = () => {
  PageMetadata({ title: 'Checkout | Litera' })

  const location = useLocation()
  const navigate = useNavigate()

  const items: CartItem[] = location.state?.items ?? []

  const { data: addresses = [], isLoading: loadingAddresses } = useAddress()
  const shippingCostMutation = useShippingCost()
  const checkoutMutation = useCheckout()

  const [selectedAddressId, setSelectedAddressId] = useState('')
  const [selectedCourier, setSelectedCourier] = useState<CourierType | ''>('')
  const [services, setServices] = useState<ShippingService[]>([])
  const [selectedService, setSelectedService] = useState<ShippingService | null>(null)
  const [note, setNote] = useState('')

  useEffect(() => {
    if (items.length === 0) {
      toast.error('There are no items to check out')
      navigate('/account/cart')
    }
  }, [items.length, navigate])

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const primary = (addresses as Address[]).find((a) => a.is_primary) ?? addresses[0]
      setSelectedAddressId(primary.id)
    }
  }, [addresses, selectedAddressId])

  useEffect(() => {
    if (!selectedCourier || !selectedAddressId) return

    const addr = (addresses as Address[]).find((a) => a.id === selectedAddressId)
    if (!addr) return

    const totalWeight = Math.max(
      1,
      Math.ceil(
        items.reduce((sum, item) => sum + (Number(item.book.weight) || 300) * item.qty, 0)
      )
    )

    shippingCostMutation.mutate(
      { destination: addr.city_id, weight: totalWeight, courier: selectedCourier },
      {
        onSuccess: (data) => {
          setServices(data?.data ?? [])
          setSelectedService(data?.data?.[0] ?? null)
        },
        onError: () => {
          setServices([])
          setSelectedService(null)
          toast.error('Failed to take shipping costs')
        },
      }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCourier, selectedAddressId])

  const handleCourierChange = (courier: string) => {
    setSelectedCourier(courier as CourierType)
    setServices([])
    setSelectedService(null)
  }

  const handleAddressChange = (id: string) => {
    setSelectedAddressId(id)
    setServices([])
    setSelectedService(null)
  }

  const canCheckout = !!selectedAddressId && !!selectedService && !!selectedCourier

  const handleCheckout = async () => {
    if (!canCheckout || !selectedCourier) return

    try {
      const result = await checkoutMutation.mutateAsync({
        addressId: selectedAddressId,
        courier: selectedCourier as CourierType,
        service: selectedService!.service,
        note: note || undefined,
        itemIds: items.map((i) => i.id)
      })

      await loadMidtransScript()

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const snap = (window as any).snap

      if (snap) {
        snap.pay(result.snapToken, {
          onSuccess: () => {
            toast.success('Payment successful!')
            navigate('/account/transactions')
          },
          onPending: () => {
            toast.info('Payment pending, please complete your payment.')
            navigate('/account/transactions')
          },
          onError: (err: unknown) => {
            console.error('Midtrans payment error:', err)
            toast.error('Payment failed. Please try again.')
          },
          onClose: () => {
            toast.info('Payment window closed. You can pay later in My Transactions.')
            navigate('/account/transactions')
          },
        })
      } else {
        window.open(result.redirectUrl, '_blank')
        navigate('/account/transactions')
      }
    } catch (error) {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data?.message ?? 'Checkout failed'
          : 'An error occurred'
      )
    }
  }

  return (
    <div className="relative pt-6 w-full px-5 md:px-32 pb-10 md:pb-20">
      <div className="container mx-auto">
        <Breadcrumb className="pb-5 md:pb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/account/cart">My Cart</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Checkout</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="flex-1 w-full space-y-4">
            <DeliveryAddress
              addresses={addresses}
              isLoading={loadingAddresses}
              selectedId={selectedAddressId}
              onSelect={handleAddressChange}
            />
            <CourierOption
              selectedCourier={selectedCourier}
              onCourierChange={handleCourierChange}
              services={services}
              selectedService={selectedService}
              onServiceChange={setSelectedService}
              isLoadingServices={shippingCostMutation.isPending}
              addressSelected={!!selectedAddressId}
            />
            <OrderItemsSection items={items} />
            <CheckoutNote value={note} onChange={setNote} />
          </div>
          <div className="w-full lg:w-80 shrink-0 lg:sticky lg:top-28">
            <CheckoutSummary
              items={items}
              shippingCost={selectedService?.cost ?? 0}
              canCheckout={canCheckout}
              isPending={checkoutMutation.isPending}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage