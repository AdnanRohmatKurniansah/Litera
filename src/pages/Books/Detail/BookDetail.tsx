import { useBooksDetail } from "@/api/queries/book"
import { PageMetadata } from "@/components/common/PageMetadata"
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Share2, ShoppingCart } from "lucide-react"
import { Navigate, useNavigate, useParams } from "react-router"
import { toast } from "sonner"
import BookGallery from "./_components/BookGallery"
import { BookDetailSkeleton } from "./_components/BookDetailSkeleton"
import { formatDate } from "@/lib/utils"
import OtherBook from "./OtherBook"
import { useAuth } from "@/context/UserContext"
import { useAddCart, useCart, useDeleteCart } from "@/api/queries/cart"
import type { Cart } from "@/types"
import { AxiosError } from "axios"
import { useMemo } from "react"

const BookDetail = () => {
  const { slug } = useParams<{ slug: string }>()
  const { data, isLoading } = useBooksDetail(slug ?? "")
  const book = data?.data

  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const { data: cart } = useCart(isAuthenticated)
  const addCart = useAddCart()
  const deleteCart = useDeleteCart()

  PageMetadata({ title: `${book?.name ?? "Book Detail"} | Litera` })

  const CopyUrl = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => toast.success("URL successfully copied to clipboard!"))
      .catch(() => toast.error("Failed to copy URL."))
  }

  const cartItem = useMemo(() => {
    return cart?.find((item: Cart) => item.bookId === book?.id)
  }, [cart, book?.id])

  if (isLoading) {
    return (
      <section className="books-detail">
        <BookDetailSkeleton />
      </section>
    )
  }

  if (!book) return <Navigate to="/404" replace />

  const hasDiscount = book.discount_price && book.discount_price > 0

  const isCarted = !!cartItem

  const toggleCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login first')
      navigate('/login')
      return
    }

    if (book.qty === 0) return

    try {
      if (isCarted && cartItem) {
        await deleteCart.mutateAsync(cartItem.id)
        toast.success('Removed from cart')
      } else {
        await addCart.mutateAsync({
          bookId: book.id,
          qty: 1
        })
        toast.success('Added to cart')
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message)
      } else {
        toast.error("Something went wrong")
      }
    }
  }

  return (
    <section className="books-detail">
      <div className="relative pt-6 w-full px-5 md:px-32 pb-10 md:pb-20">
        <div className="container mx-auto">
          <Breadcrumb className="pb-5 md:pb-8">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/books">Books</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{book.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <BookGallery book={book} />
            </div>
            <div className="md:col-span-2 flex flex-col gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {book.qty === 0 && (
                    <Badge variant="outline" className="text-gray-400">Out of Stock</Badge>
                  )}
                </div>
                <h1 className="font-bold text-xl md:text-3xl mb-1">{book.name}</h1>
                <p className="text-muted-foreground text-sm">by {book.author}</p>
              </div>
              <div className="flex items-center gap-3">
                {hasDiscount ? (
                  <>
                    <span className="text-2xl font-bold text-primary">
                      Rp. {book.discount_price!.toLocaleString()}
                    </span>
                    <span className="text-base text-muted-foreground line-through">
                      Rp {book.price.toLocaleString()}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-primary">
                    Rp {book.price.toLocaleString()}
                  </span>
                )}
              </div>
              <div className="actions flex gap-3 flex-wrap">
                <Button disabled={book.qty === 0 || addCart.isPending || deleteCart.isPending} onClick={toggleCart} className="flex-1 md:flex-none">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {book.qty === 0
                  ? "Out of Stock"
                  : isCarted
                  ? "Remove from Cart"
                  : "Add to Cart"}
                </Button>
                <Button variant="outline" onClick={CopyUrl}>
                  <Share2 className="w-4 h-4 mr-1" /> Share
                </Button>
              </div>
              <Separator />
              <div className="book-desc">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {book.desc}
                </p>
              </div>
              <Separator />
              <div className="book-detail">
                <h3 className="font-semibold mb-4">Book's Detail</h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                    <div className="items-center gap-2 text-muted-foreground">
                        <div>Publisher</div>
                        <span className="font-medium text-foreground">{book.publisher}</span>
                    </div>
                    <div className="items-center gap-2 text-muted-foreground">
                        <div>Language</div>
                        <span className="font-medium text-foreground">{book.language}</span>
                    </div>
                    <div className="items-center gap-2 text-muted-foreground">
                        <div>Pages</div>
                        <span className="font-medium text-foreground">{book.page}</span>
                    </div>
                    <div className="items-center gap-2 text-muted-foreground">
                        <div>Published</div>
                        <span className="font-medium text-foreground">{formatDate(book.published_at)}</span>
                    </div>
                    <div className="items-center gap-2 text-muted-foreground">
                        <div>Pages</div>
                        <span className="font-medium text-foreground">{book.length} × {book.width} cm</span>
                    </div>
                    <div className="items-center gap-2 text-muted-foreground">
                        <div>Weight</div>
                        <span className="font-medium text-foreground">{book.weight} gram</span>
                    </div>
                    <div className="items-center gap-2 text-muted-foreground">
                        <div>Stock</div>
                        <span className="font-medium text-foreground">{book.qty ?? 0} pcs</span>
                    </div>
                </div>
              </div>

              <div className="review mt-6 md:mt-10">
                <h6 className="font-bold text-2xl tracking-wide mb-10">Product Reviews</h6>
                <div className="block md:flex gap-16 md:gap-32 items-center justify-center">
                  <img className="mx-auto md:mx-0" src="/images/review-empty.png" alt="Review empty" width={200} />
                  <div className="text-gray-700 font-medium text-center">
                    <h5 className="text-[18px] mb-1 font-bold">There are no reviews for this product yet</h5>
                    <p className="text-sm mb-4 text-gray-500">Be the first to leave a review!</p>
                    <Button className="w-2/4 md:w-full" variant={'outline'}>Write Review</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <OtherBook bookId={book.id} />
    </section>
  )
}

export default BookDetail