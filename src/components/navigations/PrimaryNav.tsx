import { useUser } from '@auth0/nextjs-auth0/client'
import Link from 'next/link'

export default function PrimaryNav() {
  const { user, error, isLoading } = useUser()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error.message}</div>
  }

  return (
    <>
      <ul>
        <li>
          <Link href="/">Dashboard</Link>
        </li>
        <li>
          <Link href="/auth/signup">Signup</Link>
        </li>
        <li>
          <Link href="/auth/signup">Signin</Link>
        </li>
      </ul>
      <hr />
    </>
  )

  return (
    <nav>
      <ul>
        <li>
          <Link href="/api-doc">Swagger</Link>
        </li>
      </ul>
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
    </nav>
  )
}
