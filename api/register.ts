import { NuxtAxiosInstance } from '@nuxtjs/axios'
import { EntityIDResponseInterface } from '~/api/response'

export interface RegisterRequestInterface {
    name: string
    lastName: string
    nickName: string
    email: string
    password: string
    passwordConfirmation: string
}

export interface RegisterResponseInterface {
    data: EntityIDResponseInterface
    accessToken: string
    accessTokenExpiredAt: string
    refreshToken: string
    refreshTokenExpiredAt: string
}

export function checkNickName(http: NuxtAxiosInstance, nickName: string) {
    return http.$post('/auth/register/check/nick-name', { nickName })
}

export function register(
    http: NuxtAxiosInstance,
    data: RegisterRequestInterface
): Promise<RegisterResponseInterface> {
    return http.$post<RegisterResponseInterface>('/auth/register', {
        name: data.name,
        lastName: data.lastName,
        nickName: data.nickName,
        email: data.email,
        password: data.password,
        passwordConfirmation: data.passwordConfirmation,
    })
}
