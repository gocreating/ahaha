import { EndUser } from '@/db/models'
import { SESSION_COOKIE_KEY } from '@/utils/constant'
import { setCookie } from '@/utils/cookie'
import { signinEndUser } from '@/utils/endUser'
import { withMethodRequired } from '@/utils/route'
import { isValidPassword } from '@/utils/validation'
import bcrypt from 'bcrypt'
import { NextApiRequest, NextApiResponse } from 'next'

/**
 * @swagger
 * /api/auth/local/signin:
 *   post:
 *     tags:
 *       - auth
 *     summary: Sign in an existing end user
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emailAddress:
 *                 type: string
 *               password:
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
export default withMethodRequired('POST')(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (isValidPassword(req.body.password) !== true) {
      res.status(400).json({ error: 'invalid password format' })
      return
    }
    const endUser = await EndUser.findOne({
      where: {
        emailAddress: req.body.emailAddress,
      },
    })
    if (!endUser) {
      res.status(400).json({ error: 'invalid account' })
      return
    }
    if (!endUser.hashedPassword) {
      res.status(400).json({ error: 'invalid account' })
      return
    }
    const isMatch = await bcrypt.compare(
      req.body.password,
      endUser.hashedPassword
    )
    if (!isMatch) {
      res.status(400).json({ error: 'invalid account' })
    }
    const endUserSession = await signinEndUser(endUser)
    setCookie(res, SESSION_COOKIE_KEY, endUserSession.reference!, {
      path: '/',
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 1 week
      secure: true,
      sameSite: 'none',
    })
    res.status(200).json({})
  }
)
