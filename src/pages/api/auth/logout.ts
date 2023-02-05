import { SESSION_COOKIE_KEY } from '@/utils/constant'
import { setCookie } from '@/utils/cookie'
import { withEndUserSession, withMethodRequired } from '@/utils/route'
import { NextApiRequest, NextApiResponse } from 'next'

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags:
 *       - auth
 */
export default withMethodRequired('POST')(
  withEndUserSession(async (req: NextApiRequest, res: NextApiResponse) => {
    const { endUserSession } = req as any
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
  })
)
