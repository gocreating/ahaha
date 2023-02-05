import { SESSION_COOKIE_KEY } from '@/utils/constant'
import { setCookie } from '@/utils/cookie'
import {
  NextApiRequestWithEndUserSession,
  withEndUserSession,
  withMethodRequired,
} from '@/utils/route'
import { NextApiResponse } from 'next'

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags:
 *       - auth
 *     summary: Logout current session
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
export default withMethodRequired('POST')(
  withEndUserSession(
    async (req: NextApiRequestWithEndUserSession, res: NextApiResponse) => {
      const { endUserSession } = req
      endUserSession.isActive = false
      await endUserSession.save()
      setCookie(res, SESSION_COOKIE_KEY, '', {
        path: '/',
        httpOnly: true,
        maxAge: 0,
        secure: true,
        sameSite: 'none',
      })
      res.status(200).json({})
    }
  )
)
