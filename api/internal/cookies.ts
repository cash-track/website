export interface CookieInterface {
    name: string
    value: string
}

export interface CookieWriteInterface extends CookieInterface {
    expires: Date
    domain: string
    secure: boolean
    httpOnly: boolean
}

export function buildCookie(cookie: CookieWriteInterface): string {
    let value = `${cookie.name}=${cookie.value}; `

    value += `Expires=${cookie.expires.toUTCString()}>; `
    value += `Domain=${cookie.domain}; `
    value += `Path=/; `

    if (cookie.secure) {
        value += 'Secure; '
    }

    if (cookie.httpOnly) {
        value += 'HttpOnly; '
    }

    value += 'SameSite=Strict'

    return value
}

export function parseCookies(value: string | undefined): CookiesBag {
    const cookies = new CookiesBag()

    if (typeof value === 'undefined' || !value.includes(';')) {
        return cookies
    }

    for (const rawCookie of value.split(';')) {
        if (!rawCookie.includes('=')) {
            continue
        }

        const parts = rawCookie.trim().split('=')

        cookies.set(parts[0].trim(), parts[1].trim())
    }

    return cookies
}

class CookiesBag {
    private cookies: Record<string, CookieInterface> = {}

    has(name: string): boolean {
        return typeof this.cookies[name] !== 'undefined'
    }

    get(name: string): CookieInterface | null {
        if (!this.has(name)) {
            return null
        }

        return this.cookies[name]
    }

    getValue(name: string): string {
        if (!this.has(name)) {
            return ''
        }

        return this.cookies[name].value
    }

    set(name: string, value: string) {
        this.cookies[name] = {
            name,
            value,
        }
    }
}
