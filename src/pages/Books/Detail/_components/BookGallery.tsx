import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useBookImages } from '@/api/queries/book-images'
import type { Book } from '@/types'

interface GalleryImage {
  image_url: string
  name: string
}

interface Props {
  book: Book
}

const BookGallerySkeleton = () => {
  const [thumbnailCount, setThumbnailCount] = useState(3)
  
    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth >= 768) {
          setThumbnailCount(4) 
        } else {
          setThumbnailCount(3) 
        }
      }
  
      handleResize()
      window.addEventListener("resize", handleResize)
  
      return () => window.removeEventListener("resize", handleResize)
    }, [])
  return (
    <div className="mb-5 animate-pulse">
      <div className="relative w-full aspect-[4/4] rounded-md overflow-hidden mb-4">
        <div className="w-full h-[300px] md:h-[450px] bg-gray-200 rounded-lg" />
      </div>
      <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
        {Array.from({ length: thumbnailCount }).map((_, i) => (
          <div key={i} className="h-[90px] md:h-[100px] bg-gray-200 rounded-md" />
        ))}
      </div>
    </div>
  )
}

const BookGallery = ({ book }: Props) => {
  const { data, isLoading } = useBookImages(book.id)
  const [currentImage, setCurrentImage] = useState(0)

  if (isLoading) return <BookGallerySkeleton />

  const bookImages: GalleryImage[] = data?.data ?? []

  const galleryImages: GalleryImage[] = [
    { image_url: book.image_url, name: book.name },
    ...bookImages.map((img) => ({ image_url: img.image_url, name: img.name ?? book.name })),
  ]

  const active = galleryImages[currentImage]

  const handlePrev = () => {
    setCurrentImage((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentImage((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="mb-0 md:mb-5">
      <div className="relative w-full mb-4 rounded-lg overflow-hidden">
        <div className="relative w-full aspect-[4/4] rounded-md overflow-hidden">
          <img src={active.image_url} alt={active.name} className="object-contain w-full h-full rounded-lg"/>
        </div>
        {galleryImages.length > 1 && (
          <>
            <Button onClick={handlePrev} className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-2 rounded-full shadow">
              <ChevronLeft />
            </Button>
            <Button onClick={handleNext} className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-2 rounded-full shadow">
              <ChevronRight />
            </Button>
          </>
        )}
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
        {galleryImages.map((img, i) => (
          <div key={i} onClick={() => setCurrentImage(i)}
            className={`rounded-md cursor-pointer border overflow-hidden transition-colors ${
              i === currentImage ? 'border-gray-400' : 'border-transparent hover:border-gray-300'
            }`}>
            <img src={img.image_url} alt={img.name} className="object-contain h-[90px] md:h-[100px] w-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default BookGallery