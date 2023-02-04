import { EndUserProvider } from '@/utils/auth'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <EndUserProvider>
      <Component {...pageProps} />
    </EndUserProvider>
  )
}
