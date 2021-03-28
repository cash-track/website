import { ProfileInterface } from '~/api/profile'
import { CookieCache, PROFILE } from '~/services/CookieCache'

export interface AuthState {
    isLogged: boolean
    profile: ProfileInterface | null
}

export const state = (): AuthState => ({
    isLogged: false,
    profile: null,
})

export const mutations = {
    login(state: AuthState, user: ProfileInterface) {
        state.profile = user
        state.isLogged = true

        const cache = new CookieCache()
        cache.set<ProfileInterface>(PROFILE, user)
    },
    logout(state: AuthState) {
        state.profile = null
        state.isLogged = false

        const cache = new CookieCache()
        cache.forget(PROFILE)
    },
}
