import { useApi } from '@/api/api'

export interface LoginRequestInterface {
    email: string
    password: string
    remember: boolean
}

export interface LoginResponseInterface {
    redirectUrl: string
}

export function login(
    data: LoginRequestInterface,
    captchaChallenge: string
): Promise<LoginResponseInterface> {
    return useApi<LoginResponseInterface>('/api/auth/login', {
        method: 'POST',
        body: data,
        headers: {
            'X-CT-Captcha-Challenge': captchaChallenge
        },
        credentials: 'include'
    })
}

export function logout(): Promise<LoginResponseInterface> {
    return useApi<LoginResponseInterface>('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
    })
}
