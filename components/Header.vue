<template>
    <div class="header">
        <UContainer>
            <div class="navbar">
                <div class="navbar-mobile-head">
                    <ULink class="logo-link" to="/">
                        <Logo />
                    </ULink>

                    <UButton class="text-xl border" variant="soft" color="gray" @click="onMobileHeaderClick">
                        <hamburger-menu />
                    </UButton>
                </div>
                <collapse :open="isHeaderOpened">
                    <div class="navbar-root">
                        <div class="navbar-main">
                            <ULink class="logo-link" to="/">
                                <Logo />
                            </ULink>

                            <ul>
                                <li v-if="isProfileLoading || isLogged">
                                    <ULink
                                        :disabled="isProfileLoading"
                                        :to="webAppLinks.walletsLink"
                                        class="navbar-link"
                                    >
                                        {{ $t('wallets') }}
                                    </ULink>
                                </li>
                                <li v-if="isProfileLoading || isLogged">
                                    <ULink
                                        :disabled="isProfileLoading"
                                        :to="webAppLinks.profileLink"
                                        class="navbar-link"
                                    >
                                        {{ $t('profile') }}
                                    </ULink>
                                </li>
                                <li>
                                    <ULink
                                        :to="localePath('/help')"
                                        class="navbar-link"
                                        exact
                                        active-class="active"
                                    >
                                        {{ $t('help.link') }}
                                    </ULink>
                                </li>
                                <li>
                                    <ULink
                                        :to="localePath('/about')"
                                        class="navbar-link truncate"
                                        exact
                                        active-class="active"
                                    >
                                        {{ $t('about.link') }}
                                    </ULink>
                                </li>
                            </ul>
                        </div>
                        <div class="navbar-right">
                            <UDropdown
                                class="lang-selector"
                                :items="availableLocales"
                                :popper="{placement: 'bottom-start'}"
                            >
                                <UButton
                                    color="white"
                                    :label="currentLocale?.flag"
                                    variant="ghost"
                                    trailing-icon="i-heroicons-chevron-down-20-solid"
                                />
                            </UDropdown>

                            <ul v-if="isProfileLoading || !isLogged">
                                <li>
                                    <ULink
                                        :disabled="isProfileLoading"
                                        :to="localePath('/login')"
                                        exact
                                        active-class="active"
                                    >
                                        {{ $t('signIn.link') }}
                                    </ULink>
                                </li>
                                <li>
                                    <ULink
                                        :disabled="isProfileLoading"
                                        :to="localePath('/register')"
                                        exact
                                        active-class="active"
                                    >
                                        {{ $t('register.link') }}
                                    </ULink>
                                </li>
                            </ul>

                            <UDropdown
                                v-if="isLogged"
                                class="profile-selector"
                                :items="profileDropdownLinks"
                                :popper="{placement: 'bottom-start'}"
                                :ui="{item: {disabled: 'cursor-text select-text'}}"
                            >
                                <UButton
                                    color="white"
                                    :label="profile?.name"
                                    variant="ghost"
                                    class="navbar-link"
                                    trailing-icon="i-heroicons-chevron-down-20-solid"
                                >
                                    <template #leading>
                                        <UAvatar :src="profile?.photoUrl ? profile.photoUrl : false" size="xs" />
                                    </template>
                                </UButton>

                                <template #account="{ item }">
                                    <div class="text-left">
                                        <p>{{ $t('signedAs') }}</p>
                                        <p class="truncate font-medium text-gray-900 dark:text-white">
                                            {{ item.label }}
                                        </p>
                                    </div>
                                </template>

                                <template #item="{ item }">
                                    <span class="truncate">{{ item.label }}</span>
                                    <UIcon :name="item.icon" class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto" />
                                </template>
                            </UDropdown>
                        </div>
                    </div>
                </collapse>
            </div>
        </UContainer>
    </div>
</template>

