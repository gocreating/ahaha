import PageLayout from '@/components/layouts/PageLayout'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Landing() {
  const router = useRouter()

  useEffect(() => {
    if (router.query.error) {
      alert(router.query.error)
    }
  }, [router.query.error])

  return (
    <PageLayout>
      <h1>Landing</h1>
      Welcome Ahaha!
    </PageLayout>
  )
}
