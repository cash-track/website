<template>
    <section class="flex justify-center">
        <div class="auth-container mb-8">
            <p class="text-2xl text-gray-400 text-center mt-14 mb-8">
                {{ t('register.signUp') }}
            </p>
            <register />
        </div>
    </section>
</template>

<script setup lang="ts">
import { definePageMeta, useI18n, useHead } from '#imports'
import Register from '@/components/Auth/Register.vue'

const { t } = useI18n()

definePageMeta({
    title: 'register.title'
})

useHead({
    title: t('register.title')
})
</script>
