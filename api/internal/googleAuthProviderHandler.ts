import { IncomingMessage, ServerResponse } from 'http'
import { handleErrorsForwardedApiRequest } from './api'
import {
    captchaVerify,
    captchaBadResponse,
    captchaErrorResponse,
} from './captcha'
import { LoginResponseInterface } from './loginHandler'
import { login } from './auth'

export default async function (req: IncomingMessage, res: ServerResponse) {
    res.setHeader('Content-Type', 'application/json')

    try {
        const captchaOk = await captchaVerify(req)

        if (!captchaOk) {
            captchaBadResponse(res)
            return
        }
    } catch (error: any) {
        captchaErrorResponse(error, res)
        return
    }

    let response = null

    try {
        response = await handleErrorsForwardedApiRequest<LoginResponseInterface>(
            req,
            res,
            {
                method: 'POST',
                url: '/auth/provider/google',
            }
        )
    } catch (error) {
        res.end()
        return
    }

    login(response, res)

    res.end()
}
