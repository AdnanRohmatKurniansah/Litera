import { PageMetadata } from "@/components/common/PageMetadata"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const privacyData = [
  {
    value: "item-1",
    question: "1. Information We Collect",
    answer:
      "We collect personal information that you provide directly to us when creating an account, placing an order, or contacting our support team. This includes your name, email address, phone number, shipping address, and payment details. We may also collect non-personal data such as browser type, device information, and browsing behavior on our platform through cookies and similar technologies.",
  },
  {
    value: "item-2",
    question: "2. How We Use Your Information",
    answer:
      "The information we collect is used to process and fulfill your orders, send order confirmations and shipping updates, provide customer support, personalize your shopping experience, and improve our platform. We may also use your email address to send promotional offers and newsletters, but only with your consent. You may opt out of marketing communications at any time.",
  },
  {
    value: "item-3",
    question: "3. Data Sharing and Disclosure",
    answer:
      "Litera does not sell, rent, or trade your personal data to third parties. We may share your information with trusted service providers who assist us in operating our platform, processing payments, and delivering orders — solely for those purposes and under strict confidentiality agreements. We may also disclose your data if required by applicable law, court order, or governmental authority.",
  },
  {
    value: "item-4",
    question: "4. Cookies and Tracking Technologies",
    answer:
      "We use cookies and similar tracking technologies to enhance your browsing experience, remember your preferences, and analyze site traffic. You can control cookie settings through your browser at any time. Disabling cookies may affect certain features and functionality of our platform.",
  },
  {
    value: "item-5",
    question: "5. Data Security",
    answer:
      "We implement industry-standard security measures to protect your personal data from unauthorized access, disclosure, alteration, or destruction. This includes SSL encryption for data transmission and secure storage practices. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.",
  },
  {
    value: "item-6",
    question: "6. Data Retention",
    answer:
      "We retain your personal data for as long as your account is active or as needed to provide our services. If you close your account, we will delete or anonymize your data within a reasonable period, unless we are required to retain it for legal or regulatory purposes.",
  },
  {
    value: "item-7",
    question: "7. Your Rights",
    answer:
      "You have the right to access, correct, or delete the personal data we hold about you. You may also request a copy of your data or withdraw consent for its processing at any time. To exercise any of these rights, please contact us at support@litera.com. We will respond to your request within 14 business days.",
  },
  {
    value: "item-8",
    question: "8. Third-Party Links",
    answer:
      "Our platform may contain links to third-party websites or services. Litera is not responsible for the privacy practices or content of those third parties. We encourage you to review the privacy policies of any external sites you visit.",
  },
  {
    value: "item-9",
    question: "9. Children's Privacy",
    answer:
      "Our services are not directed to individuals under the age of 13. We do not knowingly collect personal data from children. If we become aware that a child under 13 has provided us with personal information, we will take steps to delete such data promptly.",
  },
  {
    value: "item-10",
    question: "10. Changes to This Privacy Policy",
    answer:
      "Litera reserves the right to update this Privacy Policy at any time. Changes will be posted on this page with the updated effective date. We encourage you to review this policy periodically. Continued use of our platform after any changes constitutes your acceptance of the revised policy.",
  },
  {
    value: "item-11",
    question: "11. Contact Us",
    answer:
      "If you have any questions, concerns, or requests regarding this Privacy Policy or the handling of your personal data, please contact our team via Live Chat on the platform or by email at support@litera.com. Our team is available on business days from 08:00 AM to 05:00 PM WIB.",
  },
]

const Privacy = () => {
  PageMetadata({
    title: "Privacy Policy | Litera",
  })

  return (
      <section className="privacy">
        <div className="relative pt-6 w-full px-5 md:px-32 pb-10 md:pb-20">
          <div className="container mx-auto">
            <Breadcrumb className="pb-5 md:pb-8">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Privacy Policy</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="relative w-full aspect-auto md:aspect-[20/4] rounded-2xl overflow-hidden mb-8 md:mb-12">
              <img
                src="/images/banner/privacy-banner.png"
                alt="Privacy Policy Banner"
                className="w-full h-full"
              />
            </div>
            <div className="section-title relative col-span-2 mb-0 md:mb-2">
              <div className="title relative flex justify-start items-center mb-1">
                <span className="absolute -top-2 -left-4 w-8 h-8 rounded-full bg-secondary -z-1"></span>
                <h6 className="font-semibold text-primary text-[12px] md:text-[14px] tracking-wide uppercase">
                  Privacy Policy
                </h6>
              </div>
              <div className="heading">
                <h3 className="font-bold text-[18px] md:text-2xl">
                  Privacy Policy of Litera
                </h3>
              </div>
            </div>
            <div className="max-w-full mt-3">
              <p className="text-gray-600 text-[14px] md:text-[15px] leading-7 mb-5 md:mb-8">
                At Litera, we are committed to protecting your personal data and
                respecting your privacy. This policy explains how we collect, use,
                and safeguard the information you provide when using our platform.
              </p>

              <Accordion
                type="single"
                collapsible
                defaultValue="item-1"
                className="w-full space-y-3"
              >
                {privacyData.map((item) => (
                  <AccordionItem
                    key={item.value}
                    value={item.value}
                    className="border border-gray-200 rounded-xl px-5 shadow-sm"
                  >
                    <AccordionTrigger className="text-[14px] md:text-[15px] font-semibold text-gray-800 hover:text-primary hover:no-underline text-left">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 text-[13px] md:text-[14px] leading-7 pb-4">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </section>
  )
}

export default Privacy