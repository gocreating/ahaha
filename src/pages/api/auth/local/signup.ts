import { EndUser } from '@/db/models'
import sequelize from '@/db/sequelize'
import { notifyEndUserWithEmailVerification } from '@/utils/notification'
import { withMethodRequired } from '@/utils/route'
import { isValidPassword } from '@/utils/validation'
import bcrypt from 'bcrypt'
import { NextApiRequest, NextApiResponse } from 'next'

/**
 * @swagger
 * /api/auth/local/signup:
 *   post:
 *     tags:
 *       - auth
 *     summary: Sign up a new end user
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
    const endUsers = await EndUser.findAll({
      where: {
        emailAddress: req.body.emailAddress,
      },
    })
    if (endUsers.length > 0) {
      res.status(400).json({ error: 'the email address has been signed up' })
      return
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const endUser = await sequelize.transaction(async (t) => {
      const endUser = await EndUser.create(
        {
          emailAddress: req.body.emailAddress,
          isEmailAddressVerified: false,
          hashedPassword,
          createTime: new Date(),
        },
        { transaction: t }
      )
      return endUser
    })
    await notifyEndUserWithEmailVerification(endUser)
    res.status(200).json({})
  }
)
