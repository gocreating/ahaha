import { EndUser } from '@/db/models'
import { withEndUserSession, withMethodRequired } from '@/utils/route'
import { isValidPassword } from '@/utils/validation'
import bcrypt from 'bcrypt'
import { NextApiRequest, NextApiResponse } from 'next'

/**
 * @swagger
 * /api/end_users/me/password:
 *   patch:
 *     tags:
 *       - end_user
 *     summary: Update password of current logged in end user
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       '400':
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
export default withMethodRequired('PATCH')(
  withEndUserSession(async (req: NextApiRequest, res: NextApiResponse) => {
    if (
      isValidPassword(req.body.oldPassword) !== true ||
      isValidPassword(req.body.newPassword) !== true
    ) {
      res.status(400).json({ error: 'invalid password format' })
      return
    }
    if (req.body.oldPassword === req.body.newPassword) {
      res
        .status(400)
        .json({ error: 'new password is the same as old password' })
      return
    }
    const endUser = await EndUser.findByPk(
      (req as any).endUserSession.endUser.reference
    )
    if (!endUser) {
      res.status(400).json({ error: 'invalid account' })
      return
    }
    if (!endUser.hashedPassword) {
      res.status(400).json({ error: 'invalid account' })
      return
    }
    const isMatch = await bcrypt.compare(
      req.body.oldPassword,
      endUser.hashedPassword
    )
    if (!isMatch) {
      res.status(400).json({ error: 'old password is incorrect' })
    }
    const hashedPassword = await bcrypt.hash(req.body.newPassword, 10)
    endUser.hashedPassword = hashedPassword
    await endUser.save()
    res.status(200).json({})
  })
)
