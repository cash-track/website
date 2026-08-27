<template>
    <p class="status-hint mt-2">
        {{ $t('statusPage.hint') }}
        <ULink
            class="link"
            :to="STATUS_PAGE_URL"
            target="_blank"
            rel="noopener noreferrer"
        >{{ $t('statusPage.hintLink') }}</ULink>
    </p>
</template>

<script setup lang="ts">
import { STATUS_PAGE_URL } from '@/lib/StatusPage'
</script>
