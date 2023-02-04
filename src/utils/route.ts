import { EndUser, EndUserSession } from '@/db/models'
import cookie from 'cookie'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { SESSION_COOKIE_KEY } from './constant'

export const withMethodRequired =
  (method: string) =>
  (apiRoute: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== method) {
      res.status(405).json({ error: 'method not allowed' })
      return
    }
    await apiRoute(req, res)
  }

export const withEndUserSession =
  (apiRoute: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    const cookies = cookie.parse(req.headers.cookie || '')
    const accessToken = cookies[SESSION_COOKIE_KEY]
    if (!accessToken) {
      res.status(401).json({ error: 'not authenticated' })
      return
    }
    ;(req as any).endUserSession = await EndUserSession.findOne({
      where: {
        reference: accessToken,
      },
      include: [
        {
          model: EndUser,
          as: 'endUser',
          attributes: ['name'],
        },
      ],
    })
    await apiRoute(req, res)
  }
