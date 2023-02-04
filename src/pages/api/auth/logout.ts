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
export default withMethodRequired('GET')(
  async (_req: NextApiRequest, res: NextApiResponse) => {
    setCookie(res, SESSION_COOKIE_KEY, '', {
      path: '/',
      httpOnly: true,
      maxAge: 0,
    })
    res.status(200).json({})
  }
)
