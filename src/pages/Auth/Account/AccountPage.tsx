import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { PageMetadata } from "@/components/common/PageMetadata"
import { Menu } from "lucide-react"
import NavigationSide from "./_components/NavSide"
import ProfileForm from "./_components/ProfileForm"

const AccountPage = () => {
  PageMetadata({ title: "Account Information | Litera" })

  return (
    <section className="books-detail">
      <div className="relative pt-6 w-full px-5 md:px-32 pb-10 md:pb-20">
        <div className="container mx-auto">
          <Breadcrumb className="pb-5 md:pb-8">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Account</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-center gap-3 mb-4 md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="text-[12px] flex items-center gap-2">
                  <Menu className="w-3 h-3" />
                  Navigation
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[320px] overflow-y-auto">
                <SheetHeader className="pb-4 border-b mt-3">
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
                <NavigationSide />
              </SheetContent>
            </Sheet>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="nav-side relative md:sticky md:top-28 h-fit col-span-4 md:col-span-1 hidden md:block">
              <NavigationSide />
            </div>
            <div className="account col-span-4 md:col-span-3 mb-8">
              <ProfileForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AccountPage