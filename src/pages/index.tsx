import { useUser } from '@auth0/nextjs-auth0/client'
import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  const { user, error, isLoading } = useUser()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error.message}</div>
  }

  return (
    <>
      <Head>
        <title>Ahaha</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {user ? (
        <ul>
          <li>
            <Link href="/api/auth/logout">Logout</Link>
          </li>
        </ul>
      ) : (
        <ul>
          <li>
            <Link href="/api/auth/signup">Sign Up</Link>
          </li>
          <li>
            <Link href="/api/auth/login">Sign In</Link>
          </li>
        </ul>
      )}
    </>
  )
}
