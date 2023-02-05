import AuthPageLayout from '@/components/layouts/AuthPageLayout'
import { useEndUser } from '@/utils/auth'

export default function Dashboard() {
  const { endUser } = useEndUser()
  return (
    <AuthPageLayout>
      <h1>Dashboard</h1>

      {endUser?.isEmailAddressVerified ? (
        <div>Hello, {endUser?.name || 'Unknown'}</div>
      ) : (
        <div>
          <button>Resend Email Verification</button>
        </div>
      )}
    </AuthPageLayout>
  )
}
