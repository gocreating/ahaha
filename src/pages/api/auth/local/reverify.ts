import { notifyEndUserWithEmailVerification } from '@/utils/notification'
import {
  NextApiRequestWithEndUserSession,
  withEndUserSession,
  withMethodRequired,
} from '@/utils/route'
import { NextApiResponse } from 'next'

/**
 * @swagger
 * /api/auth/local/reverify:
 *   post:
 *     tags:
 *       - auth
 *     summary: Manually invoke verification process for current logged in end user
 *     responses:
 *       '403':
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
export default withMethodRequired('POST')(
  withEndUserSession(
    async (req: NextApiRequestWithEndUserSession, res: NextApiResponse) => {
      const endUser = req.endUserSession.endUser!
      if (endUser.isEmailAddressVerified) {
        res.status(403).json({ error: 'Forbidden' })
        return
      }
      await notifyEndUserWithEmailVerification(endUser)
      res.status(200).json({})
    }
  )
)
