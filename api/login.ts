import { NuxtAxiosInstance } from '@nuxtjs/axios'
import { EntityIDResponseInterface } from '~/api/response'

export interface LoginRequestInterface {
    email: string
    password: string
    remember: boolean
}

export interface LoginResponseInterface {
    data: EntityIDResponseInterface
    accessToken: string
    accessTokenExpiredAt: string
    refreshToken: string
    refreshTokenExpiredAt: string
}

export function login(
    http: NuxtAxiosInstance,
    data: LoginRequestInterface
): Promise<LoginResponseInterface> {
    return http.$post<LoginResponseInterface>('/auth/login', {
        email: data.email,
        password: data.password,
    })
}
