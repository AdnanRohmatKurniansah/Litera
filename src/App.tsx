import { Route, Routes } from 'react-router'
import './App.css'
import Home from './pages/Home/Home'
import AppLayout from './layouts/AppLayout'
import NotFound from './pages/NotFound'
import About from './pages/About/AboutPage'
import Terms from './pages/Terms/TermsPage'
import Privacy from './pages/Privacy/PrivacyPage'
import Contact from './pages/Contact/ContactPage'
import Articles from './pages/Articles/ArticlePage'
import Promo from './pages/Promo/PromoPage'
import ScrollToTop from './components/common/ScrollToTop'
import ArticleDetail from './pages/Articles/ArticleDetail'
import Books from './pages/Books/BooksPage'
import BookDetail from './pages/Books/Detail/BookDetail'
import RegisterPage from './pages/Auth/Register/RegisterPage'
import GuestRoute from './layouts/guards/GuestRoute'
import LoginPage from './pages/Auth/Login/LoginPage'
import ProtectedRoute from './layouts/guards/ProtectedRoute'
import AccountPage from './pages/Auth/Account/AccountPage'
import WishlistPage from './pages/Auth/Account/Wishlist/WishlistPage'

function App() {

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route path="/" element={
          <AppLayout />
        }>
          <Route index element={<Home />} />
          <Route path='about-us' element={<About />} />
          <Route path='books' element={<Books />} />
          <Route path='books/:slug' element={<BookDetail />} />
          <Route path='articles' element={<Articles />} />
          <Route path='articles/:slug' element={<ArticleDetail />} />
          <Route path='promo' element={<Promo />} />
          <Route path='terms-conditions' element={<Terms />} />
          <Route path='privacy-policy' element={<Privacy />} />
          <Route path='contact-us' element={<Contact />} />

          <Route path="/account" element={<ProtectedRoute />}>
            <Route index element={<AccountPage />} />
            <Route path="wishlist" element={<WishlistPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
