import { useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner' 
import type { Book, Wishlist } from '@/types'
import { Link, useNavigate } from 'react-router'
import { useAddWishlist, useDeleteWishlist, useWishlist } from '@/api/queries/wishlist'
import { AxiosError } from 'axios'
import { useAuth } from '@/context/UserContext'

const BookCardSkeleton = () => (
  <Card className="overflow-hidden h-full gap-0 p-3 animate-pulse">
    <div className="w-full aspect-[4/4] rounded-md bg-gray-200 mb-3" />
    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
    <div className="h-3 bg-gray-200 rounded w-1/3 mb-2" />
    <div className="h-2 bg-gray-200 rounded w-1/4" />
  </Card>
)

const BookCard = ({ book }: { book: Book }) => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const { data: wishlist } = useWishlist(isAuthenticated)
  const addWishlist = useAddWishlist()
  const deleteWishlist = useDeleteWishlist()

  console.log(wishlist)

  const wishlistItem = useMemo(() => {
    if (!wishlist?.items) return null

    return wishlist?.items?.find((item: Wishlist) => item.bookId === book.id)
  }, [wishlist, book.id])

  const isWishlisted = !!wishlistItem

  const toggleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error('Please login first')
      navigate('/login')
      return
    }

    try {
      if (isWishlisted && wishlistItem) {
        await deleteWishlist.mutateAsync(wishlistItem.id, {
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
      } else {
        await addWishlist.mutateAsync(book.id, {
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
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message)
      } else {
        toast.error("Something went wrong")
      }
    }
  }

  return (
    <div className="group block h-full">
      <Card className="overflow-hidden h-full gap-0 p-3 hover:shadow-md transition-shadow">
        <div className="relative w-full aspect-[4/4] rounded-md overflow-hidden">
          <Link to={`/books/${book.slug}`}>
            <img alt={book.name} src={book.image_url} className="object-cover transition-transform duration-300 group-hover:scale-105"/>
          </Link>
          <div className="absolute right-2 top-2 z-10">
            <Button className="w-8 h-8 bg-white rounded-full p-0 hover:bg-white" onClick={toggleWishlist} type="button">
              <Heart className={`w-4 h-4 transition ${
                  isWishlisted ? 'fill-red-500 text-red-500' : 'text-black'
                }`} />
            </Button>
          </div>
        </div>
        <Link to={`/books/${book.slug}`}>
          <p className="text-[12px] font-medium text-gray-700 mt-2 flex">{book.author}</p>
          <h4 className="font-semibold leading-4.5 text-[14px] mt-1">{book.name}</h4>
          <div className="price font-semibold text-md mt-2">
            {book.discount_price && book.discount_price > 0 ? (
              <div className="font-semibold">
                <h5 className='text-[14px]'>Rp. {book.discount_price?.toLocaleString()}</h5>
                <h5 className="line-through text-[12px] text-red-600 me-2">
                  Rp. {book.price.toLocaleString()}
                </h5>
              </div>
            ) : (
              <h5 className="font-semibold text-[14px]">Rp. {book.price.toLocaleString()}</h5>
            )}
          </div>
        </Link>
      </Card>
    </div>
  )
}

export { BookCard, BookCardSkeleton }