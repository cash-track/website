<template>
    <section class="flex justify-center">
        <div class="auth-container mb-8">
            <email-confirmation :token="route.params?.token?.toString()" />
        </div>
    </section>
</template>

<script setup lang="ts">
import { definePageMeta, useI18n, useHead, useRoute } from '#imports'
import EmailConfirmation from '@/components/Auth/EmailConfirmation.vue'

const { t } = useI18n()
const route = useRoute()

definePageMeta({
    title: 'emailConfirmation.title'
})

useHead({
    title: t('emailConfirmation.title')
})
</script>
