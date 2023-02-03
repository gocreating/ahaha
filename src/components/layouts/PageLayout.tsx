import Head from 'next/head'
import React from 'react'
import PrimaryNav from '../navigations/PrimaryNav'

export default function PageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Head>
        <title>Ahaha</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PrimaryNav />
      {children}
    </>
  )
}
