import { Button } from '@/components/ui/button'
import { ArrowRightCircle } from 'lucide-react'
import { Link } from 'react-router'
import { useCategories } from '@/api/queries/category'
import type { Category } from '@/types'
import { CategoryCard, CategoryCardSkeleton } from '@/components/common/CategoryCard'

const BookCategory = () => {
  const { data, isLoading } = useCategories({ limit: 20 })
  const categories: Category[] = data?.data ?? data ?? []

  return (
    <div className="relative w-full px-5 md:px-32 pb-14 md:pb-16">
      <div className="container mx-auto">
        <div className="grid grid-cols-3 md:grid-cols-3 gap-4 items-center">
          <div className="section-title relative col-span-2 mb-4">
            <div className="title relative flex justify-start items-center mb-1">
              <span className='absolute -top-2 -left-4 w-8 h-8 rounded-full bg-secondary -z-1'></span>
              <h6 className="font-semibold text-primary text-[12px] md:text-[14px] tracking-wide uppercase">Find Your Favorite Category</h6>
            </div>
            <div className="heading">
              <h3 className="font-bold text-[18px] md:text-2xl">Explore a wide range of book categories</h3>
            </div>
          </div>
          <div className="view-all flex justify-end">
            <Button variant={'outline'} className="px-3 md:px-5 py-2 md:py-4">
              <Link className="flex items-center text-[13px] md:text-normal" to="/books">
                See All <ArrowRightCircle className="w-5 ms-2" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="relative mt-3">
          <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide scroll-smooth">
            {isLoading ? Array.from({ length: 6 }).map((_, i) => <CategoryCardSkeleton key={i} />)
              : categories.map((cat: Category, i: number) => (
                <CategoryCard key={i} category={cat} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookCategory