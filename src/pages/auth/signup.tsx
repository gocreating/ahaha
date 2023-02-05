import PageLayout from '@/components/layouts/PageLayout'
import { isValidPassword } from '@/utils/validation'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FieldValues, useForm } from 'react-hook-form'

export default function Signup() {
  const router = useRouter()
  const signupForm = useForm()
  const onSignupFormSubmit = async (data: FieldValues) => {
    const res = await fetch('/api/auth/local/signup', {
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
      router.push('/')
    }
  }

  return (
    <PageLayout>
      <h1>Signup</h1>
      <form onSubmit={signupForm.handleSubmit(onSignupFormSubmit)}>
        <label>Email:</label>
        <input {...signupForm.register('emailAddress', { required: true })} />
        <br />
        <label>Password:</label>
        <input
          type="password"
          {...signupForm.register('password', {
            required: true,
            validate: isValidPassword,
          })}
        />
        {signupForm.formState.errors.password &&
          signupForm.formState.errors.password.type === 'validate' && (
            <span>
              {signupForm.formState.errors.password.message as string}
            </span>
          )}
        <br />
        <input
          type="submit"
          value={signupForm.formState.isSubmitting ? 'Signing up...' : 'Signup'}
          disabled={signupForm.formState.isSubmitting}
        />
      </form>
      <ul>
        <li>
          <Link href="/api/auth/google/authorize">Google Signup</Link>
        </li>
        <li>
          <Link href="/api/auth/facebook/authorize">Facebook Signup</Link>
        </li>
      </ul>
    </PageLayout>
  )
}
