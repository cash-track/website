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
                        class="text-xl cursor-pointer"
                        variant="subtle"
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
                                class="mr-4 ring-0"
                                :items="themeMenuItems"
                                :content="{ align: 'start', side: 'bottom' }"
                            >
                                <UButton
                                    class="cursor-pointer"
                                    color="neutral"
                                    variant="subtle"
                                    :square="true"
                                    :aria-label="t('theme.theme')"
                                >
                                    <span class="relative inline-flex size-5">
                                        <!--
                                            Binding the glyph to colorMode.value would hydrate-mismatch
                                            (SSR can't resolve it) and Vue leaves class mismatches
                                            unpatched. Static dark: classes key off html.dark, set
                                            pre-paint.
                                        -->
                                        <UIcon
                                            name="i-lucide-sun"
                                            class="size-5 dark:hidden"
                                        />
                                        <UIcon
                                            name="i-lucide-moon"
                                            class="hidden size-5 dark:block"
                                        />
                                        <UIcon
                                            v-if="isSystemTheme"
                                            name="i-lucide-monitor"
                                            mode="svg"
                                            class="absolute -right-[3px] -bottom-[3px] size-2.5 bg-gray-100 dark:bg-gray-800"
                                        />
                                    </span>
                                </UButton>
                            </UDropdownMenu>

                            <UDropdownMenu
                                class="ring-0"
                                :items="availableLocales"
                                :content="{ align: 'start', side: 'bottom' }"
                            >
                                <UButton
                                    class="lang-selector cursor-pointer"
                                    color="neutral"
                                    variant="subtle"
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
                                class="profile-selector ring-0"
                                :items="profileDropdownLinks"
                                :content="{ align: 'start', side: 'bottom' }"
                            >
                                <UButton
                                    color="neutral"
                                    :label="profileDisplayName"
                                    variant="subtle"
                                    class="cursor-pointer"
                                    trailing-icon="i-lucide-chevron-down"
                                >
                                    <template #leading>
                                        <UAvatar
                                            :src="profile?.photoUrl || undefined"
                                            :alt="profileDisplayName"
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
import { useLocalePath, useI18n, useColorMode, onMounted, useRouter, useRequestHeaders, useState, computed, ref } from '#imports'
import { readCookieValue } from '@/utils/cookies'
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
const colorMode = useColorMode()

const isHeaderOpened = ref(false)
const isProfileLoading = computed(() => authStore.isProfileLoading)
const isLogged = computed(() => authStore.isLogged)
const profile = computed<ProfileInterface | null>(() => authStore.profile)
const profileDisplayName = computed(() => {
    return profile.value?.lastName
        ? `${profile.value.name} ${profile.value.lastName}`
        : profile.value?.name
})
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
            class: 'cursor-pointer',
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
            icon: 'i-lucide-sparkles',
            class: 'cursor-pointer'
        }, {
            label: t('signOut'),
            icon: 'i-lucide-log-out',
            class: 'cursor-pointer',
            onSelect: () => onLogout()
        }]
    ]
})

type ThemeChoice = 'light' | 'dark' | 'system'
const themeChoices: { value: ThemeChoice, labelKey: string, icon: string }[] = [
    { value: 'light', labelKey: 'theme.light', icon: 'i-lucide-sun' },
    { value: 'dark', labelKey: 'theme.dark', icon: 'i-lucide-moon' },
    { value: 'system', labelKey: 'theme.system', icon: 'i-lucide-monitor' }
]
const isSystemTheme = computed(() => colorMode.preference === 'system')
const themeMenuItems = computed<DropdownMenuItem[][]>(() => {
    return [themeChoices.map<DropdownMenuItem>(choice => ({
        label: t(choice.labelKey),
        icon: choice.icon,
        type: 'checkbox',
        checked: colorMode.preference === choice.value,
        class: 'cursor-pointer',
        onSelect() {
            onThemeChange(choice.value)
        }
    }))]
})

function onThemeChange(choice: ThemeChoice) {
    colorMode.preference = choice
}

// Must read the incoming Cookie header, not document.cookie: @nuxtjs/i18n writes `cshtrkl`
// on the first load too, so client-side one always exists and the check would never fire.
// useState resolves it once server-side and hydrates the result.
const isFreshVisitor = useState('ct-fresh-visitor-locale', () => {
    const cookieHeader = useRequestHeaders(['cookie']).cookie ?? ''
    return readCookieValue(cookieHeader, 'cshtrkl') === null
})

onMounted(() => {
    loadProfile()
})

function loadProfile() {
    profileGet().then((response) => {
        authStore.login(response.data)
        applyProfileLocale(response.data.locale)
    }).catch(() => {
        authStore.logout()
    })
}

// Fresh visitors only — a returning visitor's cshtrkl is the newer, explicit signal and
// must not be pulled back to the account's stored locale on reload.
// setLocale() is i18n's routing-aware setter: under prefix_except_default it navigates.
function applyProfileLocale(profileLocale: string) {
    if (!isFreshVisitor.value) {
        return
    }

    const isSupported = locales.value.some(l => l.code === profileLocale)
    if (isSupported && profileLocale !== locale.value) {
        setLocale(profileLocale as 'en' | 'uk')
    }
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
    @apply mb-5 py-2 px-4 border-b border-gray-200 dark:border-gray-600;

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
