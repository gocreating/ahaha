import {
  NextApiRequestWithEndUserSession,
  withEndUserSession,
  withMethodRequired,
} from '@/utils/route'
import { NextApiResponse } from 'next'

/**
 * @swagger
 * /api/end_users/me:
 *   get:
 *     tags:
 *       - end_user
 *     summary: Get profile of current logged in end user
 *     responses:
 *       '200':
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  data:
 *                    type: object
 *                    properties:
 *                      reference:
 *                        type: string
 *                      emailAddress:
 *                        type: string
 *                      isEmailAddressVerified:
 *                        type: boolean
 *                      name:
 *                        type: string
 *   patch:
 *     tags:
 *       - end_user
 *     summary: Update profile of current logged in end user
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
export default withMethodRequired(['GET', 'PATCH'])(
  withEndUserSession(
    async (req: NextApiRequestWithEndUserSession, res: NextApiResponse) => {
      const endUser = req.endUserSession.endUser!
      if (req.method === 'GET') {
        res.status(200).json({ data: endUser })
      } else if (req.method === 'PATCH') {
        endUser.name = req.body.name
        await endUser.save()
        res.status(200).json({})
      }
    }
  )
)
