import { useMemo } from 'react'
// eslint-disable-next-line import/named
import { Cookie, CookieSetOptions } from 'universal-cookie'
import { useCookies as useReactCookie } from 'react-cookie'

type UseCookies = [
  {
    [name: string]: any
  },
  (name: string, value: Cookie, options?: CookieSetOptions) => void,
  (name: string, options?: CookieSetOptions) => void,
]

export const useCookies = (keys: string[]): UseCookies => {
  const [_cookies, setCookie, removeCookie] = useReactCookie(keys)
  const cookies = useMemo(() => {
    return typeof window === 'object' ? Object.assign({}, _cookies) : _cookies
  }, [_cookies])

  return [cookies, setCookie, removeCookie]
}
