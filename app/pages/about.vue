<template>
    <section class="info-page">
        <h1>{{ $t('about.about') }}</h1>

        <hr>

        <blockquote>
            <p>{{ $t('about.quote') }}</p>
            <footer>
                <cite>{{ $t('about.quoteAuthor') }}</cite>
            </footer>
        </blockquote>

        <p>{{ $t('about.lines[0]') }}</p>
        <p>{{ $t('about.lines[1]') }}</p>
        <p>{{ $t('about.lines[2]') }}</p>

        <ul>
            <li>{{ $t('about.features[0]') }}</li>
            <li>{{ $t('about.features[1]') }}</li>
            <li>{{ $t('about.features[2]') }}</li>
            <li>{{ $t('about.features[3]') }}</li>
        </ul>

        <p class="lead">
            {{ $t('about.connect') }}
        </p>
        <p>
            <UButton :to="localePath('/register')">
                {{ $t('about.register') }}
            </UButton>
            {{ $t('about.or') }}
            <UButton :to="localePath('/login')">
                {{ $t('about.login') }}
            </UButton>
        </p>

        <p>{{ $t('about.tgChannel[0]') }}</p>
        <p>
            <UButton
                to="https://t.me/cash_track"
                target="_blank"
            >
                {{ $t('about.tgChannel[1]') }}
                <tg-icon />
            </UButton>
        </p>

        <p>{{ $t('about.moreLines[0]') }}</p>

        <p>
            {{ $t('about.moreLines[1]') }}
            {{ $t('about.moreLines[2]') }}
            <a
                href="https://github.com/cash-track/website/issues/new"
                target="_blank"
            >{{ $t('about.moreLines[3]') }}
            </a>
            {{ $t('about.moreLines[4]') }}
        </p>
        <p>{{ $t('about.moreLines[5]') }}</p>
    </section>
</template>

<script setup lang="ts">
import { useHead, useI18n, useLocalePath } from '#imports'
import TgIcon from '@/components/Shared/TgIcon.vue'

const { t } = useI18n()
const localePath = useLocalePath()

useHead({
    title: t('about.title'),
    meta: [{ property: 'og:title', content: t('about.title') }]
})
</script>
