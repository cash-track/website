<script setup lang="ts">
import type { Form } from '#ui/types'
import { useReCaptcha } from 'vue-recaptcha-v3'
import { useI18n } from '#imports'
import { useLoader } from '@/shared/Loader'
import { useValidationMessager } from '@/shared/ValidatorMessager'
import { forgotPassword } from '@/api/password'

interface PasswordForgot {
    email: string
}

const { t } = useI18n()
const loader = useLoader()
const messager = useValidationMessager()
const recaptchaInstance = useReCaptcha()

const request = reactive<PasswordForgot>({
    email: ''
})
const isSuccess = ref<boolean>(false)
const form = ref<Form<PasswordForgot>>()
const recaptcha = async () => {
    await recaptchaInstance?.recaptchaLoaded()
    return await recaptchaInstance?.executeRecaptcha('forgotPassword')
}

messager.disableUnprocessableEntityMessage()

async function onSubmit() {
    form?.value?.clear()
    loader.setLoading()
    messager.resetMessage()

    let challenge: string | undefined

    try {
        challenge = await recaptcha()

        if (challenge === undefined) {
            throw new Error('empty challenge')
        }
    } catch (error) {
        console.log('Captcha error: ', error)
        messager.setMessage(t('error.captcha'))
        loader.setLoaded()
        return
    }

    try {
        await forgotPassword(request.email, challenge)
        isSuccess.value = true
    } catch (error) {
        loader.setLoaded()
        messager.dispatchError(error)
        return
    }

    loader.setLoaded()
}
</script>

<template>
    <UCard :ui="{body: {padding: 'px-6 py-6 sm:p-10'}}">
        <UForm ref="form" :state="request" @submit="onSubmit">
            <UFormGroup
                class="mb-6"
                size="xl"
                :label="$t('passwordForgot.email')"
                name="email"
                :disabled="loader.isLoading() || isSuccess"
                :ui="{label:{wrapper: 'flex content-center items-center justify-between mb-4'}}"
                :error="messager.validationMessage('email')"
                @change="messager.resetValidationMessage('email')"
            >
                <UInput v-model="request.email" />
            </UFormGroup>

            <UAlert
                v-if="messager.hasMessage && !isSuccess"
                class="mb-6"
                icon="i-heroicons-exclamation-triangle-16-solid"
                color="orange"
                variant="subtle"
                :description="messager.getMessage()"
            />

            <UAlert
                v-if="isSuccess"
                class="mb-6"
                color="primary"
                variant="subtle"
                icon="i-heroicons-check-badge-16-solid"
            >
                <template #description>
                    {{ $t('passwordForgot.success[0]') }} <br>
                    {{ $t('passwordForgot.success[1]') }} <br>
                    {{ $t('passwordForgot.success[2]') }} <br>
                    {{ $t('passwordForgot.success[3]') }}
                </template>
            </UAlert>

            <UButton
                v-if="!isSuccess"
                type="submit"
                block
                size="lg"
                class="mb-6"
                :loading="loader.isLoading()"
                :disabled="loader.isLoading()"
            >
                {{ $t('passwordForgot.reset') }}
            </UButton>
        </UForm>
    </UCard>
</template>
