import { ProfileInterface } from '~/api/profile'

export interface AuthState {
    isLogged: boolean
    profile: ProfileInterface | null
    isProfileLoading: boolean
}

export const state = (): AuthState => ({
    isLogged: false,
    profile: null,
    isProfileLoading: true,
})

export const mutations = {
    login(state: AuthState, user: ProfileInterface) {
        state.profile = user
        state.isLogged = true
        state.isProfileLoading = false
    },
    logout(state: AuthState) {
        state.profile = null
        state.isLogged = false
        state.isProfileLoading = false
    },
}
