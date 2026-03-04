import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { PageMetadata } from "@/components/common/PageMetadata"
import { Checkbox } from "@/components/ui/checkbox"
import { useCart, useUpdateCart, useDeleteCart } from "@/api/queries/cart"
import { useAuth } from "@/context/UserContext"
import { Link } from "react-router"
import { Trash2 } from "lucide-react"
import { useState, useMemo, useEffect } from "react"
import { toast } from "sonner"
import { AxiosError } from "axios"
import type { Book } from "@/types"
import RecommendedBook from "./_components/RecommendedBook"
import CartSkeleton from "./_components/CartSkeleton"
import QtyControl from "./_components/QtyControl"
import CartSummary from "./_components/CartSummary"
import { formatRp } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface CartItem {
  id: string
  bookId: string
  qty: number
  book: Book
}

const CartPage = () => {
  PageMetadata({ title: "My Cart | Litera" })

  const { isAuthenticated } = useAuth()

  const { data: cart, isLoading } = useCart(isAuthenticated)
  const updateCart = useUpdateCart()
  const deleteCart = useDeleteCart()

  const items: CartItem[] = useMemo(() => {
    return cart?.items ?? []
  }, [cart])

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const outOfStockIds = items
      .filter(item => item.book.qty! <= 0)
      .map(item => item.id)

    if (outOfStockIds.length === 0) return

    setSelectedIds(prev => {
      const next = new Set(prev)
      outOfStockIds.forEach(id => next.delete(id))
      return next
    })
  }, [items])

  const allSelected = items.length > 0 && selectedIds.size === items.length

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(items.map((i) => i.id)))
    }
  }

  const toggleItem = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const { totalOriginal, totalDiscount, subtotal, selectedCount } = useMemo(() => {
    const selected = items.filter(
      (i) => selectedIds.has(i.id) && i.book.qty! > 0
    )
    let totalOriginal = 0
    let totalDiscount = 0

    for (const item of selected) {
      const price    = item.book.price
      const effPrice = item.book.discount_price ?? price
      totalOriginal += price * item.qty
      totalDiscount += (price - effPrice) * item.qty
    }

    return {
      totalOriginal,
      totalDiscount,
      subtotal: totalOriginal - totalDiscount,
      selectedCount: selected.length,
    }
  }, [items, selectedIds])

  const handleQtyChange = async (item: CartItem, delta: number) => {
    const newQty = item.qty + delta
    if (newQty < 1) return
    await updateCart.mutateAsync({ id: item.id, qty: newQty }, {
      onSuccess: (res) => {
        toast.success(res.message)
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

  const handleDelete = async (cartItemId: string) => {
    await deleteCart.mutateAsync(cartItemId, {
      onSuccess: (res) => {
        setSelectedIds((prev) => {
          const next = new Set(prev)
          next.delete(cartItemId)
          return next
        })
        toast.success(res.message)
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

  const handleDeleteSelected = async () => {
    try {
      await Promise.all([...selectedIds].map((id) => deleteCart.mutateAsync(id)))
      setSelectedIds(new Set())
      toast.success("Selected items removed")
    } catch {
      toast.error("Failed to remove some items")
    }
  }

  const hasOutOfStockSelected = items.some(
    item => selectedIds.has(item.id) && item.book.qty! <= 0
  )

  return (
    <>
      <section className="cart">
        <div className="relative pt-6 w-full px-5 md:px-32 pb-10 md:pb-20">
          <div className="container mx-auto">
            <Breadcrumb className="pb-5 md:pb-8">
              <BreadcrumbList>
                <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbPage>My Cart</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-lg md:text-2xl font-bold mb-3 md:mb-6">My Cart</h1>
            {!isLoading && items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <img className="mx-auto" width={160} height={160} src="/images/cart-empty.png" alt="empty data" />
                <h5 className="text-lg font-semibold mb-1">Your cart is empty</h5>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Let's start shopping and add your favorite books to your basket.
                </p>
                <div className="mt-6">
                  <Link to="/books" className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:opacity-90 transition">
                    Explore Books
                  </Link>
                </div>
              </div>
            ): (
              <div className="flex flex-col lg:flex-row gap-6 items-start">
                <div className="flex-1 space-y-3 w-full">
                  <div className="border rounded-lg px-4 py-3 flex items-center justify-between bg-white">
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <Checkbox
                        checked={allSelected}
                        onCheckedChange={toggleAll}
                      />
                      <span className="text-sm font-medium">All Item</span>
                    </label>
                    {selectedIds.size > 0 && (
                      <Button
                        variant={'ghost'}
                        size={'sm'}
                        onClick={handleDeleteSelected}
                        disabled={deleteCart.isPending}
                        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-destructive transition-colors">
                        <Trash2 className="w-4 h-4" />
                        Hapus
                      </Button>
                    )}
                  </div>

                  {isLoading ? (
                    <CartSkeleton />
                  ) : (
                    <div className="border rounded-lg bg-white overflow-hidden">
                      <div className="px-4 py-4 bg-gray-50 flex items-center gap-2 border-b"></div>
                      <div className="divide-y">
                        {items.map((item) => {
                          const isOutOfStock = item.book.qty! <= 0
                          const isSelected  = selectedIds.has(item.id)
                          const effectivePrice = item.book.discount_price ?? item.book.price
                          const hasDiscount = !!item.book.discount_price
                          const discountPct = hasDiscount
                            ? Math.round((1 - item.book.discount_price! / item.book.price) * 100)
                            : 0

                          return (
                            <div key={item.id} className="px-4 py-4 flex gap-4 items-start">
                              <Checkbox
                                checked={isSelected}
                                disabled={isOutOfStock}
                                onCheckedChange={() => toggleItem(item.id)}
                                className="mt-1 shrink-0"
                              />
                              <Link to={`/books/${item.book.slug}`} className="shrink-0">
                                <img src={item.book.image_url}
                                  alt={item.book.name}
                                  className="w-16 h-20 object-contain"
                                />
                              </Link>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-0.5">{item.book.author}</p>
                                    <Link to={`/books/${item.book.slug}`}>
                                      <p className="text-sm font-medium text-gray-800 line-clamp-2">
                                        {item.book.name}
                                      </p>
                                    </Link>
                                    {isOutOfStock && (
                                      <span className="inline-block mt-1 text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                                        Out of Stock
                                      </span>
                                    )}
                                  </div>
                                  <div className="hidden md:flex gap-4">
                                    <Button
                                      variant={'ghost'}
                                      size={'sm'}
                                      type="button"
                                      onClick={() => handleDelete(item.id)}
                                      disabled={deleteCart.isPending}
                                      className="text-gray-400 hover:text-destructive transition-colors shrink-0 p-1">
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                    <QtyControl
                                      qty={item.qty}
                                      onDecrease={() => handleQtyChange(item, -1)}
                                      onIncrease={() => handleQtyChange(item, +1)}
                                      disabled={updateCart.isPending || isOutOfStock}
                                    />
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 mt-2">
                                  <span className="text-sm font-semibold text-gray-900">
                                    {formatRp(effectivePrice)}
                                  </span>
                                  {hasDiscount && (
                                    <>
                                      <span className="text-xs text-gray-400 line-through">
                                        {formatRp(item.book.price)}
                                      </span>
                                      <span className="text-xs font-semibold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">
                                        {discountPct}%
                                      </span>
                                    </>
                                  )}
                                </div>

                                <div className="flex md:hidden mt-3 gap-4">
                                    <Button
                                      variant={'ghost'}
                                      size={'sm'}
                                      type="button"
                                      onClick={() => handleDelete(item.id)}
                                      disabled={deleteCart.isPending}
                                      className="text-gray-400 hover:text-destructive transition-colors shrink-0 p-1">
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                    <QtyControl
                                      qty={item.qty}
                                      onDecrease={() => handleQtyChange(item, -1)}
                                      onIncrease={() => handleQtyChange(item, +1)}
                                      disabled={updateCart.isPending || isOutOfStock}
                                    />
                                  </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
                <div className="w-full lg:w-80 shrink-0 lg:sticky lg:top-28">
                  <CartSummary
                    items={items}
                    selectedIds={selectedIds}
                    selectedCount={selectedCount}
                    totalOriginal={totalOriginal}
                    totalDiscount={totalDiscount}
                    subtotal={subtotal}
                    isLoading={isLoading}
                    hasOutOfStockSelected={hasOutOfStockSelected}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      <section className="recommended">
        <RecommendedBook />
      </section>
    </>
  )
}

export default CartPage