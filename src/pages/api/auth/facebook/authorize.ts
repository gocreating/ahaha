import { withMethodRequired } from '@/utils/route'
import { NextApiRequest, NextApiResponse } from 'next'

/**
 * @swagger
 * /api/auth/facebook/authorize:
 *   post:
 *     tags:
 *       - auth
 *     summary: Initiate OAuth 2.0 authorization code flow with Facebook
 *     responses:
 *       '302':
 *         description: Redirect to Facebook's authorization endpoint
 */
export default withMethodRequired('GET')(
  async (req: NextApiRequest, res: NextApiResponse) => {
    // See: https://developers.facebook.com/docs/facebook-login/guides/advanced/manual-flow
    const authEndpoint = new URL('https://www.facebook.com/v16.0/dialog/oauth')
    authEndpoint.searchParams.append(
      'client_id',
      `${process.env.FACEBOOK_OAUTH_CLIENT_ID}`
    )
    authEndpoint.searchParams.append(
      'redirect_uri',
      `${process.env.BASE_URL}/api/auth/facebook/callback`
    )
    authEndpoint.searchParams.append('response_type', 'code')
    authEndpoint.searchParams.append(
      'scope',
      ['public_profile', 'email'].join(' ')
    )
    res.redirect(authEndpoint.href)
  }
)
