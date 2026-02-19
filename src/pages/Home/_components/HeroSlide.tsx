import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel'
import { Link } from 'react-router'
import { useEffect, useState, useCallback } from 'react'

const heroBanners = [
  {
    title: 'Big Sale Up To 30%',
    image: '/images/banner/banner1.png',
    url: '#',
  },
  {
    title: 'New Arrival Books',
    image: '/images/banner/banner2.png',
    url: '#',
  },
  {
    title: 'Best Seller Collection',
    image: '/images/banner/banner3.png',
    url: '#',
  },
  {
    title: 'New Arrival',
    image: '/images/banner/banner2.png',
    url: '#',
  },
  {
    title: 'Best Seller',
    image: '/images/banner/banner3.png',
    url: '#',
  },
]

const HeroSlide = () => {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  const leftBanners = heroBanners.slice(0, 3)
  const sideBanners = heroBanners.slice(-2)

  useEffect(() => {
    if (!api) return

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap())
    }

    api.on('select', onSelect)
    api.on('reInit', onSelect)

    return () => {
      api.off('select', onSelect)
      api.off('reInit', onSelect)
    }
  }, [api])

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index)
    },
    [api]
  )

  return (
    <div className="relative w-full px-5 md:px-32 pb-5 md:pb-8">
      <div className="container mx-auto">
        <div className="py-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative">
            <Carousel setApi={setApi} opts={{ align: 'start', loop: true }} className="w-full overflow-hidden rounded-2xl">
              <CarouselContent>
                {heroBanners.map((banner, i) => (
                  <CarouselItem key={i} className="basis-full">
                    <Link to={banner.url}>
                      <Card className="overflow-hidden p-0 rounded-2xl group border-0 shadow-md">
                        <CardContent className="p-0 relative aspect-[2/1]">
                          <img
                            src={banner.image}
                            alt={banner.title}
                            className="w-full h-full overflow-hidden rounded-2xl"
                          />
                        </CardContent>
                      </Card>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5">
                {leftBanners.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollTo(i)
                    }}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`
                      h-2 rounded-full transition-all duration-300 ease-in-out
                      ${current === i
                        ? 'w-6 bg-white'
                        : 'w-2 bg-white/50 hover:bg-white/75'
                      }
                    `}
                  />
                ))}
              </div>
            </Carousel>
          </div>
          <div className="hidden md:flex flex-col gap-4">
            {sideBanners.map((banner, i) => (
              <Link key={i} to={banner.url} className="flex-1">
                <Card className="overflow-hidden p-0 rounded-2xl group border-0 shadow-md h-full">
                  <CardContent className="p-0 relative h-37.5">
                    <img
                      src={banner.image}
                      alt={banner.title}
                      className="w-full object-cover"
                    />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSlide