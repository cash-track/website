<template>
    <section class="flex justify-center">
        <div class="auth-container mb-8">
            <p class="text-2xl text-gray-400 text-center mt-14 mb-8">
                {{ t('passwordReset.passwordReset') }}
            </p>
            <password-reset :code="route.params?.code?.toString()" />
        </div>
    </section>
</template>

<script setup lang="ts">
import { definePageMeta, useI18n, useHead, useRoute } from '#imports'
import PasswordReset from '@/components/Auth/PasswordReset.vue'

const { t } = useI18n()
const route = useRoute()

definePageMeta({
    title: 'passwordReset.title'
})

useHead({
    title: t('passwordReset.title')
})
</script>
