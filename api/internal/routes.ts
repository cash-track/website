import { IncomingMessage, ServerResponse } from 'http'
import { Router } from './router'
import {
    handleFullForwardedApiRequest,
    handleFullForwardedApiRequestWithCaptcha,
} from './api'
import loginHandler from './loginHandler'
import registerHandler from './registerHandler'
import logoutHandler from './logoutHandler'
import googleAuthProviderHandler from './googleAuthProviderHandler'

export default function (
    req: IncomingMessage,
    res: ServerResponse,
    _next: any
) {
    const router = new Router()

    router.get('/profile', handleFullForwardedApiRequest)
    router.post('/auth/login', loginHandler)
    router.post('/auth/provider/google', googleAuthProviderHandler)
    router.post('/auth/logout', logoutHandler)
    router.post('/auth/register', registerHandler)
    router.post('/auth/register/check/nick-name', handleFullForwardedApiRequest)
    router.post('/auth/email/confirmation/', handleFullForwardedApiRequest)
    router.post(
        '/auth/password/forgot',
        handleFullForwardedApiRequestWithCaptcha
    )
    router.post(
        '/auth/password/reset',
        handleFullForwardedApiRequestWithCaptcha
    )

    router.fallback(handleFullForwardedApiRequest)

    try {
        router.dispatch(req, res)
    } catch (error: any) {
        res.statusCode = 500
        res.write(
            JSON.stringify({
                message:
                    'Unexpected response from server. Please try again later.',
                error: error.toString(),
            })
        )
        res.end()
    }
}
