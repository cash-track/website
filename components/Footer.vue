<template>
    <div class="footer text-center">
        <UContainer>
            <div class="sm:flex items-start">
                <div class="sm:basis-1/3 sm:text-left text-center">
                    © {{ year }} Cash Track
                </div>
                <div class="sm:basis-1/3 text-center" v-html="$t('madeBy')" />
                <div class="sm:basis-1/3 sm:text-right text-center">
                    <ul class="nav sm:justify-end justify-center">
                        <li>
                            <ULink class="link" :to="localePath('cookie-policy')">
                                {{ $t('cookiePolicy.link') }}
                            </ULink>
                        </li>
                        <li>
                            <ULink class="link" :to="localePath('privacy-policy')">
                                {{ $t('privacyPolicy.link') }}
                            </ULink>
                        </li>
                        <li>
                            <ULink class="link" to="https://t.me/cash_track" target="_blank">
                                <TgIcon class="link-icon" />
                            </ULink>
                        </li>
                    </ul>
                </div>
            </div>
        </UContainer>
    </div>
</template>

<script setup lang="ts">
import TgIcon from '@/components/Shared/TgIcon.vue'
const year = new Date().getFullYear()
const localePath = useLocalePath()
</script>

<style lang="scss">
.footer {
    @apply py-5 px-0 w-full h-14 bottom-0 mt-4 text-sm border-t border-t-gray-200 dark:border-gray-600;

    .nav {
        li {
            @apply inline-block align-middle leading-6 h-6;

            button, a {
                @apply block px-4;
            }
        }
    }
}

@media (max-width: 576px) {
    .footer {
        @apply h-auto;
    }
}
</style>
