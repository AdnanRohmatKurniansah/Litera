import { Outlet } from "react-router"
import { Header } from "./AppHeader"
import { Footer } from "./AppFooter"
import { PageMetadata } from "@/components/common/PageMetadata"

export default function AppLayout() {
  PageMetadata({
    description: "Temukan buku terbaik dan promo menarik di Litera.",
    keywords: "buku, toko buku online, novel",
  })

  return (
    <div className="layout">
      <Header />

      <main className="content">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}