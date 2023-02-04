import { EndUser } from '@/db/models'
import { setCookie } from '@/utils/cookie'
import { signinEndUser } from '@/utils/endUser'
import { withMethodRequired } from '@/utils/route'
import bcrypt from 'bcrypt'
import { NextApiRequest, NextApiResponse } from 'next'

/**
 * @swagger
 * /api/auth/local/signin:
 *   post:
 *     tags:
 *       - auth
 */
export default withMethodRequired('POST')(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const endUser = await EndUser.findOne({
      where: {
        emailAddress: req.body.emailAddress,
        isEmailAddressVerified: true,
      },
    })
    if (!endUser) {
      res.status(400).json({ error: 'invalid account' })
      return
    }
    const isMatch = await bcrypt.compare(
      req.body.password,
      (endUser as any).hashedPassword
    )
    if (!isMatch) {
      res.status(400).json({ error: 'invalid account' })
    }
    const endUserSession = await signinEndUser(endUser)
    setCookie(res, 'ACCESS-TOKEN', (endUserSession as any).reference, {
      path: '/',
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })
    res.status(200).json({})
  }
)
