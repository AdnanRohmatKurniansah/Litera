import { PageMetadata } from "@/components/common/PageMetadata"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

const About = () => {
  PageMetadata({
    title: "About Us | Litera",
  })

  return (
      <section className='about-us'>
        <div className="relative pt-6 w-full px-5 md:px-32 pb-10 md:pb-20">
            <div className="container mx-auto">
                <Breadcrumb className="pb-5 md:pb-8">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>About Us</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="relative w-full aspect-auto md:aspect-[20/4] rounded-2xl overflow-hidden mb-8 md:mb-12">
                    <img src="/images/banner/about-banner.png" alt="About banner" className="w-full h-full"/>
                </div>
                <div className="section-title relative col-span-2 mb-0 md:mb-2">
                    <div className="title relative flex justify-start items-center mb-1">
                        <span className='absolute -top-2 -left-4 w-8 h-8 rounded-full bg-secondary -z-1'></span>
                        <h6 className="font-semibold text-primary text-[12px] md:text-[14px] tracking-wide uppercase">About Us</h6>
                    </div>
                    <div className="heading">
                        <h3 className="font-bold text-[18px] md:text-2xl">Information at a Glance About Us</h3>
                    </div>
                </div>
                <div className="max-w-full mt-4">
                    <div className="space-y-5 text-gray-700 text-[14px] md:text-[15px] leading-7">
                    <p>
                        Litera adalah toko buku online terpercaya di Indonesia yang menyediakan
                        berbagai pilihan buku berkualitas, mulai dari buku pendidikan, novel,
                        buku anak, referensi akademik, hingga buku pengembangan diri dan bisnis.
                    </p>
                    <p>
                        Litera hadir sebagai platform digital yang memudahkan masyarakat
                        Indonesia dalam mendapatkan akses buku secara cepat, aman, dan
                        praktis. Kami percaya bahwa membaca adalah langkah awal menuju masa
                        depan yang lebih baik.
                    </p>
                    <p>
                        Sejak didirikan, Litera berkomitmen untuk terus menghadirkan koleksi
                        buku terbaru dan terlengkap dengan harga yang kompetitif. Kami terus
                        mengembangkan sistem dan layanan agar pengalaman berbelanja menjadi
                        semakin nyaman, efisien, dan menyenangkan bagi pelanggan di seluruh
                        Indonesia.
                    </p>
                    <p>
                        Misi kami adalah meningkatkan literasi serta memberikan kemudahan akses
                        terhadap dunia pengetahuan dengan memanfaatkan teknologi digital.
                    </p>
                    <p>
                        Kenyamanan dan kepuasan pelanggan merupakan prioritas utama kami.
                        Litera terus menghadirkan fitur yang memudahkan pencarian buku,
                        transaksi yang aman, serta dukungan layanan pelanggan yang responsif.
                    </p>
                    </div>
                    <div className="mt-12">
                        <h5 className="text-lg font-semibold text-primary mb-4">
                            Bagaimana cara menghubungi Customer Service?
                        </h5>

                        <div className="space-y-2 text-gray-700 text-[14px] md:text-[15px]">
                            <p>Silakan hubungi layanan Customer Service kami melalui:</p>
                            <ul className="list-disc ps-5 space-y-1">
                                <li>Live Chat</li>
                                <li>Email: support@litera.com</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>
  )
}

export default About