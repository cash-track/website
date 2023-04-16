import { NuxtAxiosInstance } from '@nuxtjs/axios'

export interface RegisterRequestInterface {
    name: string
    lastName: string
    nickName: string
    email: string
    password: string
    passwordConfirmation: string
    locale: string
}

export interface RegisterResponseInterface {
    redirectUrl: string
}

export function checkNickName(http: NuxtAxiosInstance, nickName: string) {
    return http.$post('/api/auth/register/check/nick-name', { nickName })
}

export function register(
    http: NuxtAxiosInstance,
    data: RegisterRequestInterface,
    captchaChallenge: string
): Promise<RegisterResponseInterface> {
    return http.$post<RegisterResponseInterface>(
        '/api/auth/register',
        {
            name: data.name,
            lastName: data.lastName,
            nickName: data.nickName,
            email: data.email,
            password: data.password,
            passwordConfirmation: data.passwordConfirmation,
            locale: data.locale,
        },
        {
            headers: {
                'X-CT-Captcha-Challenge': captchaChallenge,
            },
        }
    )
}
