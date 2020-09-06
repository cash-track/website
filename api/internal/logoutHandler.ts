import { IncomingMessage, ServerResponse } from 'http'
import { handleErrorsForwardedApiRequest } from './api'
import { logout } from './auth'
import { parseCookies } from './cookies'

export default async function (req: IncomingMessage, res: ServerResponse) {
    res.setHeader('Content-Type', 'application/json')

    try {
        await handleErrorsForwardedApiRequest(req, res, {
            method: 'POST',
            url: '/auth/logout',
            data: {
                refreshToken: parseCookies(req.headers.cookie).getValue(
                    'cshtrkr'
                ),
            },
        })
    } catch (error) {}

    logout(res)

    res.end()
}
