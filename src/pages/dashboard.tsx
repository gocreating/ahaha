import AuthPageLayout from '@/components/layouts/AuthPageLayout'
import { useEndUser } from '@/utils/auth'

export default function Dashboard() {
  const { endUser } = useEndUser()
  return <AuthPageLayout>Hello, {(endUser as any)?.name}</AuthPageLayout>
}
