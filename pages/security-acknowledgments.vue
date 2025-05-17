<template>
    <div class="info-page">
        <h1>{{ $t('securityAcknowledgement.securityAcknowledgement') }}</h1>

        <hr>

        <p>
            <b>{{ $t('securityAcknowledgement.effectiveDate') }}</b>
            <br>
            <b>{{ $t('securityAcknowledgement.lastUpdated') }}</b>
        </p>

        <div>
            <p>{{ $t('securityAcknowledgement.about[0]') }}</p>
            <p>{{ $t('securityAcknowledgement.researchers[0]') }}</p>
            <UAlert
                color="blue"
                variant="subtle"
                icon="i-heroicons-command-line"
                :description="$t('securityAcknowledgement.researchers[1]')"
            />
        </div>

        <br>
    </div>
</template>

<script setup lang="ts">
import { useHead, useI18n } from '#imports'

const { t } = useI18n()

useHead({
    title: t('securityAcknowledgement.title'),
    meta: [{ property: 'og:title', content: t('securityAcknowledgement.title') }]
})
</script>
