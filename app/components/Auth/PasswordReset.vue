<script setup lang="ts">
import { useReCaptcha } from 'vue-recaptcha-v3'
import { useI18n, useLocalePath, useTemplateRef } from '#imports'
import { useLoader } from '@/lib/Loader'
import { useValidationMessager } from '@/lib/ValidatorMessager'
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
const form = useTemplateRef('form')
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
    }
    catch (error) {
        console.log('Captcha error: ', error)
        messager.setMessage(t('error.captcha'))
        loader.setLoaded()
        return
    }

    try {
        await resetPassword(request, challenge)
        isSuccess.value = true
    }
    catch (error) {
        loader.setLoaded()
        messager.dispatchError(error)
        isCodeInvalid.value = messager.hasValidationMessage('code')
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
                v-if="!isCodeInvalid && !isSuccess"
                class="mb-6"
                size="xl"
                :label="$t('passwordReset.newPassword')"
                name="password"
                :ui="{ labelWrapper: 'mb-4', container: 'mt-0' }"
                :error="messager.validationMessage('password')"
                @change="messager.resetValidationMessage('password')"
            >
                <UInput
                    v-model="request.password"
                    type="password"
                    class="w-full"
                    :disabled="loader.isLoading()"
                />
            </UFormField>

            <UFormField
                v-if="!isCodeInvalid && !isSuccess"
                class="mb-6"
                size="xl"
                :label="$t('passwordReset.newPasswordConfirmation')"
                name="password-confirmation"
                :ui="{ labelWrapper: 'mb-4', container: 'mt-0' }"
                :error="messager.validationMessage('passwordConfirmation')"
                @change="messager.resetValidationMessage('passwordConfirmation')"
            >
                <UInput
                    v-model="request.passwordConfirmation"
                    type="password"
                    class="w-full"
                    :disabled="loader.isLoading()"
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
                v-if="isCodeInvalid"
                class="mb-6"
                icon="i-lucide-triangle-alert"
                color="warning"
                variant="subtle"
            >
                <template #description>
                    {{ $t('passwordReset.codeInvalid[0]') }}
                    {{ $t('passwordReset.codeInvalid[1]') }}
                    <ULink
                        :to="localePath('/password/forgot')"
                        class="link"
                    >
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
                icon="i-lucide-badge-check"
            >
                <template #description>
                    {{ $t('passwordReset.success[0]') }}
                    {{ $t('passwordReset.success[1]') }}
                    <ULink
                        :to="localePath('/login')"
                        class="link"
                    >
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
