import AuthPageLayout from '@/components/layouts/AuthPageLayout'
import { useEndUser } from '@/utils/auth'
import { isValidPassword } from '@/utils/validation'
import { FieldValues, useForm } from 'react-hook-form'

export default function Dashboard() {
  const { endUser } = useEndUser()
  const resetPasswordForm = useForm()
  const watchNewPassword = resetPasswordForm.watch('newPassword')

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

  const onResetPasswordFormSubmit = async (data: FieldValues) => {
    const res = await fetch('/api/end_users/me/password', {
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
      resetPasswordForm.reset({
        oldPassword: null,
        newPassword: null,
        confirmNewPassword: null,
      })
      alert('Your password has been reset successfully.')
    }
  }

  return (
    <AuthPageLayout>
      <h1>Dashboard</h1>

      {endUser?.isEmailAddressVerified ? (
        <div>
          Hello, {endUser?.name || 'Unknown'}
          <form
            onSubmit={resetPasswordForm.handleSubmit(onResetPasswordFormSubmit)}
          >
            <h2>Reset Password</h2>
            <label>Old Password:</label>
            <input
              type="password"
              {...resetPasswordForm.register('oldPassword', {
                required: true,
              })}
            />
            <br />
            <label>New Password:</label>
            <input
              type="password"
              {...resetPasswordForm.register('newPassword', {
                required: true,
                validate: isValidPassword,
              })}
            />
            <br />
            <label>Confirm New Password:</label>
            <input
              type="password"
              {...resetPasswordForm.register('confirmNewPassword', {
                required: true,
                validate: (v) => {
                  if (v !== watchNewPassword) {
                    return 'new password mismatch'
                  }
                  return isValidPassword(v)
                },
              })}
            />
            {resetPasswordForm.formState.errors.confirmNewPassword &&
              resetPasswordForm.formState.errors.confirmNewPassword.type ===
                'validate' && (
                <span>
                  {
                    resetPasswordForm.formState.errors.confirmNewPassword
                      .message as string
                  }
                </span>
              )}
            <br />
            <input
              type="submit"
              value={
                resetPasswordForm.formState.isSubmitting
                  ? 'Updating Password...'
                  : 'Update Password'
              }
              disabled={resetPasswordForm.formState.isSubmitting}
            />
          </form>
        </div>
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
