import PageLayout from '@/components/layouts/PageLayout'
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
    if (res.ok) {
      router.push('/')
    }
  }

  return (
    <PageLayout>
      <form onSubmit={signupForm.handleSubmit(onSignupFormSubmit)}>
        <label>Email:</label>
        <input {...signupForm.register('emailAddress', { required: true })} />
        <br />
        <label>Password:</label>
        <input
          type="password"
          {...signupForm.register('password', { required: true })}
        />
        {signupForm.formState.errors.password && <span>Invalid password</span>}
        <br />
        <input type="submit" value="Signup" />
      </form>
    </PageLayout>
  )
}
