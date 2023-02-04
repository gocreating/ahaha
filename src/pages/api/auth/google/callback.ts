import { SESSION_COOKIE_KEY } from '@/utils/constant'
import { setCookie } from '@/utils/cookie'
import { createGoogleOAuthUserIfNotExist, signinEndUser } from '@/utils/endUser'
import { withMethodRequired } from '@/utils/route'
import jwt from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'

const jwksClient = require('jwks-client')

/**
 * @swagger
 * /api/auth/google/callback:
 *   post:
 *     tags:
 *       - auth
 */
export default withMethodRequired('GET')(
  async (req: NextApiRequest, res: NextApiResponse) => {
    // see: https://developers.google.com/identity/openid-connect/openid-connect?hl=en#exchangecode
    /*
    Sample query
    {
      code: '4/0AWtgzh5Ez2vv7oXgioDUEXA4d7_5VWyTFEPj7OYc_vyWqSHO_dKqVfZZ9IEZx50JX39uzA',
      scope: 'email profile https://www.googleapis.com/auth/userinfo.profile openid https://www.googleapis.com/auth/userinfo.email',
      authuser: '0',
      prompt: 'none'
    }
    */
    const { code } = req.query
    const accessTokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
        client_secret: process.env.GOOGLE_OAUTH_SECRET,
        redirect_uri: `${process.env.BASE_URL}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    })
    const data = await accessTokenRes.json()
    /*
    Sample accessTokenRes
    {
      access_token: 'ya29.a0AVvZVsqtCyTSxeaakQ0RIA0QMTHbhgARtzH4guo2FDS-GHuPvwkPPfHsoKsm4wcwJ1bRojuYHn3aHpdzIBjDra2Dfrd8T4pisMWa06NtTkasrB36Sn0chTX7TGxWRIX_JYV4nDZBbhUyBbWNJosvztsa9zRKaCgYKAfUSARMSFQGbdwaIS4QxFyBm-tS9B0oIWS5mrg0163',
      expires_in: 3599,
      scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid',
      token_type: 'Bearer',
      id_token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjI3NDA1MmEyYjY0NDg3NDU3NjRlNzJjMzU5MDk3MWQ5MGNmYjU4NWEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIxMDY5MjUwODc5OTE4LTVqOHNxaDhpbjBldTE1Z251ZTlxc2s2ZmU3cDhmcW43LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiMTA2OTI1MDg3OTkxOC01ajhzcWg4aW4wZXUxNWdudWU5cXNrNmZlN3A4ZnFuNy5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjEwNDQyNDMwODAxMDYzNTU0Njk1MCIsImVtYWlsIjoiZ29jcmVhdGluZ0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IjBENkRRd1B4T3Q5ODB6STBYeF9hQlEiLCJuYW1lIjoiQ1AgV2VuZyIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BRWRGVHA0Rzc4dGRrRTlLVlpidEd1UkZCaGMtYk93N293eEdtd1duLU1QVTdRPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IkNQIiwiZmFtaWx5X25hbWUiOiJXZW5nIiwibG9jYWxlIjoiemgtVFciLCJpYXQiOjE2NzU0NDQ1NTMsImV4cCI6MTY3NTQ0ODE1M30.M-PfzAgXI6iYTHyvpmLlM8IPqFflSu_zxxWTQVL9c1nXEx36QKUIPAFKBlgGpqt3u73vEPmbYSJk7o0LRDneTg6OOuJeboGmbi2saUjQN0sKZXznkCR33ihm0exv8gdimr0bNbhx9LN6mjbvTFfOIdOO6N6Olpz6FnMjNNMz4KSKdruTeo59qas8VZxo4t6iDQWBm1pJTnouOk1JlcTiZC6y2hQMJ-YuHi_h236BH71VShgfGHYVg6LQCV1xN6H0luiljpVVdTaacDWwJQumv-cX_z5UJC7hk77EHJgVz9F97P5uHbUTHbtUBx75D2aJukuaYkO0WE6tA-Tk7xwSyA'
    }
    */
    var client = jwksClient({
      // https://accounts.google.com/.well-known/openid-configuration
      jwksUri: 'https://www.googleapis.com/oauth2/v3/certs',
    })
    await jwt.verify(
      data.id_token,
      function getKey(header, callback) {
        client.getSigningKey(header.kid, function (_err: any, key: any) {
          var signingKey = key.publicKey || key.rsaPublicKey
          callback(null, signingKey)
        })
      },
      async function (_err, decodedData) {
        const endUser = await createGoogleOAuthUserIfNotExist(decodedData)
        const endUserSession = await signinEndUser(endUser)
        setCookie(res, SESSION_COOKIE_KEY, (endUserSession as any).reference, {
          path: '/',
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 7, // 1 week
          secure: true,
          sameSite: 'none',
        })
        res.redirect('/dashboard')
      }
    )
  }
)
