<template>
    <div>
        <div class="jumbotron welcome">
            <h2>{{ $t('home.header') }}</h2>
            <p class="lead">
                {{ $t('home.lead') }}
            </p>
            <p>{{ $t('home.banner') }}</p>
            <span v-if="isProfileLoading || !isLogged">
                <UButton
                    variant="solid"
                    color="primary"
                    size="lg"
                    :disabled="isProfileLoading"
                    :to="localePath('login')"
                >
                    {{ $t('home.login') }}
                </UButton>
                {{ $t('home.or') }}
                <UButton
                    variant="solid"
                    color="primary"
                    size="lg"
                    :disabled="isProfileLoading"
                    :to="localePath('register')"
                >
                    {{ $t('home.register') }}
                </UButton>
            </span>
            <span v-if="isLogged">
                <UButton
                    variant="solid"
                    color="primary"
                    size="lg"
                    :disabled="isProfileLoading"
                    :to="webAppLinks.walletsLink"
                >
                    {{ $t('home.wallets') }}
                </UButton>
            </span>
        </div>

        <div class="row mb-4">
            <div class="col mb-4 sm:basis-1/3">
                <h3>🤌 {{ $t('home.easy') }}</h3>
                <p>{{ $t('home.easyDescription') }}</p>
            </div>
            <div class="col mb-4 sm:basis-1/3">
                <h3>💫 {{ $t('home.fast') }}</h3>
                <p>{{ $t('home.fastDescription') }}</p>
            </div>
            <div class="col mb-4 sm:basis-1/3">
                <h3>☔️ {{ $t('home.secure') }}</h3>
                <p>{{ $t('home.secureDescription') }}</p>
            </div>
        </div>

        <div class="jumbotron telegram">
            <h3>{{ $t('home.telegram.header') }}</h3>
            <p class="lead">
                {{ $t('home.telegram.lead') }}
            </p>
            <span>
                <UButton
                    color="primary"
                    variant="outline"
                    size="lg"
                    to="https://t.me/cash_track"
                    target="_blank"
                    class="hover:bg-primary-500 hover:text-white transition-colors"
                >
                    {{ $t('home.telegram.subscribe') }} <TgIcon />
                </UButton>
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useHead, defineI18nRoute, useLocalePath, useI18n, computed } from '#imports'
import { useWebAppLinks } from '@/shared/WebAppLinks'
import { useAuthStore } from '@/store/auth'
import TgIcon from '@/components/Shared/TgIcon.vue'

const { t } = useI18n()
const localePath = useLocalePath()
const webAppLinks = useWebAppLinks()
const auth = useAuthStore()

useHead({
    title: t('home.title'),
    meta: [{ property: 'og:title', content: t('home.title') }]
})
defineI18nRoute(false)

const isLogged = computed(() => auth.isLogged)
const isProfileLoading = computed(() => auth.isProfileLoading)
</script>

<style scoped lang="scss">
h3 {
    @apply text-3xl;
}

.telegram {
    background-image: url('/img/tg-logo.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: calc(100% + 120px) 40px;
    background-color: #f5fff5;
}

.welcome {
    background: linear-gradient(
            -45deg,
            #ee7752,
            #e73c7e,
            #23a6d5,
            #23d5ab,
            #5ccb80
    );
    background-size: 400% 400%;
    animation: gradient 60s ease infinite;
    color: #f5fff5;
}

@keyframes gradient {
    0% {
        background-position: 0 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0 50%;
    }
}
</style>
