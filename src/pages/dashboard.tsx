import AuthPageLayout from '@/components/layouts/AuthPageLayout'
import { useEndUser } from '@/utils/auth'

export default function Dashboard() {
  const { endUser } = useEndUser()
  const handleResendEmailVerificationClick = async () => {
    const res = await fetch('/api/auth/local/reverify', {
      method: 'POST',
    })
    if (!res.ok) {
      const { error } = await res.json()
      alert(error)
    } else {
      alert('please check your email!')
    }
  }

  return (
    <AuthPageLayout>
      <h1>Dashboard</h1>

      {endUser?.isEmailAddressVerified ? (
        <div>Hello, {endUser?.name || 'Unknown'}</div>
      ) : (
        <div>
          <button onClick={handleResendEmailVerificationClick}>
            Resend Email Verification
          </button>
        </div>
      )}
    </AuthPageLayout>
  )
}
