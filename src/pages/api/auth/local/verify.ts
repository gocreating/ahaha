import { EndUser } from '@/db/models'
import { withMethodRequired } from '@/utils/route'
import { NextApiRequest, NextApiResponse } from 'next'

/**
 * @swagger
 * /api/auth/local/verify:
 *   get:
 *     tags:
 *       - auth
 */
export default withMethodRequired('GET')(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const endUser = await EndUser.findByPk(req.query.reference as string)
    if (!endUser) {
      res.status(400).json({ error: 'Malformed verification link' })
      return
    }
    ;(endUser as any).isEmailAddressVerified = true
    await endUser.save()
    res.redirect(302, `${process.env.BASE_URL}`)
  }
)
