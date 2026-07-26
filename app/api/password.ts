import { useApi } from '@/api/api'

export interface ResetPasswordRequestInterface {
    code: string
    password: string
    passwordConfirmation: string
}

export function forgotPassword(
    email: string,
    captchaChallenge: string
) {
    return useApi(
        '/api/auth/password/forgot',
        {
            method: 'POST',
            body: { email },
            headers: {
                'X-CT-Captcha-Challenge': captchaChallenge
            },
            credentials: 'include'
        }
    )
}

export function resetPassword(
    data: ResetPasswordRequestInterface,
    captchaChallenge: string
) {
    return useApi(
        '/api/auth/password/reset',
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
