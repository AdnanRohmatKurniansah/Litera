import Cookies from 'js-cookie'

const COOKIE_OPTIONS = {
  expires: 7, 
  secure: import.meta.env.PROD, 
  sameSite: 'strict' as const,
}

export const CookieService = {
  setUserToken: (token: string) => {
    Cookies.set('user_token', token, COOKIE_OPTIONS)
  },

  getUserToken: () => {
    return Cookies.get('user_token')
  },

  removeUserToken: () => {
    Cookies.remove('user_token')
  },
  clearAll: () => {
    Cookies.remove('user_token')
  },
}