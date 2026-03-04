import { useBooksFilter } from "@/api/queries/book"
import { useCategories } from "@/api/queries/category"
import { BookCard, BookCardSkeleton } from "@/components/common/BookCard"
import { PageMetadata } from "@/components/common/PageMetadata"
import PaginationData from "@/components/common/Pagination"
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import type { Book, Category } from "@/types"
import { SlidersHorizontal } from "lucide-react"
import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router"
import FilterBook from "./FilterBook"

const Books = () => {
  PageMetadata({ title: "Book's List | Litera" })

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  const page      = Number(searchParams.get("page") || 1)
  const keyword   = searchParams.get("search") || undefined
  const category  = searchParams.get("category") || "all"
  const language  = searchParams.get("language") || "all"
  const minPrice  = Number(searchParams.get("minPrice") || 0)
  const sortBy    = searchParams.get("sortBy") || "newest"

  const { data: categoryData, isLoading: isLoadingCategories } = useCategories({ limit: 50 })
  const categories: Category[] = categoryData?.data ?? []

  const { data, isLoading } = useBooksFilter({
    keyword,
    category: category === "all" ? undefined : category,
    language: language === "all" ? undefined : language,
    minPrice: minPrice > 0 ? minPrice : undefined,
    sortBy,
    page,
    limit: 25,
  })

  const books: Book[] = data?.data.data ?? []
  const total: number = data?.data.total ?? 0
  const totalPages = Math.ceil(total / 24)

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== "all" && value !== "0") {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete("page")
    navigate(`/books?${params.toString()}`)
  }

  const filterProps = {
    categories,
    selectedCategory: category,
    setSelectedCategory: (val: string) => updateParam("category", val),
    selectedLanguage: language,
    setSelectedLanguage: (val: string) => updateParam("language", val),
    priceRange: [minPrice],
    setPriceRange: (val: number[]) => updateParam("minPrice", String(val[0])),
    sortBy,
    setSortBy: (val: string) => updateParam("sortBy", val),
    isLoadingCategories,
  }

  const activeFilterCount = [
    category !== "all" ? 1 : 0,
    language !== "all" ? 1 : 0,
    minPrice > 0 ? 1 : 0,
    sortBy !== "newest" ? 1 : 0,
  ].reduce((a, b) => a + b, 0)

  return (
    <section className="articles">
      <div className="relative pt-6 w-full px-5 md:px-32 pb-10 md:pb-20">
        <div className="container mx-auto">
          <Breadcrumb className="pb-5 md:pb-8">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Books</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-center justify-between mb-4 md:hidden">
            <p className="text-sm text-muted-foreground">
              {isLoading ? (
                <span className="inline-block animate-pulse h-4 w-24 bg-gray-200 rounded" />
              ) : (
                `${total} books found`
              )}
            </p>
            <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="ml-1 inline-flex items-center justify-center w-4 h-4 text-[10px] font-semibold rounded-full bg-primary text-primary-foreground">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[340px] overflow-y-auto">
                <SheetHeader className="pb-4 border-b mb-2">
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <FilterBook {...filterProps} />
              </SheetContent>
            </Sheet>
          </div>

          <div className="main grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1 rounded-xl border p-4 h-fit hidden md:block md:sticky top-24">
              <h2 className="font-semibold text-lg pb-4 border-b mb-2">Filters</h2>
              <FilterBook {...filterProps} />
            </div>

            <div className="book-list md:col-span-3">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {isLoading ? (
                  Array.from({ length: 8 }).map((_, i) => <BookCardSkeleton key={i} />)
                ) : books.length === 0 ? (
                  <div className="text-center text-gray-500 col-span-full my-20">
                    <img className="mx-auto" width={240} height={240} src="/images/empty.png" alt="empty data" />
                    <p className="mt-4 text-[16px] md:text-[18px]">No books found</p>
                  </div>
                ) : (
                  books.map((book: Book, i: number) => <BookCard key={i} book={book} />)
                )}
              </div>

              {books.length > 0 && (
                <div className="pagination my-8">
                  <PaginationData
                    page={page}
                    totalPages={totalPages}
                    onPageChange={(p) => {
                      const params = new URLSearchParams(searchParams.toString())
                      params.set("page", String(p))
                      navigate(`/books?${params.toString()}`)
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Books