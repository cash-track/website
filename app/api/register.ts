import { useApi } from '@/api/api'

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

export function checkNickName(nickName: string) {
    return useApi(
        '/api/auth/register/check/nick-name',
        {
            method: 'POST',
            body: { nickName },
            credentials: 'include'
        }
    )
}

export function register(
    data: RegisterRequestInterface,
    captchaChallenge: string
): Promise<RegisterResponseInterface> {
    return useApi<RegisterResponseInterface>(
        '/api/auth/register',
        {
            method: 'POST',
            body: data,
            headers: {
                'X-CT-Captcha-Challenge': captchaChallenge
            },
            credentials: 'include'
        }
    )
}
