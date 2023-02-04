import { withEndUserSession } from '@/utils/route'
import { NextApiRequest, NextApiResponse } from 'next'

/**
 * @swagger
 * /api/end_users/me:
 *   post:
 *     tags:
 *       - end_user
 */
export default withEndUserSession(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
      res.status(405)
      return
    }
    const endUser = (req as any).endUserSession.endUser
    res.status(200).json({ data: endUser })
  }
)
