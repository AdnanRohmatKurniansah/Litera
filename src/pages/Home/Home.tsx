import { PageMetadata } from "@/components/common/PageMetadata"
import HeroSlide from "./_components/HeroSlide"
import BookCategory from "./_components/BookCategory"
import NewestBook from "./_components/NewestBook"
import DiscountedBook from "./_components/DiscountedBook"
import ArticleList from "./_components/ArticleList"
import Cta from "./_components/Cta"

const Home = () => {
  PageMetadata({
    title: "Litera | The Complete Book Center",
  })

  return (
    <div className='main'>
      <section className='hero-carousel'>
        <HeroSlide />
      </section>
      <section className="book-category">
        <BookCategory />
      </section>
      <section className="newest-book">
        <NewestBook />
      </section>
      <section className="discounted-book">
        <DiscountedBook />
      </section>
      <section className="discounted-book">
        <Cta />
      </section>
      <section className="article-list">
        <ArticleList />
      </section>
    </div>
  )
}

export default Home