import { PageMetadata } from "@/components/common/PageMetadata"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Card, CardContent } from "@/components/ui/card"
import { Link } from "react-router"

const Promo = () => {
  PageMetadata({
    title: "Promo | Litera",
  })

  const promoBanner = [
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
    }
  ]

  return (
      <section className='promo'>
        <div className="relative pt-6 w-full px-5 md:px-32 pb-10 md:pb-20">
            <div className="container mx-auto">
                <Breadcrumb className="pb-5 md:pb-8">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Promo</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="relative w-full aspect-auto md:aspect-[20/4] rounded-2xl overflow-hidden mb-8 md:mb-12">
                    <img src="/images/banner/promo-banner.png" alt="Promo banner" className="w-full h-full"/>
                </div>
                <div className="section-title relative col-span-2 mb-6 md:mb-8">
                    <div className="title relative flex justify-start items-center mb-1">
                        <span className='absolute -top-2 -left-4 w-8 h-8 rounded-full bg-secondary -z-1'></span>
                        <h6 className="font-semibold text-primary text-[12px] md:text-[14px] tracking-wide uppercase">Our Promo</h6>
                    </div>
                    <div className="heading">
                        <h3 className="font-bold text-[18px] md:text-2xl">Discover exclusive deals and limited-time offers.</h3>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {promoBanner.map((promo, i: number) => (
                        <Link key={i} to={promo.url} className="flex-1">
                            <Card className="overflow-hidden p-0 rounded-2xl group border-0 shadow-md h-full">
                                <CardContent className="p-0 relative">
                                    <img src={promo.image} alt={promo.title} className="w-full object-cover" />
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
      </section>
  )
}

export default Promo