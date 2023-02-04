import Link from 'next/link'

export default function PrimaryNav() {
  return (
    <>
      <ul>
        <li>
          <Link href="/api-doc">Swagger Doc</Link>
        </li>
        <li>
          <Link href="/">Dashboard</Link>
        </li>
        <li>
          <Link href="/auth/signup">Signup</Link>
        </li>
        <li>
          <Link href="/auth/signin">Signin</Link>
        </li>
      </ul>
      <hr />
    </>
  )
}
