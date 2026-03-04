import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { PageMetadata } from "@/components/common/PageMetadata"
import NavigationSide from "../_components/NavSide"
import { Separator } from "@/components/ui/separator"
import { BookCard, BookCardSkeleton } from "@/components/common/BookCard"
import type { Book } from "@/types"
import { useWishlist } from "@/api/queries/wishlist"
import { Link } from "react-router"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

const WishlistPage = () => {
  PageMetadata({ title: "My Wishlist | Litera" })

  const { data, isLoading } = useWishlist(true)

  const wishlistItems = data?.items ?? []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const books: Book[] = wishlistItems.map((item: any) => item.book)

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
                <BreadcrumbPage>Wishlist</BreadcrumbPage>
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
            <div className="wishlist col-span-4 md:col-span-3 mb-8">
              <div className='p-5 border border-gray-200 rounded-md'>
                <div className="flex flex-col gap-6">
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-1">My Wishlist</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 pb-4">Keep track of the books you love and plan to read.</p>
                        
                        <Separator />
                        <div className="grid grid-cols-2 pt-5 md:grid-cols-5 gap-4">
                            {isLoading ? (
                            Array.from({ length: 10 }).map((_, i) => <BookCardSkeleton key={i} />)
                            ) : books.length === 0 ? (
                            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                              <img className="mx-auto  w-[100px] md:w-[160px] h-[100px] md:h-[160px]" src="/images/wishlist-empty.png" alt="empty data" />
                              <h5 className="text-lg font-semibold text-gray-800 dark:text-white">
                                Your wishlist is empty
                              </h5>
                              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 max-w-md">
                                You haven’t added any books yet. Start exploring and save your favorite titles to your wishlist.
                              </p>

                              <div className="mt-6">
                                <Link to="/books"
                                  className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:opacity-90 transition">
                                  Explore Books
                                </Link>
                              </div>
                            </div>
                            ) : (
                            books.map((book: Book, i: number) => <BookCard key={i} book={book} />)
                            )}
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WishlistPage