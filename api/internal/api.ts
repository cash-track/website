import { IncomingMessage, ServerResponse } from 'http'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { parseCookies } from './cookies'
import { writeCredentials, refreshToken, TokensResponseInterface } from './auth'

// TODO. Uncle Refactoring want's to meed with this file

async function ApiRequest<T = any>(
    req: IncomingMessage,
    res: ServerResponse,
    config: AxiosRequestConfig
): Promise<AxiosResponse<T>> {
    const host = (process.env.BASE_URL ?? '')
        .replace('http://', '')
        .replace('https://', '')
        .replace('/', '')

    const clientHeaders = {
        Accept: 'application/json',
        'Accept-Language': req.headers['accept-language'],
        'Access-Control-Request-Headers': '',
        'Access-Control-Request-Method': '',
        'Content-Type': 'application/json',
        'User-Agent': req.headers['user-agent'],
        Referer: req.headers.referer,
        Host: host,
        Origin: '',
        'X-Forwarded-For': req.connection.remoteAddress,
    }

    if (req.headers.origin !== undefined) {
        clientHeaders.Origin = req.headers.origin
    }

    if (req.headers['access-control-request-method'] !== undefined) {
        clientHeaders['Access-Control-Request-Method'] =
            req.headers['access-control-request-method']
    }

    if (req.headers['access-control-request-headers'] !== undefined) {
        clientHeaders['Access-Control-Request-Headers'] =
            req.headers['access-control-request-headers']
    }

    const request: AxiosRequestConfig = Object.assign(
        {
            method: req.method,
            baseURL: process.env.API_URL,
            url: req.url?.replace('/api', ''),
            headers: clientHeaders,
        },
        config
    )

    // Read request body in a safe way.
    // Sometimes request is nt finished before we read it so body is getting empty or damaged.
    // In that case we must ensure that request is ended
    if (
        req.method !== undefined &&
        ['POST', 'PUT', 'PATCH'].includes(req.method)
    ) {
        // try to read entire body (expect request is completed)
        request.data = req.read()

        // if request is not completed we always get null
        if (request.data === null) {
            const body: Array<Uint8Array> = []

            // then we're going to read data by chunks
            req.on('data', (chunk) => {
                body.push(chunk)
            })

            // and wait before it's finished and we're able to join chunks
            await (() => {
                return new Promise((resolve) => {
                    req.on('end', () => {
                        request.data = Buffer.concat(body)

                        resolve(true)
                    })
                })
            })()
        }
    }

    const cookies = parseCookies(req.headers.cookie)
    const isLogged = cookies.has('cshtrka')
    const ableToRefresh = cookies.has('cshtrkr')

    // inject access token if exists
    if (isLogged) {
        request.headers.Authorization = `Bearer ${cookies.getValue('cshtrka')}`
    }

    let newCredentials: TokensResponseInterface

    try {
        return await axios.request(request)
    } catch (error) {
        if (
            !isLogged ||
            !ableToRefresh ||
            !error.response ||
            error.response.status !== 401
        ) {
            // pass result to the next level
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            return new Promise<AxiosResponse>((resolve, reject) => {
                reject(error)
            })
        }

        // handle token refresh
        try {
            newCredentials = await refreshToken({
                accessToken: cookies.getValue('cshtrka'),
                refreshToken: cookies.getValue('cshtrkr'),
            })
        } catch (err) {
            // refresh token failed
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            return new Promise<AxiosResponse<T>>((resolve, reject) => {
                reject(error)
            })
        }
    }

    // refresh token was successful, try to repeat initial request
    request.headers.Authorization = `Bearer ${newCredentials.accessToken}`

    const response = await axios.request(request)

    // new access token is valid
    writeCredentials(newCredentials, res)

    return new Promise<AxiosResponse<T>>((resolve) => {
        resolve(response)
    })
}

// Forward any request to API and fill response
export async function handleFullForwardedApiRequest(
    req: IncomingMessage,
    res: ServerResponse
) {
    if (
        req.method !== 'GET' &&
        req.method !== 'POST' &&
        req.method !== 'PUT' &&
        req.method !== 'PATCH' &&
        req.method !== 'DELETE' &&
        req.method !== 'OPTIONS'
    ) {
        throw new Error('Unexpected request method')
    }

    try {
        const response = await ApiRequest(req, res, {})

        forwardApiHeaders(response.headers, res)

        res.statusCode = response.status
        res.write(JSON.stringify(response.data))
        res.end()
    } catch (error) {
        if (error.response) {
            forwardApiHeaders(error.response.headers, res)

            res.statusCode = error.response.status
            res.write(JSON.stringify(error.response.data))
            res.end()
        } else {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            return new Promise((resolve, reject) => {
                return reject(error)
            })
        }
    }

    return new Promise<void>((resolve) => {
        return resolve()
    })
}

// Forward any error from API to client and return response if success
export async function handleErrorsForwardedApiRequest<T>(
    req: IncomingMessage,
    res: ServerResponse,
    config: object
): Promise<T> {
    let response: AxiosResponse<T>

    try {
        response = await ApiRequest<T>(req, res, config)
    } catch (error) {
        if (error.response) {
            res.statusCode = error.response.status
            res.write(JSON.stringify(error.response.data))
        } else {
            res.statusCode = 500
            res.write(
                JSON.stringify({
                    message:
                        'Unexpected response from server. Please try again later.',
                    error: error.toString(),
                })
            )
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return new Promise<T>((resolve, reject) => {
            return reject(error)
        })
    }

    return new Promise<T>((resolve) => {
        return resolve(response.data)
    })
}

function forwardApiHeaders(headers: any, response: ServerResponse) {
    if (headers['access-control-allow-origin']) {
        response.setHeader(
            'Access-Control-Allow-Origin',
            headers['access-control-allow-origin']
        )
        response.setHeader('Access-Control-Allow-Credentials', 'true')
    }

    if (headers.vary) {
        response.setHeader('Vary', headers.vary)
    }

    if (headers['access-control-allow-methods']) {
        response.setHeader(
            'Access-Control-Allow-Methods',
            headers['access-control-allow-methods']
        )
    }

    if (headers['access-control-allow-headers']) {
        response.setHeader(
            'Access-Control-Allow-Headers',
            headers['access-control-allow-headers']
        )
    }

    if (headers['access-control-max-age']) {
        response.setHeader(
            'Access-Control-Max-Age',
            headers['access-control-max-age']
        )
    }
}
