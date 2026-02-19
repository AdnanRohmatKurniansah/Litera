
import type { Article } from '@/types'
import { Link } from 'react-router'
import { Card } from '../ui/card'
import { formatDate, stripHtml } from '@/lib/utils'

const ArticleCardSkeleton = () => (
  <Card className="w-full h-full p-0 overflow-hidden animate-pulse">
    <div className="w-full aspect-[4/2] bg-gray-200" />
    <div className="px-4 pb-8 space-y-2">
      <div className="h-4 w-full bg-gray-200 rounded" />
      <div className="h-4 w-2/3 bg-gray-200 rounded" />
      <div className="h-4 w-1/3 pt-2 bg-gray-200 rounded" />
    </div>
  </Card>
)

const ArticleCard = ({ article }: { article: Article }) => {
  return (
    <div className="group block h-full">
      <Card className="overflow-hidden h-full gap-0 p-0 hover:shadow-md transition-shadow">
        <div className="relative w-full aspect-[4/2] overflow-hidden">
          <Link to={`/articles/${article.slug}`}>
            <img alt={article.title} src={article.image_url} className="object-cover transition-transform duration-300 group-hover:scale-105"/>
          </Link>
        </div>
        <Link className='p-4' to={`/articles/${article.slug}`}>
          <h4 className="font-semibold leading-5 text-[17px] mt-1 mb-3">{article.title}</h4>
          <p className="text-[14px] leading-5 font-medium text-gray-700 mt-2 flex mb-4">
            {article.content ? stripHtml(article.content).slice(0, 80) + "..." : "-"}
          </p>
          <span className='text-[14px] text-gray-700 font-medium'>{formatDate(article.published_at)}</span>
        </Link>
      </Card>
    </div>
  )
}

export { ArticleCard, ArticleCardSkeleton }