import { IncomingMessage, ServerResponse } from 'http'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

interface CaptchaVerifyResponseInterface {
    success: boolean
    // eslint-disable-next-line camelcase
    challenge_ts: string
    hostname: string
    score: number
    'error-codes': Array<string> | undefined
}

export function captchaErrorResponse(error: Error, res: ServerResponse) {
    res.statusCode = 500
    res.write(
        JSON.stringify({
            message:
                'Unexpected response from captcha validation service. Please try again later.',
            error: error.toString(),
        })
    )
    res.end()
}

export function captchaBadResponse(res: ServerResponse) {
    res.statusCode = 400
    res.write(
        JSON.stringify({
            message: 'Captcha triggered. Please try again.',
        })
    )
    res.end()
}

export async function captchaVerify(req: IncomingMessage): Promise<boolean> {
    const secret = process.env.CAPTCHA_SECRET_KEY
    const response = req.headers['x-ct-captcha-challenge']
    const remoteIP = getClientIP(req)

    if (typeof response === 'undefined' || response === '') {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return new Promise<boolean>((resolve, reject) => {
            return reject(new Error('Missing captcha challenge token'))
        })
    }

    const request: AxiosRequestConfig = {
        method: 'POST',
        url: 'https://www.google.com/recaptcha/api/siteverify',
        params: {
            secret,
            response,
            remoteIP,
        },
    }

    let res: AxiosResponse<CaptchaVerifyResponseInterface>

    try {
        res = await axios.request<CaptchaVerifyResponseInterface>(request)
    } catch (e) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return new Promise<boolean>((resolve, reject) => {
            return reject(e)
        })
    }

    if (res.data.success) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return new Promise<boolean>((resolve, reject) => {
            return resolve(true)
        })
    }

    let error = `Captcha score ${res.data.score}.`

    if (res.data['error-codes'] !== undefined) {
        error += ' Codes: ' + res.data['error-codes']?.join(', ') + '.'
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return new Promise<boolean>((resolve, reject) => {
        return reject(new Error(error))
    })
}

export function getClientIP(req: IncomingMessage) {
    if (typeof req.headers['x-forwarded-for'] === 'string') {
        return req.headers['x-forwarded-for'].split(',').shift()
    }

    if (typeof req.connection.remoteAddress === 'string') {
        return req.connection.remoteAddress
    }

    if (typeof req.socket.remoteAddress === 'string') {
        return req.socket.remoteAddress
    }

    return ''
}
