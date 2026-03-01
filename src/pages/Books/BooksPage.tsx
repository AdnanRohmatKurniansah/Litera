import { useBooksFilter } from "@/api/queries/book"
import { useCategories } from "@/api/queries/category"
import { BookCard, BookCardSkeleton } from "@/components/common/BookCard"
import { PageMetadata } from "@/components/common/PageMetadata"
import PaginationData from "@/components/common/Pagination"
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import type { Book, Category } from "@/types"
import { useNavigate, useSearchParams } from "react-router"
import FilterBook from "./FilterBook"

const Books = () => {
  PageMetadata({ title: "Book's List | Litera" })

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const page      = Number(searchParams.get("page") || 1)
  const keyword   = searchParams.get("search") || undefined
  const category  = searchParams.get("category") || "all"
  const language  = searchParams.get("language") || "all"
  const minPrice  = Number(searchParams.get("minPrice") || 0)
  const sortBy    = searchParams.get("sortBy") || "newest"

  const { data: categoryData } = useCategories({ limit: 50 })
  const categories: Category[] = categoryData?.data ?? []

  const { data, isLoading } = useBooksFilter({
    keyword,
    category: category === "all" ? undefined : category,
    language: language === "all" ? undefined : language,
    minPrice: minPrice > 0 ? minPrice : undefined,
    sortBy,
    page,
    limit: 24,
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

          <div className="main grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1 rounded-xl border p-4 h-fit block md:sticky top-24">
              <h2 className="font-semibold text-lg pb-4 border-b mb-2">Filters</h2>
              <FilterBook
                categories={categories}
                selectedCategory={category}
                setSelectedCategory={(val) => updateParam("category", val)}
                selectedLanguage={language}
                setSelectedLanguage={(val) => updateParam("language", val)}
                priceRange={[minPrice]}
                setPriceRange={(val) => updateParam("minPrice", String(val[0]))}
                sortBy={sortBy}
                setSortBy={(val) => updateParam("sortBy", val)}
              />
            </div>

            <div className="book-list md:col-span-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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