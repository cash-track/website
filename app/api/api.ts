import { $fetch } from 'ofetch'
import type { FetchOptions } from 'ofetch'
import { useRuntimeConfig } from '#app'

export function useApi<T>(url: string, options: FetchOptions<'json'>): Promise<T> {
    options.baseURL = useRuntimeConfig().public.gatewayUrl
    return $fetch<T, 'json'>(url, options)
}
