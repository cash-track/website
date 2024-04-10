import { useApi } from '@/api/api'

export interface ProfileInterface {
    id: number
    name: string
    email: string
    lastName: string
    nickName: string
    isEmailConfirmed: boolean
    photoUrl: string | null
}

export interface ProfileResponseInterface {
    data: ProfileInterface
}

export function profileGet(): Promise<ProfileResponseInterface> {
    return useApi<ProfileResponseInterface>('/api/profile', {
        method: 'GET',
        credentials: 'include'
    })
}

export function profilePutLocale(locale: string): Promise<ProfileResponseInterface> {
    return useApi<ProfileResponseInterface>('/api/profile/locale', {
        method: 'PUT',
        body: { locale },
        credentials: 'include'
    })
}
