import PageLayout from '@/components/layouts/PageLayout'
import { useEndUser } from '@/utils/auth'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Logout() {
  const router = useRouter()
  const { sync } = useEndUser()

  useEffect(() => {
    const logout = async () => {
      await fetch('/api/auth/logout')
      await sync()
      router.push('/auth/signin')
    }
    logout()
  }, [])

  return <PageLayout>Logging out...</PageLayout>
}
