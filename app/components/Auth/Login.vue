<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import type { AuthenticationResponseJSON } from '@simplewebauthn/browser'
import { useReCaptcha } from 'vue-recaptcha-v3'
import { startAuthentication, browserSupportsWebAuthn } from '@simplewebauthn/browser'
import { onMounted, ref, useTemplateRef, useI18n, useLocalePath, useRuntimeConfig } from '#imports'
import { useLoader } from '@/lib/Loader'
import { login, type LoginRequestInterface, type LoginResponseInterface } from '@/api/login'
import { useValidationMessager } from '@/lib/ValidatorMessager'
import { profileGet } from '@/api/profile'
import { useAuthStore } from '@/store/auth'
import { googleAuthProvider } from '@/api/authProvider'
import { passkeyInit, type PasskeyInitResponseInterface, passkeyLogin } from '@/api/passkey'

const { t } = useI18n()
const loader = useLoader()
const passkeyLoader = useLoader()
const messager = useValidationMessager()
const config = useRuntimeConfig()
const recaptchaInstance = useReCaptcha()
const store = useAuthStore()
const localePath = useLocalePath()
const passkeysSupported = ref<boolean>(false)

const request = reactive<LoginRequestInterface>({
    email: '',
    password: '',
    remember: false
})
const form = useTemplateRef('form')

const recaptcha = async () => {
    await recaptchaInstance?.recaptchaLoaded()
    return await recaptchaInstance?.executeRecaptcha('login')
}

async function onSubmit(event: FormSubmitEvent<LoginRequestInterface>) {
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

    let loginResponse: LoginResponseInterface

    try {
        loginResponse = await login(event.data, challenge)
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

function onSuccess(response: LoginResponseInterface) {
    window.location.href = response.redirectUrl
}

onMounted(() => {
    initGoogleAuthButton()
    passkeysSupported.value = browserSupportsWebAuthn()
})

function initGoogleAuthButton() {
    const btn = document.getElementById('login-google-button')

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

async function loginWithPasskey() {
    if (!passkeysSupported.value) {
        console.info('Passkeys: not supported')
        return
    }

    form?.value?.clear()
    passkeyLoader.setLoading()
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
        passkeyLoader.setLoaded()
        return
    }

    let initResponse: PasskeyInitResponseInterface

    try {
        initResponse = await passkeyInit(challenge)
    }
    catch (error) {
        passkeyLoader.setLoaded()
        messager.dispatchError(error)
        return
    }

    let authResponse: AuthenticationResponseJSON

    try {
        authResponse = await startAuthentication({ optionsJSON: initResponse.dataDecoded })
    }
    catch (error) {
        passkeyLoader.setLoaded()
        messager.dispatchError(error)
        return
    }

    let loginResponse: LoginResponseInterface

    try {
        loginResponse = await passkeyLogin(initResponse.challenge, authResponse, challenge)
    }
    catch (error) {
        passkeyLoader.setLoaded()
        messager.dispatchError(error)
        return
    }

    try {
        const profileResponse = await profileGet()
        store.login(profileResponse.data)
    }
    catch (error) {
        passkeyLoader.setLoaded()
        messager.dispatchError(error)
        return
    }

    onSuccess(loginResponse)
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
                :label="$t('signIn.email')"
                name="email"
                :ui="{ labelWrapper: 'mb-4', container: 'mt-0' }"
                :error="messager.validationMessage('email')"
                @change="messager.resetValidationMessage('email')"
            >
                <UInput
                    v-model="request.email"
                    class="w-full"
                    :disabled="loader.isLoading() || passkeyLoader.isLoading()"
                />
            </UFormField>

            <UFormField
                class="mb-6"
                size="xl"
                :label="$t('signIn.password')"
                name="password"
                :ui="{ labelWrapper: 'mb-4', container: 'mt-0' }"
                :error="messager.validationMessage('password')"
                @change="messager.resetValidationMessage('password')"
            >
                <UInput
                    v-model="request.password"
                    type="password"
                    class="w-full"
                    :disabled="loader.isLoading() || passkeyLoader.isLoading()"
                />
            </UFormField>

            <ULink
                :to="localePath('/password/forgot')"
                class="link block mb-6"
            >
                {{ $t('signIn.forgotPassword') }}
            </ULink>

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
                :disabled="loader.isLoading() || passkeyLoader.isLoading()"
            >
                {{ $t('signIn.login') }}
            </UButton>

            <USeparator
                :label="$t('signIn.or')"
                class="mb-6"
            />

            <UButton
                v-if="passkeysSupported"
                type="button"
                block
                size="lg"
                class="mb-6"
                variant="outline"
                :loading="passkeyLoader.isLoading()"
                :disabled="!passkeysSupported || passkeyLoader.isLoading()"
                @click="loginWithPasskey"
            >
                {{ $t('signIn.loginWithPasskey') }}
            </UButton>

            <div
                id="login-google-button"
                class="mb-6"
            />

            <ULink
                :to="localePath('/register')"
                class="link"
            >
                {{ $t('signIn.dontHaveAccount') }}
            </ULink>
        </UForm>
    </UCard>
</template>
