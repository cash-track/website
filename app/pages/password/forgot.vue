<template>
    <section class="flex justify-center">
        <div class="auth-container mb-8">
            <p class="text-2xl text-gray-400 text-center mt-14 mb-8">
                {{ t('passwordForgot.passwordForgot') }}
            </p>
            <password-forgot />
        </div>
    </section>
</template>

<script setup lang="ts">
import { definePageMeta, useI18n, useHead } from '#imports'
import PasswordForgot from '@/components/Auth/PasswordForgot.vue'

const { t } = useI18n()

definePageMeta({
    title: 'passwordForgot.title'
})

useHead({
    title: t('passwordForgot.title')
})
</script>
