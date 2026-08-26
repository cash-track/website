import { $fetch } from 'ofetch'
import type { FetchOptions } from 'ofetch'
import { useRuntimeConfig } from '#app'

// Methods that mutate state and must carry an Idempotency-Key. Matches ofetch's own
// `isPayloadMethod()` set (PATCH, POST, PUT, DELETE) — see the retry note below.
const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])

/**
 * Falls back to a non-cryptographic RFC4122-shaped v4 UUID rather than throwing where
 * crypto.randomUUID is missing. This dedupes retries, it is not a security control.
 */
function generateIdempotencyKey(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID().toLowerCase()
    }

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
        const random = (Math.random() * 16) | 0
        const value = char === 'x' ? random : (random & 0x3) | 0x8
        return value.toString(16)
    })
}

export function useApi<T>(url: string, options: FetchOptions<'json'>): Promise<T> {
    options.baseURL = useRuntimeConfig().public.gatewayUrl

    const method = (options.method ?? 'GET').toString().toUpperCase()

    if (MUTATING_METHODS.has(method)) {
        // Minted once per useApi() call and merged into the caller's headers. Deliberately
        // before $fetch() rather than in an onRequest hook: ofetch re-runs hooks per retry
        // attempt, which would regenerate the key. Function-local, so SSR requests from
        // different users never share it.
        const headers = new Headers(options.headers)

        if (!headers.has('Idempotency-Key')) {
            headers.set('Idempotency-Key', generateIdempotencyKey())
        }

        options.headers = headers
    }

    return $fetch<T, 'json'>(url, options)
}
