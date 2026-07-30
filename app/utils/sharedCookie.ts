import { useRuntimeConfig } from '#imports'

// Parent domain shared with the frontend SPA, so cookies scoped to it are readable from
// both subdomains (cshtrkt theme, cshtrkl locale, cshtrkp profile cache).
export function parentDomain(): string | null {
    const config = useRuntimeConfig()
    const candidates = [config.public.baseUrl, window.location.origin]

    for (const candidate of candidates) {
        if (!candidate) {
            continue
        }

        try {
            return new URL(candidate).hostname
        }
        catch {
            continue
        }
    }

    return null
}

// localhost/IP can't take a leading-dot Domain cookie — callers fall back to host-only.
function isDomainScopable(domain: string | null): domain is string {
    return !!domain && domain !== 'localhost' && !/^[\d.]+$/.test(domain)
}

export function deleteHostOnlyCookie(name: string) {
    if (typeof document === 'undefined') {
        return
    }

    document.cookie = `${name}=; path=/; max-age=0`
}

export function writeSharedCookie(name: string, value: string, maxAge: number) {
    if (typeof document === 'undefined') {
        return
    }

    const domain = parentDomain()
    const attrs = [
        `${name}=${encodeURIComponent(value)}`,
        'path=/',
        `max-age=${maxAge}`,
        'SameSite=Lax'
    ]

    if (isDomainScopable(domain)) {
        attrs.push(`Domain=.${domain}`)
    }

    if (window.location.protocol === 'https:') {
        attrs.push('Secure')
    }

    document.cookie = attrs.join('; ')
}

// Deletes both forms: per RFC 6265 a delete only matches an exact (name, domain, path),
// so a domain-scoped cookie survives a host-only delete.
export function deleteSharedCookie(name: string) {
    if (typeof document === 'undefined') {
        return
    }

    deleteHostOnlyCookie(name)

    const domain = parentDomain()
    if (isDomainScopable(domain)) {
        document.cookie = `${name}=; Domain=.${domain}; path=/; max-age=0`
    }
}
