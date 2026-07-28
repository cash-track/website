// `@nuxtjs/color-mode`/`@nuxtjs/i18n`'s cookies are host-only (build-time config can't carry a `domain` — one image, configured per-env at runtime).
// This plugin re-scopes `cshtrkt` and `cshtrkl` to the parent domain so the frontend SPA can share them.
// Only one cookie of each name may exist at rest, or the pre-paint theme parser breaks — the host-only one is deleted first.
import { useRuntimeConfig, useColorMode, watch, nextTick } from '#imports'
import { readCookieValue } from '@/utils/cookies'

const THEME_COOKIE = 'cshtrkt'
const LOCALE_COOKIE = 'cshtrkl'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365

function parentDomain(): string | null {
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

function deleteHostOnlyCookie(name: string) {
    document.cookie = `${name}=; path=/; max-age=0`
}

function writeDomainCookie(name: string, value: string, domain: string) {
    const attrs = [
        `${name}=${encodeURIComponent(value)}`,
        `Domain=.${domain}`,
        'path=/',
        `max-age=${COOKIE_MAX_AGE}`,
        'SameSite=Lax'
    ]

    if (window.location.protocol === 'https:') {
        attrs.push('Secure')
    }

    document.cookie = attrs.join('; ')
}

export default defineNuxtPlugin((nuxtApp) => {
    const colorMode = useColorMode()
    const domain = parentDomain()

    // localhost/IP can't take a leading-dot Domain cookie.
    if (!domain || domain === 'localhost' || /^[\d.]+$/.test(domain)) {
        return
    }

    function sync(name: string, value: string) {
        deleteHostOnlyCookie(name)
        writeDomainCookie(name, value, domain as string)
    }

    // nextTick/flush:'post' runs after color-mode's own watcher writes the host-only cookie, to avoid racing it.
    //
    // Reads the cookie, not colorMode.preference: the pre-paint parser silently falls back to
    // 'system' when cshtrkt duplicates, and echoing that would clobber the stored value. Deleting
    // first leaves at most one cookie to read.
    nextTick(() => {
        deleteHostOnlyCookie(THEME_COOKIE)
        const existingTheme = readCookieValue(document.cookie, THEME_COOKIE)
        sync(THEME_COOKIE, existingTheme ?? colorMode.preference)
    })
    // `v` is captured at trigger time, so it can't inherit that corruption.
    watch(() => colorMode.preference, v => nextTick(() => sync(THEME_COOKIE, v)), { flush: 'post' })

    // useI18n() throws in a plugin body (no component instance), so read the cookie i18n's own
    // detector wrote and use its localeSwitched hook for later changes.
    const initialLocale = readCookieValue(document.cookie, LOCALE_COOKIE)
    if (initialLocale) {
        nextTick(() => sync(LOCALE_COOKIE, initialLocale))
    }

    nuxtApp.hook('i18n:localeSwitched', ({ newLocale }) => {
        nextTick(() => sync(LOCALE_COOKIE, newLocale))
    })
})
