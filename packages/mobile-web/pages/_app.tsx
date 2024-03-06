import type { AppProps } from 'next/app'
import { CookiesProvider } from 'react-cookie'

import '@style/globals.css'
import { LoginContextProvider } from '@context'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CookiesProvider>
      <LoginContextProvider>
        <Component {...pageProps} />
      </LoginContextProvider>
    </CookiesProvider>
  )
}
