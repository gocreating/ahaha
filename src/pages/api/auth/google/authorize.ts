import { withMethodRequired } from '@/utils/route'
import { NextApiRequest, NextApiResponse } from 'next'

/**
 * @swagger
 * /api/auth/google/authorize:
 *   post:
 *     tags:
 *       - auth
 *     summary: Initiate OAuth 2.0 authorization code flow with Google
 *     responses:
 *       '302':
 *         description: Redirect to Google's authorization endpoint
 */
export default withMethodRequired('GET')(
  async (req: NextApiRequest, res: NextApiResponse) => {
    // See: https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow?hl=en#oauth-2.0-endpoints
    const authEndpoint = new URL('https://accounts.google.com/o/oauth2/v2/auth')
    authEndpoint.searchParams.append(
      'client_id',
      `${process.env.GOOGLE_OAUTH_CLIENT_ID}`
    )
    authEndpoint.searchParams.append(
      'redirect_uri',
      `${process.env.BASE_URL}/api/auth/google/callback`
    )
    authEndpoint.searchParams.append('response_type', 'code')
    // https://developers.google.com/identity/protocols/oauth2/scopes?hl=zh-tw
    authEndpoint.searchParams.append(
      'scope',
      [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ].join(' ')
    )
    res.redirect(authEndpoint.href)
  }
)
