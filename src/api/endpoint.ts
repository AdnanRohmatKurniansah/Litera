export const API_ENDPOINTS = {
  AUTH: {
    USER_REGISTER: '/user/register',
    USER_LOGIN: '/user/login',
    USER_GOOGLE_LOGIN: '/user/login-google',
    USER_LOGOUT: '/user/logout',
    USER_PROFILE: '/user/profile',
    USER_PROFILE_UPDATE: '/user/update-profile',
    USER_CHANGE_PASSWORD: '/user/change-password',
  },

  ARTICLES: {
    LIST: '/article/published',                 
    DETAIL: (slug: string) => `/article/slug/${slug}`,
  },

  CATEGORIES: {
    LIST: '/category',                 
    DETAIL: (slug: string) => `/category/${slug}`,
  },

  BOOKS: {
    LIST: '/book',
    DETAIL: (slug: string) => `/book/slug/${slug}`,
    OTHER: (id: string) => `/book/other/${id}`,
    FILTER: '/book/filter',
    DISCOUNTED: '/book/discounted',
    RECOMMENDED: '/book/recommended',
  },

  BOOK_IMAGES: {
    LIST: (bookId: string) => `/book/images/${bookId}`,
  },

  CART: {
    LIST: '/cart',                 
    ADD: '/cart/add',
    UPDATE: (id: string) => `/cart/item/${id}`,
    DELETE: (id: string) => `/cart/item/delete/${id}`,
  },

  ADDRESSES: {
    LIST: '/address',
    DETAIL: (id: string) => `/address/${id}`,
    CREATE: '/address/create',
    UPDATE: (id: string) => `/address/update/${id}`,
    UPDATE_PRIMARY: (id: string) => `/address/change-primary/${id}`,
    DELETE:  (id: string) => `/address/delete/${id}`,
    PROVINCES: '/address/province',
    CITIES:  (provinceId: string) => `/address/city/${provinceId}`,
    DISTRICTS: (cityId: string) => `/address/district/${cityId}`,
    SHIPPING_COST: '/address/cost',
  },

  ORDERS: {
    CALLBACK: '/order/callback',
    SHIPPING_COST: '/order/cost',
    CHECKOUT: '/order/checkout',
    MY_LIST: '/order/my-orders',                          
    ARRIVED: (orderId: string) => `/order/arrived/${orderId}`,
    CANCEL: (orderId: string) => `/order/cancel/${orderId}`, 
    DETAIL: (orderId: string) => `/order/detail/${orderId}`,
  },

  REVIEWS: {
    BOOK_REVIEWS: (bookId: string) => `/review/book/${bookId}`,
    BOOK_RATING: (bookId: string) => `/review/book/${bookId}/rating`,
    MY_REVIEWS: '/review/my-reviews',
    DETAIL: (reviewId: string) => `/review/${reviewId}`,
    CREATE: '/review/create',
    UPDATE: (reviewId: string) => `/review/update/${reviewId}`,
    DELETE: (reviewId: string) => `/review/delete/${reviewId}`,
  },

  WISHLIST: {
    LIST: '/wishlist',
    ADD: '/wishlist/add',
    DELETE: (wishlistItemId: string) => `/wishlist/item/delete/${wishlistItemId}`,
  },
} as const