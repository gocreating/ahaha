export const isValidPassword = (password: string): string | boolean => {
  if (!/[a-z]/.test(password)) {
    return 'at least one lower character'
  }
  if (!/[A-Z]/.test(password)) {
    return 'at least one upper character'
  }
  if (!/[0-9]/.test(password)) {
    return 'at least one digit character'
  }
  if (!/[!@#\$%\^\&*\)\(+=._-]/.test(password)) {
    return 'at least one special character'
  }
  if (password.length < 8) {
    return 'at least 8 characters'
  }
  return true
}
