<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { FetchError } from 'ofetch'
import { useReCaptcha } from 'vue-recaptcha-v3'
import { watchDebounced } from '@vueuse/core'
import { onMounted, useTemplateRef, useI18n, useLocalePath, useRuntimeConfig } from '#imports'
import { useLoader } from '@/lib/Loader'
import type { LoginResponseInterface } from '@/api/login'
import { checkNickName, register, type RegisterRequestInterface, type RegisterResponseInterface } from '@/api/register'
import { useValidationMessager } from '@/lib/ValidatorMessager'
import { profileGet } from '@/api/profile'
import { useAuthStore } from '@/store/auth'
import { googleAuthProvider } from '@/api/authProvider'

const { t, locale } = useI18n()
const loader = useLoader()
const messager = useValidationMessager()
const config = useRuntimeConfig()
const recaptchaInstance = useReCaptcha()
const store = useAuthStore()
const localePath = useLocalePath()

const request = reactive<RegisterRequestInterface>({
    name: '',
    lastName: '',
    nickName: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    locale: ''
})
const form = useTemplateRef('form')
const confirmation = ref<boolean>(false)
const isNickNameValid = ref<boolean | null>(null)

const recaptcha = async () => {
    await recaptchaInstance?.recaptchaLoaded()
    return await recaptchaInstance?.executeRecaptcha('register')
}

watchDebounced(() => request.nickName, () => {
    isNickNameValid.value = null
    validateNickName()
}, { debounce: 1000 })

async function validateNickName() {
    try {
        await checkNickName(request.nickName)
        isNickNameValid.value = true
        messager.resetValidationMessage('nickName')
    }
    catch (error) {
        isNickNameValid.value = false
        if (error instanceof FetchError && error.statusCode === 422 && error?.data?.errors?.nickName) {
            messager.setValidationMessage('nickName', error?.data?.errors?.nickName)
        }
    }
}

async function onSubmit(event: FormSubmitEvent<RegisterRequestInterface>) {
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

    // set current locale for the user
    event.data.locale = locale.value

    let registerResponse: RegisterResponseInterface

    try {
        registerResponse = await register(event.data, challenge)
    }
    catch (error) {
        loader.setLoaded()
        messager.dispatchError(error)
        return
    }

    try {
        const profileResponse = await profileGet()
        store.login(profileResponse.data)
    }
    catch (error) {
        loader.setLoaded()
        messager.dispatchError(error)
        return
    }

    onSuccess(registerResponse)
}

async function onLoggedByGoogle(response: google.accounts.id.CredentialResponse) {
    form?.value?.clear()
    loader.setLoading()
    messager.resetMessage()

    if (!response?.credential) {
        console.log('Google auth error: ', response)
        messager.setMessage(t('error.googleLogin'))
        loader.setLoaded()
        return
    }

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

    let loginResponse: LoginResponseInterface

    try {
        loginResponse = await googleAuthProvider({
            token: response.credential
        }, challenge)
    }
    catch (error) {
        loader.setLoaded()
        messager.dispatchError(error)
        return
    }

    try {
        const profileResponse = await profileGet()
        store.login(profileResponse.data)
    }
    catch (error) {
        loader.setLoaded()
        messager.dispatchError(error)
        return
    }

    onSuccess(loginResponse)
}

function onSuccess(response: LoginResponseInterface | RegisterResponseInterface) {
    window.location.href = response.redirectUrl
}

onMounted(() => {
    initGoogleAuthButton()
})

function initGoogleAuthButton() {
    const btn = document.getElementById('register-google-button')

    if (!btn) {
        return
    }

    google.accounts.id.initialize({
        client_id: config.public.googleClientId,
        context: 'signin',
        callback: onLoggedByGoogle,
        ux_mode: 'popup'
    })

    google.accounts.id.renderButton(btn, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'signin_with'
    })
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
                :label="$t('register.name')"
                name="name"
                :ui="{ labelWrapper: 'mb-4', container: 'mt-0' }"
                :error="messager.validationMessage('name')"
                @change="messager.resetValidationMessage('name')"
            >
                <UInput
                    v-model="request.name"
                    class="w-full"
                    :disabled="loader.isLoading()"
                />
            </UFormField>

            <UFormField
                class="mb-6"
                size="xl"
                :label="$t('register.lastName')"
                name="lastName"
                :ui="{ labelWrapper: 'mb-4', container: 'mt-0' }"
                :error="messager.validationMessage('lastName')"
                :hint="$t('optional')"
                @change="messager.resetValidationMessage('lastName')"
            >
                <UInput
                    v-model="request.lastName"
                    class="w-full"
                    :disabled="loader.isLoading()"
                />
            </UFormField>

            <UFormField
                class="mb-6"
                size="xl"
                :label="$t('register.nickName')"
                name="nickName"
                :ui="{ labelWrapper: 'mb-4', container: 'mt-0' }"
                :error="messager.validationMessage('nickName')"
                @change="isNickNameValid ? messager.resetValidationMessage('nickName') : null"
            >
                <UInput
                    v-model="request.nickName"
                    class="w-full"
                    :disabled="loader.isLoading()"
                >
                    <template #trailing>
                        <UIcon
                            v-show="isNickNameValid === true"
                            name="i-lucide-circle-check"
                            class="text-success text-xl"
                        />
                        <UIcon
                            v-show="isNickNameValid === false"
                            name="i-lucide-triangle-alert"
                            class="text-error text-xl"
                        />
                    </template>
                </UInput>
            </UFormField>

            <UFormField
                class="mb-6"
                size="xl"
                :label="$t('register.email')"
                name="email"
                :ui="{ labelWrapper: 'mb-4', container: 'mt-0' }"
                :error="messager.validationMessage('email')"
                @change="messager.resetValidationMessage('email')"
            >
                <UInput
                    v-model="request.email"
                    type="email"
                    class="w-full"
                    :disabled="loader.isLoading()"
                />
            </UFormField>

            <UFormField
                class="mb-6"
                size="xl"
                :label="$t('register.password')"
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
                class="mb-6"
                size="xl"
                :label="$t('register.passwordConfirmation')"
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

            <UCheckbox
                v-model="confirmation"
                class="mb-6"
                :ui="{ label: 'cursor-pointer' }"
            >
                <template #label>
                    {{ $t('register.confirmation[0]') }}
                    <ULink
                        :to="localePath('/privacy-policy')"
                        class="link"
                    >{{ $t('register.confirmation[1]') }}</ULink>
                </template>
            </UCheckbox>

            <UAlert
                v-if="messager.hasMessage"
                class="mb-6"
                icon="i-lucide-triangle-alert"
                color="warning"
                variant="subtle"
                :description="messager.getMessage()"
            />

            <UButton
                type="submit"
                block
                size="lg"
                class="mb-6"
                :loading="loader.isLoading()"
                :disabled="loader.isLoading() || !confirmation"
            >
                {{ $t('register.register') }}
            </UButton>

            <USeparator
                :label="$t('register.or')"
                class="mb-6"
            />

            <div
                id="register-google-button"
                class="mb-6"
            />

            <ULink
                :to="localePath('/login')"
                class="link"
            >
                {{ $t('register.alreadyHaveAccount') }}
            </ULink>
        </UForm>
    </UCard>
</template>
