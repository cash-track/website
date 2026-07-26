import type { LoginResponseInterface } from '@/api/login'
import { useApi } from '@/api/api'

export interface GoogleAuthRequestInterface {
    token: string
}

export function googleAuthProvider(
    data: GoogleAuthRequestInterface,
    captchaChallenge: string
): Promise<LoginResponseInterface> {
    return useApi<LoginResponseInterface>(
        '/api/auth/provider/google',
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
