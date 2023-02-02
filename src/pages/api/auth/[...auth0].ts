import { handleAuth, handleLogin } from '@auth0/nextjs-auth0'

export default handleAuth({
  // See: https://auth0.github.io/nextjs-auth0/types/handlers_auth.Handlers.html
  signup: handleLogin({
    authorizationParams: { screen_hint: 'signup' },
  }),
})
