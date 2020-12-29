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

    const request: AxiosRequestConfig = Object.assign(
        {
            method: req.method,
            baseURL: process.env.API_URL,
            url: req.url?.replace('/api', ''),
            headers: clientHeaders,
        },
        config
    )

    if (req.readable) {
        request.data = req.read()
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
            return new Promise((resolve, reject) => {
                return reject(error)
            })
        }
    }

    return new Promise((resolve) => {
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
                    message: 'Unexpected response from server. Please try again later.',
                    error: error.toString(),
                })
            )
        }

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
}
