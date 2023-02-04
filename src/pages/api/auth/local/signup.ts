import { EndUser } from '@/db/models'
import sequelize from '@/db/sequelize'
import sendgrid from '@/notification/sendgrid'
import bcrypt from 'bcrypt'
import { NextApiRequest, NextApiResponse } from 'next'

/**
 * @swagger
 * /api/local/signup:
 *   post:
 *     tags:
 *       - auth
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405)
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
  const _sendgridRes = await sendgrid.send({
    to: req.body.emailAddress,
    from: 'no-reply@lation.app',
    subject: 'Ahaha Email Verification',
    html: `<a href="${process.env.BASE_URL}/api/auth/local/verify?reference=${
      (user as any).reference
    }">Verify this email</a>`,
  })

  //   setCookie(res, 'ACCESS-TOKEN', 'testtest!', {
  //     path: '/',
  //     maxAge: 86400 * 30,
  //   })
  res.status(201).json({})
}
