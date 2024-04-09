import { defineStore } from 'pinia'
import type { ProfileInterface } from '@/api/profile'
import { ref } from '#imports'

export const useAuthStore = defineStore('auth', () => {
    const profile = ref<ProfileInterface|null>(null)
    const isLogged = ref(false)
    const isProfileLoading = ref(true)

    function login(user: ProfileInterface) {
        profile.value = user
        isLogged.value = true
        isProfileLoading.value = false
    }

    function logout() {
        profile.value = null
        isLogged.value = false
        isProfileLoading.value = false
    }

    return { isLogged, isProfileLoading, profile, login, logout }
})
