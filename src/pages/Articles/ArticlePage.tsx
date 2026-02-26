import { useArticles } from "@/api/queries/article"
import { ArticleCard, ArticleCardSkeleton } from "@/components/common/ArticleCard"
import { PageMetadata } from "@/components/common/PageMetadata"
import PaginationData from "@/components/common/Pagination"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import type { Article } from "@/types"
import { useNavigate, useSearchParams } from "react-router"

const Articles = () => {
  PageMetadata({
    title: "Articles | Litera",
  })

  const navigate = useNavigate()

  const [searchParams] = useSearchParams()
  const page = Number(searchParams.get("page") || 1)

  const { data, isLoading } = useArticles({ page, limit: 9 })

  const articles: Article[] = data?.data ?? data ?? []
  const total: number = data?.total ?? 0
  const totalPages = Math.ceil(total / 9)

  return (
      <section className='articles'>
        <div className="relative pt-6 w-full px-5 md:px-32 pb-10 md:pb-20">
            <div className="container mx-auto">
                <Breadcrumb className="pb-5 md:pb-8">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Articles</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="relative w-full aspect-auto md:aspect-[20/4] rounded-2xl overflow-hidden mb-8 md:mb-12">
                    <img src="/images/banner/articles-banner.png" alt="Articles banner" className="w-full h-full"/>
                </div>
                <div className="section-title relative col-span-2 mb-6 md:mb-8">
                    <div className="title relative flex justify-start items-center mb-1">
                        <span className='absolute -top-2 -left-4 w-8 h-8 rounded-full bg-secondary -z-1'></span>
                        <h6 className="font-semibold text-primary text-[12px] md:text-[14px] tracking-wide uppercase">Our Articles</h6>
                    </div>
                    <div className="heading">
                        <h3 className="font-bold text-[18px] md:text-2xl">Stay updated with the latest insights in literature and learning.</h3>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {isLoading ? (
                        Array.from({ length: 9 }).map((_, i) => (
                            <ArticleCardSkeleton key={i} />
                        ))
                    ) : articles.length === 0 ? (
                        <div className="text-center text-gray-500 col-span-full my-20">
                            <img className="mx-auto" width={240} height={240} src={'/images/empty.png'} alt="empty data" />
                            <p className="mt-4 text-[16px] md:text-[18px]">No articles found</p>
                        </div>
                    ) : (
                        articles.map((article: Article, i: number) => (
                            <ArticleCard key={i} article={article} />
                        ))
                    )}
                </div>
                {articles.length > 0 && (
                    <div className="pagination my-8">
                        <PaginationData page={page} totalPages={totalPages} onPageChange={(p) => navigate(`/articles?page=${p}`)}  />
                    </div>
                )}
            </div>
        </div>
      </section>
  )
}

export default Articles