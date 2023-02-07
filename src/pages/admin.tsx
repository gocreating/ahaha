import PageLayout from '@/components/layouts/PageLayout'

export default function Admin() {
  return (
    <PageLayout>
      <details>
        <summary>Hello, testers from Aha:</summary>
        <p>
          If you do not have permissions to see the admin dashboard, I had sent
          you an email to request emails to grant to. Or if you have better
          options, please let me know.
          <br />
          The working admin dashboard should seem like the following image:
        </p>
        <img src="/admin-screenshot.png" />
      </details>
      <iframe
        src="https://lation.retool.com/apps/Ahaha"
        width="100%"
        height="800px"
      />
    </PageLayout>
  )
}
