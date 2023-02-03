import sequelize from '@/db/sequelize'
import bcrypt from 'bcrypt'
import { NextApiRequest, NextApiResponse } from 'next'
import { EndUser } from '../../../../db/models'

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
  await sequelize.transaction(async (t) => {
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
  //   setCookie(res, 'ACCESS-TOKEN', 'testtest!', {
  //     path: '/',
  //     maxAge: 86400 * 30,
  //   })
  res.status(201).json({})
}
