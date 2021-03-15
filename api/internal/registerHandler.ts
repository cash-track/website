import { IncomingMessage, ServerResponse } from 'http'
import { handleErrorsForwardedApiRequest } from './api'
import { login, TokensResponseInterface } from './auth'
import {
    captchaVerify,
    captchaBadResponse,
    captchaErrorResponse,
} from './captcha'

export interface EntityIDResponseInterface {
    type: string
    id: string | number
}

export interface RegisterResponseInterface extends TokensResponseInterface {
    data: EntityIDResponseInterface
    accessToken: string
    accessTokenExpiredAt: string
    refreshToken: string
    refreshTokenExpiredAt: string
}

export default async function (req: IncomingMessage, res: ServerResponse) {
    res.setHeader('Content-Type', 'application/json')

    try {
        const captchaOk = await captchaVerify(req)

        if (!captchaOk) {
            captchaBadResponse(res)
            return
        }
    } catch (error) {
        captchaErrorResponse(error, res)
        return
    }

    let response = null

    try {
        response = await handleErrorsForwardedApiRequest<RegisterResponseInterface>(
            req,
            res,
            {
                method: 'POST',
                url: '/auth/register',
            }
        )
    } catch (error) {
        res.end()
        return
    }

    login(response, res)

    res.end()
}
