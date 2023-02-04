import PageLayout from '@/components/layouts/PageLayout'
import { useEndUser } from '@/utils/auth'
import React from 'react'

export default function AuthPageLayout({
  children,
  ...rest
}: {
  children: React.ReactNode
}) {
  const { endUser } = useEndUser()
  return <PageLayout {...rest}>{endUser ? children : 'Forbidden'}</PageLayout>
}
