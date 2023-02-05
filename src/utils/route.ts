import { EndUser, EndUserSession } from '@/db/models'
import { SESSION_COOKIE_KEY } from '@/utils/constant'
import cookie from 'cookie'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

export const withMethodRequired =
  (method: string | string[]) =>
  (apiRoute: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (
      (typeof method === 'string' && req.method !== method) ||
      (Array.isArray(method) && !method.includes(req.method as string))
    ) {
      res.status(405).json({ error: 'method not allowed' })
      return
    }
    await apiRoute(req, res)
  }

export interface NextApiRequestWithEndUserSession extends NextApiRequest {
  endUserSession: EndUserSession
}

type NextApiHandlerWithEndUserSession<T = any> = (
  req: NextApiRequestWithEndUserSession,
  res: NextApiResponse<T>
) => unknown | Promise<unknown>

export const withEndUserSession =
  (apiRoute: NextApiHandlerWithEndUserSession) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    const cookies = cookie.parse(req.headers.cookie || '')
    const accessToken = cookies[SESSION_COOKIE_KEY]
    if (!accessToken) {
      res.status(401).json({ error: 'not authenticated' })
      return
    }
    const endUserSession = await EndUserSession.findOne({
      where: {
        reference: accessToken,
        isActive: true,
      },
      include: [
        {
          model: EndUser,
          as: 'endUser',
          attributes: [
            'reference',
            'name',
            'emailAddress',
            'isEmailAddressVerified',
          ],
        },
      ],
    })
    if (!endUserSession) {
      res.status(401).json({ error: 'not authenticated' })
      return
    }
    const reqWithEndUserSession: NextApiRequestWithEndUserSession =
      Object.assign(req, { endUserSession })
    await apiRoute(reqWithEndUserSession, res)
  }
