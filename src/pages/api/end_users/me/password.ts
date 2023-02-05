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
    const endUser = (await EndUser.findByPk(
      (req as any).endUserSession.endUser.reference
    )) as any
    if (!endUser) {
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
