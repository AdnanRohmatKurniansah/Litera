import { Menu, Search, ShoppingCart } from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Link, useNavigate } from "react-router"
import { useEffect, useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { useCategories } from "@/api/queries/category"
import type { Category } from "@/types"
import { useAuth } from "@/context/UserContext"
import UserDropdown from "./UserDropdown"
import { useCart } from "@/api/queries/cart"


interface MenuItem {
  title: string
  url: string
  description?: string
  icon?: React.ReactNode
  items?: MenuItem[]
}

interface HeaderProps {
  logo?: {
    url: string
    src: string
    alt: string
  }
  menu?: MenuItem[]
  option?: {
    register: {
      title: string
      url: string
    }
    login: {
      title: string
      url: string
    }
  }
}

const Header = ({
  logo = {
    url: "/",
    src: "/images/logo/logo.png",
    alt: "logo",
  },
  menu = [
    {
      title: 'About Us',
      url: '/about-us'
    },
    {
      title: 'Articles',
      url: '/articles'
    },
    {
      title: 'Terms & Conditions',
      url: '/terms-conditions'
    },
    {
      title: 'Privacy Policy',
      url: '/privacy-policy'
    }
  ],
  option = {
    register: { title: "Register", url: "/register" },
    login: { title: "Login", url: "/login" },
  },
}: HeaderProps) => {
  const searchParams = new URLSearchParams(location.search)
  const searchFromUrl = searchParams.get("search") || ""

  const [localSearch, setLocalSearch] = useState(searchFromUrl)
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  const { isAuthenticated, isInitialized, user } = useAuth()
  const { data, isLoading } = useCategories({ limit: 20 })
  const categories: Category[] = data?.data || []
  const { data: cart } = useCart(isAuthenticated)

  const cartCount = useMemo(() => {
    if (!cart?.items) return 0

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return cart.items.reduce((total: number, item: any) => {
      return total + (item.qty ?? 1)
    }, 0)

  }, [cart])

  useEffect(() => {
    setLocalSearch(searchFromUrl)
  }, [searchFromUrl])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 1)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const categoryMenuItem: MenuItem = {
    title: "Category",
    url: "/categories",
    items: isLoading
      ? [{ title: "Loading...", url: "#" }]
      : categories.map((cat: Category) => ({
          title: cat.name,
          url: `/books?category=${cat.slug}`
        })),
  }

  const desktopMenu: MenuItem[] = [categoryMenuItem]

  const mobileMenu: MenuItem[] = [categoryMenuItem, ...menu]

  const handleSearch = (
    e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault()

    const trimmed = localSearch.trim()

    if (!trimmed) {
      navigate("/books")
    } else {
      navigate(`/books?search=${encodeURIComponent(trimmed)}`)
    }
  }

  return (
    <div className="head relative">
     <div className={`fixed top-0 left-0 right-0 z-40 bg-primary px-5 md:px-24 overflow-hidden transition-all duration-300 ${scrolled ? "h-0 py-0" : "h-[25px] md:h-[32px] py-1 md:py-2"}`}>
        <div className="flex items-center gap-4 justify-end text-white container mx-auto">
          <Link to={"about-us"} className="ms-2 text-[11px] underline md:text-[13px] font-medium">
            About Us
          </Link>
          <Link to={"promo"} className="ms-2 text-[11px] underline md:text-[13px] font-medium">
            Promo
          </Link>
          <Link to={"contact-us"} className="ms-2 text-[11px] underline md:text-[13px] font-medium">
            Contact Us
          </Link>
        </div>
      </div>
      <section className={`fixed left-0 right-0 z-50 bg-white py-4 px-5 md:px-24 border-b shadow-sm transition-all duration-300 ${scrolled ? "top-0" : "top-[32px] md:top-[36px]"}`}>
        <div className="container mx-auto">
          <nav className="hidden lg:flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full">
              <Link to={logo.url} className="flex items-center gap-2 shrink-0">
                <img
                  src={logo.src}
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="h-14 w-auto"
                  alt={logo.alt}
                />
              </Link>

              <div className="flex-1 flex justify-center ps-20">
                <NavigationMenu>
                  <NavigationMenuList>
                    {desktopMenu.map((item) => renderMenuItem(item))}
                  </NavigationMenuList>
                </NavigationMenu>
              </div>

              <div className="relative w-full">
                <form onSubmit={handleSearch} className="relative w-full ps-2">
                  <span className="absolute inset-y-0 start-6 flex items-center text-gray-400">
                    <Search className="w-4 h-4" />
                  </span>
                  <Input
                    type="text"
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSearch(e)
                    }}
                    placeholder="Search books with title, author, publisher..."
                    className="w-full rounded-2xl h-12 border-2 py-3 ps-12 pe-4 text-sm focus:outline-none"
                  />
                </form>
              </div>

              <Link to={"/cart"} className="relative flex items-center ps-3 gap-2 shrink-0">
                <ShoppingCart className="text-gray-600 w-5 font-normal" />

                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>

            <div className="flex items-center gap-4 w-1/3 justify-end">
              {!isInitialized ? (
                <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
              ) : isAuthenticated && user ? (
                <UserDropdown user={user} />
              ) : (
                <div className="flex items-center gap-4">
                  <Button variant={"outline"} asChild size="lg">
                    <Link className="group" to={option.login.url}>
                      {option.login.title}
                    </Link>
                  </Button>
                  <Button asChild size="lg">
                    <Link className="group" to={option.register.url}>
                      {option.register.title}
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </nav>

          <div className="block lg:hidden">
            <div className="flex items-center justify-between">
              <Link to={logo.url} className="flex items-center gap-2">
                <img
                  width={0}
                  height={0}
                  sizes="100vw"
                  src={logo.src}
                  className="max-h-12 w-auto"
                  alt={logo.alt}
                />
              </Link>

              <div className="left flex gap-10">
                <Link to={"/cart"} className="flex justify-end items-center ps-3 gap-2 shrink-0">
                  <ShoppingCart className="text-gray-600 w-5 font-normal" />
                </Link>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Menu className="size-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>
                        <Link to={logo.url} className="flex items-center gap-2">
                          <img
                            width={0}
                            height={0}
                            sizes="100vw"
                            src={logo.src}
                            className="max-h-12 w-auto"
                            alt={logo.alt}
                          />
                        </Link>
                      </SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col gap-6 p-4">
                      <Accordion
                        type="single"
                        collapsible
                        className="flex w-full flex-col gap-4"
                      >
                        {mobileMenu.map((item) =>
                          renderMobileMenuItem(item, isLoading)
                        )}
                      </Accordion>

                      {!isInitialized ? (
                        <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
                      ) : isAuthenticated && user ? (
                        <UserDropdown user={user} />
                      ) : (
                        <div className="flex flex-col gap-3">
                          <Button variant={"outline"} asChild>
                            <Link to={option.login.url}>{option.login.title}</Link>
                          </Button>
                          <Button asChild>
                            <Link to={option.register.url}>{option.register.title}</Link>
                          </Button>
                        </div>
                      )}
                      <div className="search flex items-center relative w-full">
                        <form onSubmit={handleSearch} className="relative w-full">
                          <span className="absolute inset-y-0 start-4 pe-4 flex items-center text-gray-400">
                            <Search className="w-4 h-4" />
                          </span>
                          <Input
                            type="text"
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSearch(e)
                            }}
                            placeholder="Search books with title, author, publisher..."
                            className="w-full border-2 px-2 py-3 ps-10 rounded-full text-sm focus:outline-none focus:ring-none"
                          />
                        </form>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>

        </div>
      </section>
      <div className={`transition-all duration-300 ${scrolled ? "h-[72px]" : "h-[104px] md:h-[128px]"}`} />
    </div>
  )
}

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    const half = Math.ceil(item.items.length / 2)
    const col1 = item.items.slice(0, half)
    const col2 = item.items.slice(half)

    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className="bg-popover text-popover-foreground">
          <div className="flex w-[480px] max-h-[400px] overflow-y-auto p-3 gap-1">
            <ul className="flex flex-col gap-1 flex-1">
              {col1.map((subItem) => (
                <NavigationMenuLink asChild key={subItem.title}>
                  <SubMenuLink item={subItem} />
                </NavigationMenuLink>
              ))}
            </ul>

            {col2.length > 0 && (
              <div className="w-px bg-border mx-1 shrink-0" />
            )}

            {col2.length > 0 && (
              <ul className="flex flex-col gap-1 flex-1">
                {col2.map((subItem) => (
                  <NavigationMenuLink asChild key={subItem.title}>
                    <SubMenuLink item={subItem} />
                  </NavigationMenuLink>
                ))}
              </ul>
            )}
          </div>
        </NavigationMenuContent>
      </NavigationMenuItem>
    )
  }

  return (
    <NavigationMenuItem key={item.title}>
      <Link
        to={item.url}
        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground"
      >
        {item.title}
      </Link>
    </NavigationMenuItem>
  )
}

