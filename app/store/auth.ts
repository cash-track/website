import { defineStore } from 'pinia'
import type { ProfileInterface } from '@/api/profile'
import { ref } from '#imports'
import { type CachedProfile, writeCachedProfile, clearCachedProfile } from '@/utils/profileCookie'

function toCachedProfile(profile: ProfileInterface): CachedProfile {
    return {
        v: 1,
        id: profile.id,
        name: profile.name,
        lastName: profile.lastName,
        nickName: profile.nickName,
        email: profile.email,
        photoUrl: profile.photoUrl,
        isEmailConfirmed: profile.isEmailConfirmed,
        locale: profile.locale
    }
}

export const useAuthStore = defineStore('auth', () => {
    const profile = ref<ProfileInterface | null>(null)
    const isLogged = ref(false)
    const isProfileLoading = ref(true)

    // A confirmed login — refreshes the cshtrkp display cache. Client-only call sites.
    function login(user: ProfileInterface) {
        profile.value = user
        isLogged.value = true
        isProfileLoading.value = false
        writeCachedProfile(toCachedProfile(user))
    }

    // Renders the header signed-in before GET /profile resolves (#147). Runs during SSR too,
    // so it must never touch the cookie itself.
    function seedFromCache(cached: CachedProfile) {
        profile.value = cached
        isLogged.value = true
        isProfileLoading.value = false
    }

    // In-memory only, for load failures that don't prove the session is dead — the cookie
    // stays so the next successful load can still serve from cache.
    function reset() {
        profile.value = null
        isLogged.value = false
        isProfileLoading.value = false
    }

    // Session is over — logout, or a 401 (refresh failed). The only two cases allowed to
    // clear the cshtrkp cookie.
    function logout() {
        reset()
        clearCachedProfile()
    }

    return { isLogged, isProfileLoading, profile, login, seedFromCache, reset, logout }
})
