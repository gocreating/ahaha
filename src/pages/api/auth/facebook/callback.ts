import { SESSION_COOKIE_KEY } from '@/utils/constant'
import { setCookie } from '@/utils/cookie'
import {
  createFacebookOAuthUserIfNotExist,
  signinEndUser,
} from '@/utils/endUser'
import { withMethodRequired } from '@/utils/route'
import { NextApiRequest, NextApiResponse } from 'next'
import { URLSearchParams } from 'url'

/**
 * @swagger
 * /api/auth/facebook/callback:
 *   post:
 *     tags:
 *       - auth
 *     summary: Receive the result of Oauth 2.0 authorization code flow from Facebook
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *     responses:
 *       '302':
 *         description: "Redirect to dashboard if required permission are granted"
 */
export default withMethodRequired('GET')(
  async (req: NextApiRequest, res: NextApiResponse) => {
    // See: https://developers.facebook.com/docs/facebook-login/guides/access-tokens#apptokens
    const appAccessTokenRes = await fetch(
      `https://graph.facebook.com/v16.0/oauth/access_token?${new URLSearchParams(
        {
          client_id: process.env.FACEBOOK_OAUTH_CLIENT_ID as string,
          client_secret: process.env.FACEBOOK_OAUTH_SECRET as string,
          grant_type: 'client_credentials',
        }
      )}`
    )
    const { access_token: appAccessToken } = await appAccessTokenRes.json()

    // See: https://developers.facebook.com/docs/facebook-login/guides/advanced/manual-flow
    /*
    Sample query
    {
      code: 'AQC__-WyzV0TyBj8y4l6S21L62W7IF5_Kajj7aLtsHp6ha_zhyIRWL1GEU8-svh07SpaCcwawuYD-1H7pfJWnptJsbIhu5IFMLnsNC2gJE-7WBi70lUDVKxTDJdRCWC0Cgt7xrm1NxWxxCB5m5aDvKyL7MW-R4uLcO9jLdaOKqa_e4XEH_iN0F4aSuvDaIWBTQ40or-FdcqzzrB0UBNwf6790AuZO9w0ZR-oURShw-8jqzF8Ttz9wJyEg-Y5FSXlZuoTK8QBroEj5e7l8rQEx6VlIpcphZPPzC_Z5KBpUz4rVB9vHEi9aAXXsXjxAcxXMmGW3KPjHPs_DDwsBnAULa4OVUJ8y1YpXKXhP-V3q3RlhQUumP4ElLY-3B1LQHPw0So'
    }
    */
    const { code, error } = req.query
    if (error) {
      res.redirect(
        `/?${new URLSearchParams({
          error:
            'You declined the consent so the auth process has been stopped',
        })}`
      )
      return
    }
    const accessTokenRes = await fetch(
      `https://graph.facebook.com/v16.0/oauth/access_token?${new URLSearchParams(
        {
          client_id: process.env.FACEBOOK_OAUTH_CLIENT_ID as string,
          client_secret: process.env.FACEBOOK_OAUTH_SECRET as string,
          redirect_uri: `${process.env.BASE_URL}/api/auth/facebook/callback`,
          code: code as string,
        }
      )}`
    )
    const data = await accessTokenRes.json()

    /*
    Sample accessTokenRes
    {
      access_token: 'EAAKsdZCnYpu8BAESuxzh05P2bOPOvOwLZA6WTRFTq4cNXir7qNPINy9zwzNOSlc8PBiDPykaj9ZBgRar5selpxVJgAa4CR2Mste8ZBxQrYEOxMDLqFSVQppaUcpRbbu2O5Fgi3uF7H68xCluEZBiCSHYUGIxJTVupQe57uNWv4LXghZCiYwbyhV3x7ox0sLsiihNXdlnBYhpNWjjCoIkL6euZB9JREinyvlYK4IswHZAIgZDZD',
      token_type: 'bearer',
      expires_in: 5183789
    }
    */
    const verifyTokenRes = await fetch(
      `https://graph.facebook.com/debug_token?${new URLSearchParams({
        input_token: data.access_token,
        access_token: appAccessToken,
      })}`
    )
    const verifyTokenJson = await verifyTokenRes.json()
    /*
    Sample verifyTokenJson:
    {
      data: {
        app_id: '752581246232303',
        type: 'USER',
        application: 'Ahaha',
        data_access_expires_at: 1683306690,
        expires_at: 1680711361,
        is_valid: true,
        issued_at: 1675527361,
        scopes: [ 'email', 'public_profile' ],
        user_id: '5957827807637859'
      }
    }
    */

    // See: https://developers.facebook.com/docs/graph-api/reference/user/
    const profileRes = await fetch(
      `https://graph.facebook.com/v16.0/${
        verifyTokenJson.data.user_id
      }?${new URLSearchParams({
        access_token: data.access_token,
        fields: [
          'id',
          'first_name',
          'last_name',
          'middle_name',
          'name',
          'name_format',
          'picture',
          'short_name',
          'email',
        ].join(','),
      })}`
    )
    const profileJson = await profileRes.json()
    console.log('profileJson', profileJson)
    if (!profileJson.email) {
      res.redirect(
        `/?${new URLSearchParams({
          error:
            'You declined the email permission so the auth process has been stopped',
        })}`
      )
      return
    }
    const endUser = await createFacebookOAuthUserIfNotExist(profileJson)
    const endUserSession = await signinEndUser(endUser)
    setCookie(res, SESSION_COOKIE_KEY, endUserSession.reference!, {
      path: '/',
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 1 week
      secure: true,
      sameSite: 'none',
    })
    res.redirect('/dashboard')
  }
)
