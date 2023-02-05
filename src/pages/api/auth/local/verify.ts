import { EndUser } from '@/db/models'
import { SESSION_COOKIE_KEY } from '@/utils/constant'
import { setCookie } from '@/utils/cookie'
import { signinEndUser } from '@/utils/endUser'
import { withMethodRequired } from '@/utils/route'
import { NextApiRequest, NextApiResponse } from 'next'

/**
 * @swagger
 * /api/auth/local/verify:
 *   get:
 *     tags:
 *       - auth
 */
export default withMethodRequired('GET')(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const endUser = await EndUser.findByPk(req.query.reference as string)
    if (!endUser) {
      res.status(400).json({ error: 'Malformed verification link' })
      return
    }
    ;(endUser as any).isEmailAddressVerified = true
    await endUser.save()
    const endUserSession = await signinEndUser(endUser)
    setCookie(res, SESSION_COOKIE_KEY, endUserSession.reference, {
      path: '/',
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 1 week
      secure: true,
      sameSite: 'none',
    })
    res.redirect(302, `${process.env.BASE_URL}/dashboard`)
  }
)
