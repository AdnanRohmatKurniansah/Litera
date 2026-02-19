import type { Category } from "@/types"
import { Link } from "react-router"


const CategoryCard = ({ category }: {category: Category}) => {
  return (
    <Link to={`/tours?category=${category.slug}`} className="relative flex-shrink-0 w-52 md:w-60 h-36 md:h-44 rounded-2xl overflow-hidden group cursor-pointer">
      <img src={category.image_url} alt={category.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 px-3 pb-3">
        <span className="text-white font-bold text-sm md:text-base leading-tight line-clamp-2 drop-shadow">
          {category.name}
        </span>
      </div>
    </Link>
  )
}

const CategoryCardSkeleton = () => (
  <div className="flex-shrink-0 w-52 md:w-60 h-36 md:h-44 rounded-2xl bg-gray-200 animate-pulse" />
)

export { CategoryCard, CategoryCardSkeleton }