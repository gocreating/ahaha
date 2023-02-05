import { withEndUserSession, withMethodRequired } from '@/utils/route'
import { NextApiRequest, NextApiResponse } from 'next'

/**
 * @swagger
 * /api/end_users/me:
 *   get:
 *     tags:
 *       - end_user
 *   patch:
 *     tags:
 *       - end_user
 */
export default withMethodRequired(['GET', 'PATCH'])(
  withEndUserSession(async (req: NextApiRequest, res: NextApiResponse) => {
    const endUser = (req as any).endUserSession.endUser
    if (req.method === 'GET') {
      res.status(200).json({ data: endUser })
    } else if (req.method === 'PATCH') {
      endUser.name = req.body.name
      await endUser.save()
      res.status(200).json({})
    }
  })
)
