import { useEffect, useState } from "react"

export const BookDetailSkeleton = () => {
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
    <div className="relative pt-6 w-full px-5 md:px-32 pb-10 md:pb-20 animate-pulse">
      <div className="container mx-auto">
        <div className="flex items-center gap-2 pb-5 md:pb-8">
          <div className="h-4 w-10 bg-gray-200 rounded" />
          <div className="h-4 w-2 bg-gray-200 rounded" />
          <div className="h-4 w-16 bg-gray-200 rounded" />
          <div className="h-4 w-2 bg-gray-200 rounded" />
          <div className="h-4 w-40 bg-gray-200 rounded" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="w-full h-[300px] md:h-[450px] bg-gray-200 rounded-lg mb-4" />
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              {Array.from({ length: thumbnailCount }).map((_, i) => (
                <div
                  key={i}
                  className="h-[100px] md:h-[120px] bg-gray-200 rounded-md"
                />
              ))}
            </div>
          </div>

          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="h-5 w-24 bg-gray-200 rounded" />
              <div className="h-8 w-3/4 bg-gray-200 rounded" />
              <div className="h-4 w-1/3 bg-gray-200 rounded" />
            </div>

            <div className="flex items-center gap-3">
              <div className="h-8 w-36 bg-gray-200 rounded" />
              <div className="h-5 w-24 bg-gray-200 rounded" />
            </div>

            <div className="flex gap-3">
              <div className="h-10 w-36 bg-gray-200 rounded-md" />
              <div className="h-10 w-24 bg-gray-200 rounded-md" />
            </div>

            <div className="h-px w-full bg-gray-200" />

            <div className="space-y-2">
              <div className="h-5 w-28 bg-gray-200 rounded" />
              <div className="h-4 w-full bg-gray-200 rounded" />
              <div className="h-4 w-full bg-gray-200 rounded" />
              <div className="h-4 w-5/6 bg-gray-200 rounded" />
              <div className="h-4 w-full bg-gray-200 rounded" />
              <div className="h-4 w-4/6 bg-gray-200 rounded" />
            </div>

            <div className="h-px w-full bg-gray-200" />

            <div className="space-y-2">
              <div className="h-5 w-32 bg-gray-200 rounded" />
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 mt-2">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <div className="h-3 w-20 bg-gray-200 rounded" />
                    <div className="h-4 w-28 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}