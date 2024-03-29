import { NuxtAxiosInstance } from '@nuxtjs/axios'

export interface ProfileResponseInterface {
    data: ProfileInterface
}

export interface ProfileInterface {
    id: number
    name: string
    lastName: string
    nickName: string
    isEmailConfirmed: boolean
    photoUrl: string | null
}

export function profileGet(
    http: NuxtAxiosInstance
): Promise<ProfileResponseInterface> {
    return http.$get<ProfileResponseInterface>('/api/profile', {
        withCredentials: true,
    })
}

export function profilePutLocale(http: NuxtAxiosInstance, locale: string) {
    return http.$put<ProfileResponseInterface>('/api/profile/locale', {
        locale,
    })
}
