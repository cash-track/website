<template>
    <section class="info-page">
        <h1>{{ $t('help.help') }}</h1>

        <hr>

        <p>{{ $t('help.notice') }}</p>
    </section>
</template>

<script setup lang="ts">
import { useHead, useI18n } from '#imports'

const { t } = useI18n()

useHead({
    title: t('help.title'),
    meta: [{ property: 'og:title', content: t('help.title') }]
})
</script>
