import { NuxtAxiosInstance } from '@nuxtjs/axios'

export interface LoginRequestInterface {
    email: string
    password: string
    remember: boolean
}

export interface LoginResponseInterface {
    redirectUrl: string
}

export function login(
    http: NuxtAxiosInstance,
    data: LoginRequestInterface,
    captchaChallenge: string
): Promise<LoginResponseInterface> {
    return http.$post<LoginResponseInterface>(
        '/api/auth/login',
        {
            email: data.email,
            password: data.password,
        },
        {
            headers: {
                'X-CT-Captcha-Challenge': captchaChallenge,
            },
            withCredentials: true,
        }
    )
}

export function logout(
    http: NuxtAxiosInstance
): Promise<LoginResponseInterface> {
    return http.$post(
        '/api/auth/logout',
        {},
        {
            withCredentials: true,
        }
    )
}
