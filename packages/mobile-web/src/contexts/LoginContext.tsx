import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

import { useAxios, useCookies } from '@hook'
import { UserResponseDto } from '@api-type'

import { CookieKeys } from './types'
import { API_URL } from '../../config'

type LoginContextType = Partial<{
  me: UserResponseDto | null
  loginToken: string
  isLoggedIn: boolean
  logout: () => void
  refetch: () => void
  setLoginTokenCookie: (token: string, expires: Date) => void
}>

const LoginContext = createContext<LoginContextType>({})

export const LoginContextProvider = ({ children }: PropsWithChildren) => {
  const [cookies, setCookie, removeCookie] = useCookies([CookieKeys.LoginToken])
  const cookieLoginToken = cookies[CookieKeys.LoginToken]
  const { setAuthorization } = useAxios()
  const router = useRouter()

  const browser = typeof window !== 'undefined'
  const [loginToken, setLoginToken] = useState<string>(browser && cookieLoginToken)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!loginToken)
  const [me, setMe] = useState<UserResponseDto | null>()

  const fetchMe = async () => {
    try {
      const response = (await axios.get(`${API_URL}/me`, { headers: { Authorization: `Bearer ${loginToken}` } })) as any
      if (response.data?.me) {
        setIsLoggedIn(true)
        setMe(response.data.me)
      } else {
        setIsLoggedIn(false)
        removeCookie(CookieKeys.LoginToken)
      }
    } catch (e) {
      console.error(e)
      setIsLoggedIn(false)
      removeCookie(CookieKeys.LoginToken)
    }
  }

  useEffect(() => {
    setAuthorization(loginToken)
  }, [loginToken, setAuthorization])

  useEffect(() => {
    fetchMe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginToken])

  const setLoginTokenCookie = (token: string, expires: Date) => {
    setCookie(CookieKeys.LoginToken, token, { expires })
    setLoginToken(token)
  }

  const logout = () => {
    removeCookie(CookieKeys.LoginToken)
    setLoginToken('')
    setAuthorization(loginToken)
    router.push('/')
  }

  return (
    <LoginContext.Provider value={{ me, loginToken, isLoggedIn, refetch: fetchMe, setLoginTokenCookie, logout }}>
      {children}
    </LoginContext.Provider>
  )
}

export const useLoginContext = () => useContext(LoginContext)
