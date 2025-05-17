<template>
    <div class="info-page">
        <h1>{{ $t('securityPolicy.securityAcknowledgement') }}</h1>

        <hr>

        <p>
            <b>{{ $t('securityPolicy.effectiveDate') }}</b>
            <br>
            <b>{{ $t('securityPolicy.lastUpdated') }}</b>
        </p>

        <div>
            <p>{{ $t('securityPolicy.intro[0]') }}</p>
        </div>

        <h3>{{ $t('securityPolicy.reporting[0]') }}</h3>
        <div>
            <p>{{ $t('securityPolicy.reporting[1]', {email: 'support@mail.cash-track.app'}) }}</p>
            <ul>
                <li>{{ $t('securityPolicy.reporting[2]') }}</li>
                <li>{{ $t('securityPolicy.reporting[3]') }}</li>
                <li>{{ $t('securityPolicy.reporting[4]') }}</li>
                <li>{{ $t('securityPolicy.reporting[5]') }}</li>
            </ul>
            <p>{{ $t('securityPolicy.reporting[6]') }}</p>
        </div>

        <h3>{{ $t('securityPolicy.legal[0]') }}</h3>
        <div>
            <p>{{ $t('securityPolicy.legal[1]') }}</p>
            <ul>
                <li>{{ $t('securityPolicy.legal[2]') }}</li>
                <li>{{ $t('securityPolicy.legal[3]') }}</li>
                <li>{{ $t('securityPolicy.legal[4]') }}</li>
            </ul>
            <p>{{ $t('securityPolicy.legal[5]') }}</p>
        </div>

        <h3>{{ $t('securityPolicy.timeline[0]') }}</h3>
        <div>
            <p>{{ $t('securityPolicy.timeline[1]') }}</p>
            <ul>
                <li>{{ $t('securityPolicy.timeline[2]') }}</li>
                <li>{{ $t('securityPolicy.timeline[3]') }}</li>
            </ul>
            <p>{{ $t('securityPolicy.timeline[4]') }}</p>
        </div>

        <h3>{{ $t('securityPolicy.reward[0]') }}</h3>
        <div>
            <p>{{ $t('securityPolicy.reward[1]') }}</p>
            <h4>{{ $t('securityPolicy.reward[2]') }}</h4>
            <ul>
                <li>{{ $t('securityPolicy.reward[3]') }}</li>
                <li>{{ $t('securityPolicy.reward[4]') }}</li>
                <li>{{ $t('securityPolicy.reward[5]') }}</li>
                <li>{{ $t('securityPolicy.reward[6]') }}</li>
                <li>{{ $t('securityPolicy.reward[7]') }}</li>
            </ul>
            <p>{{ $t('securityPolicy.reward[8]') }}</p>
        </div>

        <h3>{{ $t('securityPolicy.thanks[0]') }}</h3>
        <div>
            <p>{{ $t('securityPolicy.thanks[1]', {email: 'support@mail.cash-track.app'}) }}</p>
        </div>

        <br>
    </div>
</template>

<script setup lang="ts">
import { useHead, useI18n } from '#imports'

const { t } = useI18n()

useHead({
    title: t('securityPolicy.title'),
    meta: [{ property: 'og:title', content: t('securityPolicy.title') }]
})
</script>
