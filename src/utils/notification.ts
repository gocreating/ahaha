import sendgrid from '@/notification/sendgrid'

export const notifyEndUserWithEmailVerification = async (endUser: any) => {
  await sendgrid.send({
    to: endUser.emailAddress,
    from: 'no-reply@lation.app',
    subject: 'Ahaha Email Verification',
    html: `<a href="${process.env.BASE_URL}/api/auth/local/verify?reference=${endUser.reference}">Verify this email</a>`,
  })
}
