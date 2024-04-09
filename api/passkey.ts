import type { PublicKeyCredentialRequestOptions } from '@simplewebauthn/types'
import type { LoginResponseInterface } from '@/api/login'
import { useApi } from '@/api/api'

export interface PasskeyInitResponseInterface {
    challenge: string
    data: string
    dataDecoded: PublicKeyCredentialRequestOptions
}

export function passkeyInit(
    captchaChallenge: string
): Promise<PasskeyInitResponseInterface> {
    return useApi<PasskeyInitResponseInterface>(
        '/api/auth/login/passkey/init',
        {
            method: 'GET',
            headers: {
                'X-CT-Captcha-Challenge': captchaChallenge
            },
            credentials: 'include'
        }
    ).then((res) => {
        res.dataDecoded = decode<PublicKeyCredentialRequestOptions>(
            res.data
        )
        return res
    })
}

export function passkeyLogin(
    challenge: string,
    data: object,
    captchaChallenge: string
): Promise<LoginResponseInterface> {
    return useApi<LoginResponseInterface>(
        '/api/auth/login/passkey',
        {
            method: 'POST',
            body: {
                challenge,
                data: encode(data)
            },
            headers: {
                'X-CT-Captcha-Challenge': captchaChallenge
            },
            credentials: 'include'
        })
}

function decode<T>(data: string): T {
    return JSON.parse(atob(data))
}

function encode(data: object): string {
    return btoa(JSON.stringify(data))
}
