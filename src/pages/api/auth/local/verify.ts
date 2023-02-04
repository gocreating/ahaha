import { EndUser } from '@/db/models'
import { NextApiRequest, NextApiResponse } from 'next'

/**
 * @swagger
 * /api/local/verify:
 *   get:
 *     tags:
 *       - auth
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.status(405)
    return
  }
  const endUser = await EndUser.findByPk(req.query.reference as string)
  if (!endUser) {
    res.status(400).json({ error: 'Malformed verification link' })
    return
  }
  ;(endUser as any).isEmailAddressVerified = true
  await endUser.save()
  res.redirect(302, `${process.env.BASE_URL}`)
}
