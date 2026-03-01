export type ApiErrorResponse = {
  success: boolean
  message: string
}

export type User = {
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

export type Category = {
  id: string
  name: string
  slug: string
  image_url: string
  created_at: string
  updated_at: string
}

export type Book = {
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

export type Article = {
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

export type Cart = {
  id: string
  userId: string
  bookId: string
  qty: number
  created_at: string
  updated_at: string
}

export type Review = {
  id: string
  userId: string
  bookId: string
  rating: number
  comment?: string
  created_at: string
  user?: {
    id: string
    name: string
    profile?: string
  }
  book?: {
    id: string
    name: string
    slug: string
    image_url?: string
    price?: number
    discount_price?: number
  }
}

export type Address = {
  id: string
  name: string
  phone: string
  province_id: string
  province: string
  city_id: string
  city: string
  district_id: string
  district: string
  street: string
  zip: string
  is_primary?: boolean
  created_at: string
  updated_at: string
}

export type CartItem = {
  id: string
  bookId: string
  qty: number
  book: Book
}

export type ShippingService = {
  service: string
  description: string
  cost: number
  etd: string
}

export type OrderItem = {
  id: string
  bookId: string
  qty: number
  price: number
  book: {
    id: string
    name: string
    slug: string
    image_url: string
    author: string
  }
}

export type OrderShipping = {
  id: string
  courier: string
  service: string
  description: string
  cost: number
  etd: string
}

export type OrderPayment = {
  id: string
  method: string | null
  status: 'Pending' | 'Paid' | 'Failed'
  token: string
  paid_at: string | null
}

export type OrderAddress = {
  id: string
  name: string
  phone: string
  province: string
  city: string
  district: string
  street: string
  zip: string
}

export type Order = {
  id: string
  receipt_number: string | null
  userId: string
  addressId: string | null
  status: 'Pending' | 'Paid' | 'Processing' | 'Completed' | 'Cancelled' | 'Failed'
  total: number
  note: string | null
  created_at: string
  items: OrderItem[]
  payment: OrderPayment | null
  shipping: OrderShipping | null
  address: OrderAddress | null
}