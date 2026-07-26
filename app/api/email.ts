import { useApi } from '@/api/api'

export function confirmEmail(token: string) {
    return useApi(
        `/api/auth/email/confirmation/confirm/${token}`,
        {
            method: 'POST',
            credentials: 'include'
        }
    )
}
