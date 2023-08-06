import { ServerResponse } from 'http'
import axios from 'axios'
import { buildCookie } from './cookies'

export interface TokensCredentialsInterface {
    accessToken: string
    refreshToken: string
}

export interface TokensResponseInterface extends TokensCredentialsInterface {
    accessTokenExpiredAt: string
    refreshTokenExpiredAt: string
}

export function writeCredentials(
    credentials: TokensResponseInterface,
    res: ServerResponse
) {
    res.setHeader('Set-Cookie', buildCookies(credentials))
}

export function resetCredentials(res: ServerResponse) {
    res.setHeader('Set-Cookie', buildEmptyCookies())
}

export function login(
    credentials: TokensResponseInterface,
    res: ServerResponse
) {
    // write tokens to cookies
    writeCredentials(credentials, res)

    // generate redirect URL
    res.statusCode = 200
    res.write(
        JSON.stringify({
            redirectUrl: process.env.WEB_APP_URL,
        })
    )
}

export function logout(res: ServerResponse) {
    // write tokens to cookies
    resetCredentials(res)

    // generate redirect URL
    res.statusCode = 200
    res.write(
        JSON.stringify({
            redirectUrl: process.env.BASE_URL,
        })
    )
}

function buildCookies(credentials: TokensResponseInterface): Array<string> {
    const refreshTokenExpires = new Date()

    refreshTokenExpires.setTime(Date.parse(credentials.refreshTokenExpiredAt))

    const env = cookiesEnv()
    const cookieValues: Array<string> = []

    cookieValues.push(
        buildCookie({
            name: 'cshtrka',
            value: credentials.accessToken,
            expires: refreshTokenExpires,
            domain: env.domain,
            secure: env.isSecure,
            httpOnly: true,
        })
    )

    cookieValues.push(
        buildCookie({
            name: 'cshtrkr',
            value: credentials.refreshToken,
            expires: refreshTokenExpires,
            domain: env.domain,
            secure: env.isSecure,
            httpOnly: true,
        })
    )

    return cookieValues
}

function cookiesEnv() {
    const host = process.env.BASE_URL || ''
    const isSecure = host.includes('https')

    let domain = host
        .replace('http://', '')
        .replace('https://', '')
        .replace('/', '')

    if (domain.includes('localhost')) {
        domain = 'localhost'
    } else {
        domain = '.' + domain
    }

    if (domain.includes(':')) {
        domain = domain.split(':')[0] ?? domain
    }

    return {
        isSecure,
        domain,
    }
}

function buildEmptyCookies(): Array<string> {
    const env = cookiesEnv()
    const cookieValues: Array<string> = []

    cookieValues.push(
        buildCookie({
            name: 'cshtrka',
            value: '',
            expires: new Date(),
            domain: env.domain,
            secure: env.isSecure,
            httpOnly: true,
        })
    )

    cookieValues.push(
        buildCookie({
            name: 'cshtrkr',
            value: '',
            expires: new Date(),
            domain: env.domain,
            secure: env.isSecure,
            httpOnly: true,
        })
    )

    return cookieValues
}

export async function refreshToken(
    credentials: TokensCredentialsInterface
): Promise<TokensResponseInterface> {
    const response = await axios.post<TokensResponseInterface>(
        '/auth/refresh',
        {
            accessToken: credentials.accessToken,
        },
        {
            baseURL: process.env.API_URL,
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${credentials.refreshToken}`,
                'Content-Type': 'application/json',
            },
        }
    )

    return new Promise<TokensResponseInterface>((resolve) => {
        return resolve(response.data)
    })
}
