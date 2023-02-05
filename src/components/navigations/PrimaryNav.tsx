import { useEndUser } from '@/utils/auth'
import Link from 'next/link'

export default function PrimaryNav() {
  const { endUser } = useEndUser()
  return (
    <>
      <ul>
        <li>
          <Link href="/api-doc">Swagger Doc</Link>
        </li>
        <li>
          <Link href="/admin">Admin</Link>
        </li>
        <li>
          <Link href="/">Landing</Link>
        </li>
        {!endUser && (
          <li>
            <Link href="/auth/signup">Signup</Link>
          </li>
        )}
        {!endUser && (
          <li>
            <Link href="/auth/signin">Signin</Link>
          </li>
        )}
        {endUser && (
          <li>
            <Link href="/profile">Profile</Link>
          </li>
        )}
        {endUser && (
          <li>
            <Link href="/dashboard">Dashboard</Link>
          </li>
        )}
      </ul>
      <hr />
    </>
  )
}
