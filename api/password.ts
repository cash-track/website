import { NuxtAxiosInstance } from '@nuxtjs/axios'

export interface ResetPasswordRequestInterface {
    code: string
    password: string
    passwordConfirmation: string
}

export function forgotPassword(
    http: NuxtAxiosInstance,
    email: string,
    captchaChallenge: string
) {
    return http.$post(
        '/api/auth/password/forgot',
        { email },
        {
            headers: {
                'X-CT-Captcha-Challenge': captchaChallenge,
            },
        }
    )
}

export function resetPassword(
    http: NuxtAxiosInstance,
    data: ResetPasswordRequestInterface,
    captchaChallenge: string
) {
    return http.$post(
        '/api/auth/password/reset',
        {
            code: data.code,
            password: data.password,
            passwordConfirmation: data.passwordConfirmation,
        },
        {
            headers: {
                'X-CT-Captcha-Challenge': captchaChallenge,
            },
        }
    )
}
