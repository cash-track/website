<script setup lang="ts">
import { onMounted, useLocalePath } from '#imports'
import { useLoader } from '@/shared/Loader'
import { confirmEmail } from '@/api/email'
import { useAuthStore } from '@/store/auth'
import { useWebAppLinks } from '@/shared/WebAppLinks'

const loader = useLoader()
const store = useAuthStore()
const localePath = useLocalePath()
const webAppLinks = useWebAppLinks()
const props = defineProps<{
    token: string
}>()

const isSuccess = ref<boolean|null>(null)

onMounted(() => {
    submit()
})

function submit() {
    loader.setLoading()

    if (props.token === undefined) {
        onFailure()
        return
    }

    confirmEmail(props.token)
        .then(onConfirmed)
        .catch(onFailure)
        .finally(() => loader.setLoaded())
}

function onConfirmed() {
    isSuccess.value = true

    if (store.isLogged) {
        return
    }

    setTimeout(() => {
        window.location.href = webAppLinks.profileLink
    }, 2000)
}

function onFailure() {
    isSuccess.value = false
}
</script>

<template>
    <UCard :ui="{body: {padding: 'px-6 py-6 sm:p-10'}}">
        <UAlert
            v-show="loader.isLoading()"
            color="primary"
            variant="subtle"
        >
            <template #description>
                <UIcon name="i-svg-spinners:180-ring-with-bg" dynamic class="w-4 h-4 mr-2" />
                {{ $t('emailConfirmation.loading') }}
            </template>
        </UAlert>

        <UAlert
            v-if="!loader.isLoading() && isSuccess !== null && isSuccess"
            color="primary"
            variant="subtle"
            icon="i-heroicons-check-badge-16-solid"
        >
            <template #description>
                <span v-if="store.isLogged">
                    {{ $t('emailConfirmation.successLogged[0]') }}
                    {{ $t('emailConfirmation.successLogged[1]') }}
                    {{ $t('emailConfirmation.successLogged[2]') }}
                    <ULink :to="webAppLinks.profileLink" class="link underline">
                        {{ $t('emailConfirmation.successLogged[3]') }}
                    </ULink>
                    .
                </span>
                <span v-else>
                    {{ $t('emailConfirmation.success[0]') }}
                    {{ $t('emailConfirmation.success[1]') }}
                    <ULink :to="localePath('/login')" class="link underline">
                        {{ $t('emailConfirmation.success[2]') }}
                    </ULink>
                    {{ $t('emailConfirmation.success[3]') }}
                </span>
            </template>
        </UAlert>

        <UAlert
            v-if="!loader.isLoading() && isSuccess !== null && !isSuccess"
            color="orange"
            variant="subtle"
            icon="i-heroicons-exclamation-triangle-16-solid"
        >
            <template #description>
                {{ $t('emailConfirmation.codeInvalid[0]') }}
                {{ $t('emailConfirmation.codeInvalid[1]') }}
                {{ $t('emailConfirmation.codeInvalid[2]') }}
                <span v-if="!store.isLogged">
                    {{ $t('emailConfirmation.codeInvalid[3]') }}
                </span>
                {{ $t('emailConfirmation.codeInvalid[4]') }}
            </template>
        </UAlert>
    </UCard>
</template>
