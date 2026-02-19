import { PageMetadata } from "@/components/common/PageMetadata"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Mail, MapPin, Phone } from "lucide-react"
import { Link } from "react-router"

const contactInfo = [
  {
    icon: Mail,
    label: "Email Address",
    value: "support@litera.com",
    href: "mailto:support@litera.com",
  },
  {
    icon: Phone,
    label: "Phone Number",
    value: "+62 858 9999 9999",
    href: "tel:+6285899999999",
  },
  {
    icon: MapPin,
    label: "Our Location",
    value: "Yogyakarta, Indonesia",
    href: null,
  }
]

const Contact = () => {
  PageMetadata({
    title: "Contact Us | Litera",
  })

  return (
      <section className="about-us">
        <div className="relative pt-6 w-full px-5 md:px-32 pb-10 md:pb-20">
          <div className="container mx-auto">
            <Breadcrumb className="pb-5 md:pb-8">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Contact Us</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="relative w-full aspect-auto md:aspect-[20/4] rounded-2xl overflow-hidden mb-8 md:mb-12">
              <img src="/images/banner/contact-banner.png" alt="Contact Us Banner" className="w-full h-full" />
            </div>
            <div className="section-title relative col-span-2 mb-0 md:mb-2">
              <div className="title relative flex justify-start items-center mb-1">
                <span className="absolute -top-2 -left-4 w-8 h-8 rounded-full bg-secondary -z-1"></span>
                <h6 className="font-semibold text-primary text-[12px] md:text-[14px] tracking-wide uppercase">
                  Contact Us
                </h6>
              </div>
              <div className="heading">
                <h3 className="font-bold text-[18px] md:text-2xl">
                  Connect with Our Friendly Support Team
                </h3>
              </div>
            </div>
            <div className="max-w-full mt-6">
              <p className="font-semibold text-gray-800 text-[14px] md:text-[15px] mb-2">
                We're here to help — your comfort and convenience are our mission.
              </p>
              <p className="text-gray-600 text-[14px] md:text-[15px] leading-7 mb-8">
                Have questions or need assistance? Our dedicated team is always
                ready to offer fast, reliable support. Don't hesitate to reach out
                — we're just one message away.
              </p>
              <ul className="space-y-4">
                {contactInfo.map(({ icon: Icon, label, value, href }) => (
                  <li key={label} className="flex items-center gap-4 p-4 border shadow rounded-2xl">
                    <div className="icon p-2 w-10 h-10 flex items-center justify-center flex-shrink-0 rounded-full bg-primary text-white">
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="text-gray-500 text-[12px] md:text-[13px] font-medium">
                        {label}
                      </p>
                      {href ? (
                        <Link to={href} className="font-semibold text-[14px] md:text-[15px] text-gray-800 hover:text-primary transition-colors">
                          {value}
                        </Link>
                      ) : (
                        <p className="font-semibold text-[14px] md:text-[15px] text-gray-800">
                          {value}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
  )
}

export default Contact