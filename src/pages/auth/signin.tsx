import PageLayout from '@/components/layouts/PageLayout'
import { useEndUser } from '@/utils/auth'
import { isValidPassword } from '@/utils/validation'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FieldValues, useForm } from 'react-hook-form'

export default function Signin() {
  const router = useRouter()
  const signinForm = useForm()
  const { sync } = useEndUser()
  const onSigninFormSubmit = async (data: FieldValues) => {
    const res = await fetch('/api/auth/local/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const { error } = await res.json()
      alert(error)
    } else {
      await sync()
      router.push('/')
    }
  }

  return (
    <PageLayout>
      <h1>Signin</h1>
      <form onSubmit={signinForm.handleSubmit(onSigninFormSubmit)}>
        <label>Email:</label>
        <input {...signinForm.register('emailAddress', { required: true })} />
        <br />
        <label>Password:</label>
        <input
          type="password"
          {...signinForm.register('password', {
            required: true,
            validate: isValidPassword,
          })}
        />
        {signinForm.formState.errors.password &&
          signinForm.formState.errors.password.type === 'validate' && (
            <span>
              {signinForm.formState.errors.password.message as string}
            </span>
          )}
        <br />
        <input
          type="submit"
          value={signinForm.formState.isSubmitting ? 'Signing in...' : 'Signin'}
          disabled={signinForm.formState.isSubmitting}
        />
      </form>
      <ul>
        <li>
          <Link href="/api/auth/google/authorize">Google Signin</Link>
        </li>
        <li>
          <Link href="/api/auth/facebook/authorize">Facebook Signin</Link>
        </li>
      </ul>
    </PageLayout>
  )
}
