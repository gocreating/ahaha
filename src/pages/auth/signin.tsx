import PageLayout from '@/components/layouts/PageLayout'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FieldValues, useForm } from 'react-hook-form'

export default function Signin() {
  const router = useRouter()
  const signinForm = useForm()
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
          {...signinForm.register('password', { required: true })}
        />
        {signinForm.formState.errors.password && <span>Invalid password</span>}
        <br />
        <input type="submit" value="Signin" />
      </form>
      <Link href="/api/auth/google/authorize">Google Signin</Link>
    </PageLayout>
  )
}
