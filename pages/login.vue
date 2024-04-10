<template>
    <section class="flex justify-center">
        <div class="auth-container mb-8">
            <p class="text-2xl text-gray-400 text-center mt-14 mb-8">
                {{ t('signIn.signIn') }}
            </p>
            <login />
        </div>
    </section>
</template>

<script setup lang="ts">
import { definePageMeta, useI18n, useHead } from '#imports'
import Login from '@/components/Auth/Login.vue'

const { t } = useI18n()

definePageMeta({
    title: 'signIn.title'
})

useHead({
    title: t('signIn.title')
})
</script>
