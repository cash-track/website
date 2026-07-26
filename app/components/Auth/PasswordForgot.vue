<script setup lang="ts">
import { useReCaptcha } from 'vue-recaptcha-v3'
import { useI18n, useTemplateRef } from '#imports'
import { useLoader } from '@/lib/Loader'
import { useValidationMessager } from '@/lib/ValidatorMessager'
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
const form = useTemplateRef('form')
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
    }
    catch (error) {
        console.log('Captcha error: ', error)
        messager.setMessage(t('error.captcha'))
        loader.setLoaded()
        return
    }

    try {
        await forgotPassword(request.email, challenge)
        isSuccess.value = true
    }
    catch (error) {
        loader.setLoaded()
        messager.dispatchError(error)
        return
    }

    loader.setLoaded()
}
</script>

<template>
    <UCard :ui="{ body: 'px-6 py-6 sm:p-10' }">
        <UForm
            ref="form"
            :state="request"
            @submit="onSubmit"
        >
            <UFormField
                class="mb-6"
                size="xl"
                :label="$t('passwordForgot.email')"
                name="email"
                :ui="{ labelWrapper: 'mb-4', container: 'mt-0' }"
                :error="messager.validationMessage('email')"
                @change="messager.resetValidationMessage('email')"
            >
                <UInput
                    v-model="request.email"
                    class="w-full"
                    :disabled="loader.isLoading() || isSuccess"
                />
            </UFormField>

            <UAlert
                v-if="messager.hasMessage && !isSuccess"
                class="mb-6"
                icon="i-lucide-triangle-alert"
                color="warning"
                variant="subtle"
                :description="messager.getMessage()"
            />

            <UAlert
                v-if="isSuccess"
                class="mb-6"
                color="primary"
                variant="subtle"
                icon="i-lucide-badge-check"
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
