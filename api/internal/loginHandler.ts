import { IncomingMessage, ServerResponse } from 'http'
import { handleErrorsForwardedApiRequest } from './api'
import { login, TokensResponseInterface } from './auth'

export interface LoginResponseInterface extends TokensResponseInterface {
    accessToken: string
    accessTokenExpiredAt: string
    refreshToken: string
    refreshTokenExpiredAt: string
}

export default async function (req: IncomingMessage, res: ServerResponse) {
    res.setHeader('Content-Type', 'application/json')

    let response = null

    try {
        response = await handleErrorsForwardedApiRequest<LoginResponseInterface>(req, res, {
            method: 'POST',
            url: '/auth/login',
        })
    } catch (error) {
        res.end()
        return
    }

    login(response, res)

    res.end()
}
