<template>
    <div>
        <Header />
        <UContainer class="pb-1">
            <slot />
        </UContainer>
        <Footer />
    </div>
</template>

<script setup lang="ts">
import type { ReactiveHead } from '@unhead/vue'
import { computed, useHead, useLocaleHead, useI18n } from '#imports'

const { t } = useI18n()

const head = useLocaleHead({
    dir: true,
    seo: true
})
const title = computed(() => t('home.title'))

useHead((): ReactiveHead => ({
    htmlAttrs: head.value.htmlAttrs,
    // @nuxtjs/i18n types head entries as Record<string, string>, which doesn't overlap
    // with unhead's tag shapes — the values are valid at runtime.
    link: head.value.link as unknown as ReactiveHead['link'],
    meta: head.value.meta as unknown as ReactiveHead['meta'],
    title: title.value
}))
</script>
