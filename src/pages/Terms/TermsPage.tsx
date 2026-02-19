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

const termsData = [
  {
    value: "item-1",
    question: "1. General Terms of Use",
    answer:
      "By accessing and using Litera's services, you acknowledge that you have read, understood, and agreed to all applicable terms and conditions. Litera reserves the right to modify these terms at any time without prior notice. Continued use of the service after any changes are made constitutes your acceptance of the updated terms.",
  },
  {
    value: "item-2",
    question: "2. User Account",
    answer:
      "Users are required to register an account with accurate, complete, and up-to-date information. You are fully responsible for the security of your password and all activities that occur under your account. Litera is not liable for any losses resulting from unauthorized use of your account due to your own negligence.",
  },
  {
    value: "item-3",
    question: "3. Orders and Payment",
    answer:
      "All confirmed and paid orders are considered final. Litera accepts various payment methods including bank transfers, credit cards, and digital wallets. Prices listed on the platform already include applicable taxes. Litera reserves the right to cancel orders if there are indications of fraud or violations of these terms.",
  },
  {
    value: "item-4",
    question: "4. Shipping and Delivery",
    answer:
      "Deliveries are made through trusted logistics partners across Indonesia. Estimated delivery times vary depending on the destination. Litera is not responsible for delays caused by courier services, natural disasters, or circumstances beyond our control. Please ensure your shipping address is correct before completing payment.",
  },
  {
    value: "item-5",
    question: "5. Returns and Refunds",
    answer:
      "Returns may be requested within 7 business days of receiving the item, provided the product is in its original condition, unused, and with intact packaging. Refunds will be processed within 3–5 business days after the returned item has been verified by the Litera team. Return shipping costs are the buyer's responsibility unless the error is on Litera's part.",
  },
  {
    value: "item-6",
    question: "6. Intellectual Property Rights",
    answer:
      "All content on the Litera platform, including logos, designs, text, images, and other materials, is the property of Litera or its licensors. Copying, distributing, or using such content without written permission from Litera is strictly prohibited.",
  },
  {
    value: "item-7",
    question: "7. Limitation of Liability",
    answer:
      "Litera is not liable for any indirect, incidental, or consequential damages arising from the use of our services. In any case, Litera's total liability shall not exceed the amount paid by the user in the relevant transaction.",
  },
  {
    value: "item-8",
    question: "8. Privacy Policy",
    answer:
      "Your personal data is collected and processed in accordance with Litera's Privacy Policy, which forms an integral part of these terms and conditions. Litera is committed to protecting the confidentiality of user data and will not sell or share it with third parties without user consent, except as required by law.",
  },
  {
    value: "item-9",
    question: "9. Dispute Resolution",
    answer:
      "Any disputes arising from the use of Litera's services will first be resolved through mutual deliberation. If no agreement is reached, the dispute will be settled through the Indonesian National Arbitration Board (BANI) or a competent court in accordance with the laws of the Republic of Indonesia.",
  },
  {
    value: "item-10",
    question: "10. How to Contact Customer Service",
    answer:
      "If you have questions or issues regarding Litera's services, please contact our Customer Service team via Live Chat available on the platform or by email at support@litera.com. Our team is available on business days from 08:00 AM to 05:00 PM WIB.",
  },
]

const Terms = () => {
  PageMetadata({
    title: "Terms & Conditions | Litera",
  })

  return (
      <section className="terms">
        <div className="relative pt-6 w-full px-5 md:px-32 pb-10 md:pb-20">
          <div className="container mx-auto">
            <Breadcrumb className="pb-5 md:pb-8">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Terms & Conditions</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="relative w-full aspect-auto md:aspect-[20/4] rounded-2xl overflow-hidden mb-8 md:mb-12">
              <img
                src="/images/banner/terms-banner.png"
                alt="Terms & Conditions Banner"
                className="w-full h-full"
              />
            </div>
            <div className="section-title relative col-span-2 mb-0 md:mb-2">
              <div className="title relative flex justify-start items-center mb-1">
                <span className="absolute -top-2 -left-4 w-8 h-8 rounded-full bg-secondary -z-1"></span>
                <h6 className="font-semibold text-primary text-[12px] md:text-[14px] tracking-wide uppercase">
                  Terms & Conditions
                </h6>
              </div>
              <div className="heading">
                <h3 className="font-bold text-[18px] md:text-2xl">
                  Terms & Conditions of Using Litera
                </h3>
              </div>
            </div>
            <div className="max-w-full mt-3">
              <p className="text-gray-600 text-[14px] md:text-[15px] leading-7 mb-5 md:mb-8">
                Please read the following terms and conditions carefully before
                using Litera's services. By using our platform, you are deemed to
                have agreed to all applicable terms.
              </p>
              <Accordion type="single"
                collapsible
                defaultValue="item-1"
                className="w-full space-y-3">
                {termsData.map((item) => (
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

export default Terms