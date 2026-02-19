export interface ApiErrorResponse {
  success: boolean
  message: string
}

export interface User {
  id: string
  name?: string
  email?: string
  profile?: string
  provider: "Email" | "Google"
  phone?: string
  tokenVersion: number
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  image_url: string
  created_at: string
  updated_at: string
}

export interface Book {
  id: string
  name: string
  slug: string
  desc: string
  author: string
  publisher: string
  published_at: string
  language: string
  page: number
  length: number
  width: number
  weight: number
  price: number
  discount_price?: number
  qty?: number
  categoryId: string
  image_url: string
  created_at: string
  updated_at: string
}

export interface Article {
  id: string
  title: string
  slug: string
  content: string
  published_at: string
  image_url: string
  created_at: string
  updated_at: string
}

export type BookImage = {
  id: string
  title: string
  bookId: string
  image_url: string
  created_at: string
  updated_at: string
}

export type Wishlist = {
  id: string
  userId: string
  bookId: string
  created_at: string
  updated_at: string
}