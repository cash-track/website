import { NuxtAxiosInstance } from '@nuxtjs/axios'

export function confirmEmail(http: NuxtAxiosInstance, token: string) {
    return http.$post(`/api/auth/email/confirmation/confirm/${token}`)
}