<script setup lang="ts">
import type { DropdownItem } from '#ui/types'
import type { LocaleObject } from '@nuxtjs/i18n'
import { useLocalePath, useI18n, onMounted, useRouter, computed, ref } from '#imports'
import { useWebAppLinks } from '@/shared/WebAppLinks'
import { useAuthStore } from '@/store/auth'
import { profileGet, profilePutLocale, type ProfileInterface } from '@/api/profile'
import { logout } from '@/api/login'
import HamburgerMenu from '@/components/Shared/HamburgerMenu.vue'
import Collapse from '@/components/Shared/Collapse.vue'

const { locale, locales, t, setLocale } = useI18n()
const localePath = useLocalePath()
const webAppLinks = useWebAppLinks()
const authStore = useAuthStore()
const router = useRouter()

const isHeaderOpened = ref(false)
const isProfileLoading = computed(() => authStore.isProfileLoading)
const isLogged = computed(() => authStore.isLogged)
const profile = computed<ProfileInterface|null>(() => authStore.profile)
const currentLocale = computed(() => {
    return locales.value.filter(i => i.code === locale.value).pop()
})
const availableLocales = computed<DropdownItem[][]>(() => {
    return [locales.value.map<DropdownItem>(function(item): DropdownItem {
        return {
            label: item.name ?? '',
            disabled: item.code === locale.value,
            click: () => onLocaleChange(item)
        }
    })]
})
const profileDropdownLinks = computed<DropdownItem[][]>(function (): DropdownItem[][] {
    return [
        [{
            label: profile.value?.email ?? '',
            slot: 'account',
            disabled: true
        }],
        [{
            label: t('dashboard'),
            href: webAppLinks.walletsLink,
            icon: 'i-heroicons-sparkles-solid'
        }, {
            label: t('signOut'),
            icon: 'i-heroicons-arrow-left-end-on-rectangle-20-solid',
            click: () => onLogout()
        }]
    ]
})

onMounted(() => {
    loadProfile()
})

function loadProfile() {
    profileGet().then((response) => {
        authStore.login(response.data)
    }).catch(() => {
        authStore.logout()
    })
}

function onLogout() {
    logout().finally(() => {
        authStore.logout()
        router.push('/')
    })
}

function onLocaleChange(changed: LocaleObject) {
    setLocale(changed.code)

    if (isLogged.value) {
        profilePutLocale(changed.code)
    }
}

function onMobileHeaderClick() {
    isHeaderOpened.value = !isHeaderOpened.value
}
</script>

<style lang="scss">
html, .footer, .header {
    background: #f5f5f5;
}

body {
    background: #fff;
}

@media (min-width: 768px) {
    .header .navbar .collapse-root {
        display: block !important;
        height: auto !important;
    }
}

.header {
    @apply mb-5 py-2 px-4;

    border-bottom: 1px solid #e5e5e5;

    .navbar {
        .navbar-root {
            @apply grid grid-flow-row justify-stretch md:grid-flow-col;
        }

        .navbar-mobile-head {
            @apply flex justify-between md:hidden;
        }

        .navbar-main {
            @apply flex justify-start;

            .logo-link {
                @apply hidden md:block;
            }
        }

        .navbar-right {
            @apply flex justify-start flex-col md:justify-end md:flex-row;
        }

        .logo-link {
            width: 162px;

            @apply inline-block my-0.5 mr-4 py-0 h-9;
        }

        .lang-selector {
            @apply mr-4 text-xl;

            & > div:first-child > button:first-child {
                & > span:first-child {
                    @apply mt-0.5 text-lg;
                }

                & > span:last-child {
                    @apply text-black/50 hover:text-black/70 active:text-black/70;
                }
            }
        }

        .navbar-link {
            @apply text-black/50 hover:text-black/70 active:text-black/70;
        }

        ul {
            @apply flex flex-col md:flex-row;

            li {
                a {
                    @apply block px-2 py-2 text-black/50 hover:text-black/70 active:text-black/70;

                    &.active {
                        @apply text-black/90;
                    }
                }
            }
        }
    }
}
</style>
