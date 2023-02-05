import { SESSION_COOKIE_KEY } from '@/utils/constant'
import { setCookie } from '@/utils/cookie'
import { withMethodRequired } from '@/utils/route'
import { NextApiRequest, NextApiResponse } from 'next'

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags:
 *       - auth
 */
export default withMethodRequired('POST')(
  async (_req: NextApiRequest, res: NextApiResponse) => {
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
