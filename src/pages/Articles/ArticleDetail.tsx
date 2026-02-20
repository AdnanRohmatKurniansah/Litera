import { useArticleDetail } from "@/api/queries/article"
import { PageMetadata } from "@/components/common/PageMetadata"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import { Calendar, Share2 } from "lucide-react"
import { useNavigate, useParams } from "react-router"
import { toast } from "sonner"
import { ArticleDetailSkeleton } from "./_components/ArticleDetailSkeleton"

const ArticleDetail = () => {
  PageMetadata({
    title: "Article Detail | Litera",
  })

  const navigate = useNavigate()
  const { slug } = useParams<{ slug: string }>()
  const { data, isLoading } = useArticleDetail(slug ?? "")
  const article = data?.data

  const CopyUrl = () => {
    const url = window.location.href
    navigator.clipboard
      .writeText(url)
      .then(() => toast.success("URL successfully copied to clipboard!"))
      .catch(() => toast.error("Failed to copy URL."))
  }

  if (!article && !isLoading) {
    navigate("/404", { replace: true })
    return null
  }

  return (
      <section className="articles-detail">
        {isLoading ? (
          <ArticleDetailSkeleton />
        ) : (
          <div className="relative pt-6 w-full px-5 md:px-32 pb-10 md:pb-20">
            <div className="container mx-auto">
                <Breadcrumb className="pb-5 md:pb-8">
                <BreadcrumbList>
                    <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                    <BreadcrumbLink href="/articles">Articles</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                    <BreadcrumbPage>{article!.title}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
                </Breadcrumb>
                <div className="relative w-full aspect-[8/4] md:aspect-[12/4] rounded-2xl overflow-hidden mb-8 md:mb-12">
                <img src={article!.image_url} alt={article!.title}
                    className="w-full h-full object-cover"
                />
                </div>
                <div className="section-title relative col-span-2 mb-3 md:mb-5">
                <div className="title relative flex justify-start items-center mb-1">
                    <span className="absolute -top-2 -left-4 w-8 h-8 rounded-full bg-secondary -z-1"></span>
                    <h6 className="font-semibold text-primary text-[12px] md:text-[14px] tracking-wide uppercase">
                    Article's Detail
                    </h6>
                </div>
                <div className="heading">
                    <h1 className="font-bold text-[18px] md:text-2xl mb-2">{article!.title}</h1>
                    <div className="text-sm col-span-2 text-gray-600 flex gap-5 flex-wrap">
                    <span className="flex items-center">
                        <Calendar className="w-4 me-2" /> {formatDate(article!.published_at)}
                    </span>
                    <Button variant="outline" size="sm" onClick={CopyUrl}>
                        <Share2 className="w-4 h-4 mr-1" /> Share
                    </Button>
                    </div>
                </div>
                </div>
                <div className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: article!.content }}
                />
            </div>
          </div>
        )}
      </section>
  )
}

export default ArticleDetail