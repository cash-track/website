import { NuxtAxiosInstance } from '@nuxtjs/axios'
import { LoginResponseInterface } from '~/api/login';

export interface GoogleAuthRequestInterface {
    token: string
}

export function googleAuthProvider(
    http: NuxtAxiosInstance,
    data: GoogleAuthRequestInterface,
    captchaChallenge: string
): Promise<LoginResponseInterface> {
    return http.$post<LoginResponseInterface>(
        '/api/auth/provider/google',
        {
            token: data.token,
        },
        {
            headers: {
                'X-CT-Captcha-Challenge': captchaChallenge,
            },
        }
    )
}
