import { EndUser } from '@/db/models'
import sequelize from '@/db/sequelize'
import sendgrid from '@/notification/sendgrid'
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
        isEmailAddressVerified: true,
      },
    })
    if (endUsers.length > 0) {
      res.status(400).json({ error: 'duplicate email address' })
      return
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const user = await sequelize.transaction(async (t) => {
      const user = await EndUser.create(
        {
          emailAddress: req.body.emailAddress,
          isEmailAddressVerified: false,
          hashedPassword,
        },
        { transaction: t }
      )
      return user
    })
    await sendgrid.send({
      to: req.body.emailAddress,
      from: 'no-reply@lation.app',
      subject: 'Ahaha Email Verification',
      html: `<a href="${process.env.BASE_URL}/api/auth/local/verify?reference=${
        (user as any).reference
      }">Verify this email</a>`,
    })
    res.status(201).json({})
  }
)
