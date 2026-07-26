<template>
    <div class="header">
        <UContainer>
            <div class="navbar">
                <div class="navbar-mobile-head">
                    <ULink
                        class="logo-link"
                        to="/"
                    >
                        <Logo />
                    </ULink>

                    <UButton
                        class="text-xl border"
                        variant="soft"
                        color="neutral"
                        @click="onMobileHeaderClick"
                    >
                        <hamburger-menu />
                    </UButton>
                </div>
                <collapse :open="isHeaderOpened">
                    <div class="navbar-root">
                        <div class="navbar-main">
                            <ULink
                                class="logo-link"
                                to="/"
                            >
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
                            <UDropdownMenu
                                :items="availableLocales"
                                :content="{ align: 'start', side: 'bottom' }"
                            >
                                <UButton
                                    class="lang-selector navbar-link"
                                    color="neutral"
                                    variant="ghost"
                                    :label="currentFlag"
                                    trailing-icon="i-lucide-chevron-down"
                                    :ui="{ label: 'mt-0.5 text-lg' }"
                                />
                            </UDropdownMenu>

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

                            <UDropdownMenu
                                v-if="isLogged"
                                class="profile-selector"
                                :items="profileDropdownLinks"
                                :content="{ align: 'start', side: 'bottom' }"
                            >
                                <UButton
                                    color="neutral"
                                    :label="profile?.name"
                                    variant="ghost"
                                    class="navbar-link"
                                    trailing-icon="i-lucide-chevron-down"
                                >
                                    <template #leading>
                                        <UAvatar
                                            :src="profile?.photoUrl || undefined"
                                            :alt="profile?.name"
                                            size="xs"
                                        />
                                    </template>
                                </UButton>

                                <template #account>
                                    <div class="text-left">
                                        <p>{{ $t('signedAs') }}</p>
                                        <p class="truncate font-medium text-highlighted">
                                            {{ profile?.email }}
                                        </p>
                                    </div>
                                </template>

                                <template #item="{ item }">
                                    <span class="truncate">{{ item.label }}</span>
                                    <UIcon
                                        :name="item.icon!"
                                        class="shrink-0 h-4 w-4 text-dimmed ms-auto"
                                    />
                                </template>
                            </UDropdownMenu>
                        </div>
                    </div>
                </collapse>
            </div>
        </UContainer>
    </div>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import type { LocaleObject } from '@nuxtjs/i18n'
import { useLocalePath, useI18n, onMounted, useRouter, computed, ref } from '#imports'
import { useWebAppLinks } from '@/lib/WebAppLinks'
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
const profile = computed<ProfileInterface | null>(() => authStore.profile)
const currentLocale = computed(() => {
    return locales.value.filter(i => i.code === locale.value).pop()
})
// `flag` is a custom LocaleObject property, so it comes back as `unknown`.
const currentFlag = computed(() => (currentLocale.value?.flag as string | undefined) ?? '')
const availableLocales = computed<DropdownMenuItem[][]>(() => {
    return [locales.value.map<DropdownMenuItem>(function (item): DropdownMenuItem {
        return {
            label: item.name ?? '',
            disabled: item.code === locale.value,
            onSelect: () => onLocaleChange(item)
        }
    })]
})
const profileDropdownLinks = computed<DropdownMenuItem[][]>(function (): DropdownMenuItem[][] {
    return [
        [{
            label: profile.value?.email ?? '',
            slot: 'account',
            type: 'label'
        }],
        [{
            label: t('dashboard'),
            href: webAppLinks.walletsLink,
            icon: 'i-lucide-sparkles'
        }, {
            label: t('signOut'),
            icon: 'i-lucide-log-out',
            onSelect: () => onLogout()
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

<style>
@reference "../assets/css/main.css";

html.dark {
    &, .footer, .header {
        @apply bg-gray-800;

        body {
            @apply bg-gray-700;
        }
    }
}

html, .footer, .header {
    @apply bg-gray-100;

    body {
        @apply bg-white;
    }
}

@media (min-width: 768px) {
    .header .navbar .collapse-root {
        display: block !important;
        height: auto !important;
    }
}

.header {
    @apply mb-5 py-2 px-4 dark:border-gray-600;

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
        }

        .navbar-link {
            @apply text-black/50 hover:text-black/70 active:text-black/70 dark:text-white/80 dark:hover:text-green-500/100 dark:active:text-green-500/100;
        }

        ul {
            @apply flex flex-col md:flex-row;

            li {
                a {
                    @apply block px-2 py-2 text-black/50 hover:text-black/70 active:text-black/70 dark:text-white/80 dark:hover:text-green-500/100 dark:active:text-green-500/100;

                    &.active {
                        @apply text-black/90 dark:text-green-500/80;
                    }
                }
            }
        }
    }
}
</style>
