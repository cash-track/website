<script setup lang="ts">
import type { Form } from '#ui/types'
import { useReCaptcha } from 'vue-recaptcha-v3'
import { useI18n, useLocalePath } from '#imports'
import { useLoader } from '@/shared/Loader'
import { useValidationMessager } from '@/shared/ValidatorMessager'
import { resetPassword, type ResetPasswordRequestInterface } from '@/api/password'

const { t } = useI18n()
const loader = useLoader()
const messager = useValidationMessager()
const localePath = useLocalePath()
const recaptchaInstance = useReCaptcha()
const props = defineProps<{
    code: string
}>()

const request = reactive<ResetPasswordRequestInterface>({
    code: '',
    password: '',
    passwordConfirmation: ''
})
const isSuccess = ref<boolean>(false)
const isCodeInvalid = ref<boolean>(false)
const form = ref<Form<ResetPasswordRequestInterface>>()
const recaptcha = async () => {
    await recaptchaInstance?.recaptchaLoaded()
    return await recaptchaInstance?.executeRecaptcha('resetPassword')
}

messager.disableUnprocessableEntityMessage()

async function onSubmit() {
    form?.value?.clear()
    loader.setLoading()
    messager.resetMessage()

    if (props.code === undefined) {
        isCodeInvalid.value = true
        return
    }

    request.code = props.code

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
        await resetPassword(request, challenge)
        isSuccess.value = true
    } catch (error) {
        loader.setLoaded()
        messager.dispatchError(error)
        isCodeInvalid.value = messager.hasValidationMessage('code')
        return
    }

    loader.setLoaded()
}
</script>

<template>
    <UCard :ui="{body: {padding: 'px-6 py-6 sm:p-10'}}">
        <UForm ref="form" :state="request" @submit="onSubmit">
            <UFormGroup
                v-if="!isCodeInvalid && !isSuccess"
                class="mb-6"
                size="xl"
                :label="$t('passwordReset.newPassword')"
                name="password"
                :disabled="loader.isLoading()"
                :ui="{label:{wrapper: 'flex content-center items-center justify-between mb-4'}}"
                :error="messager.validationMessage('password')"
                @change="messager.resetValidationMessage('password')"
            >
                <UInput v-model="request.password" type="password" />
            </UFormGroup>

            <UFormGroup
                v-if="!isCodeInvalid && !isSuccess"
                class="mb-6"
                size="xl"
                :label="$t('passwordReset.newPasswordConfirmation')"
                name="password-confirmation"
                :disabled="loader.isLoading()"
                :ui="{label:{wrapper: 'flex content-center items-center justify-between mb-4'}}"
                :error="messager.validationMessage('passwordConfirmation')"
                @change="messager.resetValidationMessage('passwordConfirmation')"
            >
                <UInput v-model="request.passwordConfirmation" type="password" />
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
                v-if="isCodeInvalid"
                class="mb-6"
                icon="i-heroicons-exclamation-triangle-16-solid"
                color="orange"
                variant="subtle"
            >
                <template #description>
                    {{ $t('passwordReset.codeInvalid[0]') }}
                    {{ $t('passwordReset.codeInvalid[1]') }}
                    <ULink :to="localePath('/password/forgot')" class="link">
                        {{ $t('passwordReset.codeInvalid[2]') }}
                    </ULink>
                    {{ $t('passwordReset.codeInvalid[3]') }}
                </template>
            </UAlert>

            <UAlert
                v-if="isSuccess"
                class="mb-6"
                color="primary"
                variant="subtle"
                icon="i-heroicons-check-badge-16-solid"
            >
                <template #description>
                    {{ $t('passwordReset.success[0]') }}
                    {{ $t('passwordReset.success[1]') }}
                    <ULink :to="localePath('/login')" class="link">
                        {{ $t('passwordReset.success[2]') }}
                    </ULink>
                    {{ $t('passwordReset.success[3]') }}
                </template>
            </UAlert>

            <UButton
                v-if="!isSuccess && !isCodeInvalid"
                type="submit"
                block
                size="lg"
                class="mb-6"
                :loading="loader.isLoading()"
                :disabled="loader.isLoading()"
            >
                {{ $t('passwordReset.reset') }}
            </UButton>
        </UForm>
    </UCard>
</template>
