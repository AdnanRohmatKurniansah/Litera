import type { Book } from '@/types'
import { BookCard, BookCardSkeleton } from '@/components/common/BookCard'
import { useBooksRecommended } from '@/api/queries/book'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'

const RecommendedBook = () => {
  const { data, isLoading } = useBooksRecommended({ limit: 20 })
  const books: Book[] = data?.data ?? data ?? []

  return (
    <div className="relative w-full px-5 md:px-32 pb-5 md:pb-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-3 md:grid-cols-3 gap-4 items-center">
          <div className="section-title relative col-span-2 mb-0 md:mb-2">
            <div className="title relative flex justify-start items-center mb-1">
              <span className='absolute -top-2 -left-4 w-8 h-8 rounded-full bg-secondary -z-1'></span>
              <h6 className="font-semibold text-primary text-[12px] md:text-[14px] tracking-wide uppercase">Recommended Book</h6>
            </div>
            <div className="heading">
              <h3 className="font-bold text-[18px] md:text-2xl">Discover our handpicked books just for you.</h3>
            </div>
          </div>
        </div>
        <div className="slide py-6">
          <Carousel opts={{ align: "start" }}className="w-full">
            <CarouselContent className='ps-2 py-2'>
              {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <CarouselItem key={i} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6 px-1 md:px-2">
                    <BookCardSkeleton />
                  </CarouselItem>
                ))
              : books.map((book: Book, i: number) => (
                <CarouselItem key={i} className="group basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6 px-1 md:px-2">
                  <BookCard book={book} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className='hidden absolute top-1/2 -left-5 w-12 h-12 md:flex' />
            <CarouselNext className='hidden absolute top-1/2 -right-5 w-12 h-12 md:flex' />
          </Carousel>
        </div>
      </div>
    </div>
  )
}

export default RecommendedBook