const renderMobileMenuItem = (item: MenuItem, isLoading?: boolean) => {
  if (item.items) {
    const half = Math.ceil(item.items.length / 2)
    const col1 = item.items.slice(0, half)
    const col2 = item.items.slice(half)

    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {isLoading && item.title === "Category" ? (
            <div className="px-3 py-2 text-sm text-muted-foreground animate-pulse">
              Loading categories...
            </div>
          ) : (
            <div className="flex gap-1 max-h-[300px] overflow-y-auto pr-1 ">
              <ul className="flex flex-col gap-1 flex-1">
                {col1.map((subItem) => (
                  <li key={subItem.title}>
                    <SubMenuLink item={subItem} />
                  </li>
                ))}
              </ul>

              {col2.length > 0 && (
                <div className="w-px bg-border mx-1 shrink-0" />
              )}

              {col2.length > 0 && (
                <ul className="flex flex-col gap-1 flex-1">
                  {col2.map((subItem) => (
                    <li key={subItem.title}>
                      <SubMenuLink item={subItem} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    )
  }

  return (
    <Link key={item.title} to={item.url} className="text-md font-semibold group">
      {item.title}
    </Link>
  )
}

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  return (
    <Link
      to={item.url}
      className="flex flex-row gap-3 rounded-md p-2.5 leading-none no-underline transition-colors outline-none select-none hover:bg-muted hover:text-accent-foreground items-center text-gray-600 font-light"
    >
      {item.icon && (
        <div className="shrink-0 text-foreground">{item.icon}</div>
      )}
      <div>
        <div className="text-sm font-semibold">{item.title}</div>
        {item.description && (
          <p className="text-sm leading-snug text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>
    </Link>
  )
}

export { Header }