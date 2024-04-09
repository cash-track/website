import { useRuntimeConfig } from '#app'

export interface WebAppLinksInterface {
    walletsLink: string
    profileLink: string
}

export function useWebAppLinks(): WebAppLinksInterface {
    const config = useRuntimeConfig()

    return {
        walletsLink: `${config.public.webAppUrl}/wallets`,
        profileLink: `${config.public.webAppUrl}/profile`
    }
}
