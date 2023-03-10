import AuthPageLayout from '@/components/layouts/AuthPageLayout'
import { useEndUser } from '@/utils/auth'
import Link from 'next/link'
import { useEffect } from 'react'
import { FieldValues, useForm } from 'react-hook-form'

export default function Dashboard() {
  const { endUser } = useEndUser()
  const updateProfileForm = useForm()

  useEffect(() => {
    if (endUser) {
      updateProfileForm.setValue('name', endUser.name)
    }
  }, [endUser])

  const onUpdateProfileFormSubmit = async (data: FieldValues) => {
    const res = await fetch('/api/end_users/me', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const { error } = await res.json()
      alert(error)
    } else {
      alert('saved!')
    }
  }

  return (
    <AuthPageLayout>
      <h1>Profile</h1>
      <ul>
        <li>
          <Link href="/auth/logout">Logout</Link>
        </li>
      </ul>
      <form
        onSubmit={updateProfileForm.handleSubmit(onUpdateProfileFormSubmit)}
      >
        <label>Email: {endUser?.emailAddress}</label>
        <br />
        <label>Name:</label>
        <input {...updateProfileForm.register('name')} />
        <br />
        <input type="submit" value="Save" />
      </form>
    </AuthPageLayout>
  )
}
