<script setup lang="ts">
import type { Form, FormSubmitEvent } from '#ui/types'
import type { AuthenticationResponseJSON } from '@simplewebauthn/types'
import { useReCaptcha } from 'vue-recaptcha-v3'
import { startAuthentication, browserSupportsWebAuthn } from '@simplewebauthn/browser'
import { onMounted, ref, useI18n, useLocalePath, useRuntimeConfig } from '#imports'
import { useLoader } from '@/shared/Loader'
import { login, type LoginRequestInterface, type LoginResponseInterface } from '@/api/login'
import { useValidationMessager } from '@/shared/ValidatorMessager'
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
const form = ref<Form<LoginRequestInterface>>()

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
    } catch (error) {
        console.log('Captcha error: ', error)
        messager.setMessage(t('error.captcha'))
        loader.setLoaded()
        return
    }

    let loginResponse: LoginResponseInterface

    try {
        loginResponse = await login(event.data, challenge)
    } catch (error) {
        loader.setLoaded()
        messager.dispatchError(error)
        return
    }

    try {
        const profileResponse = await profileGet()
        store.login(profileResponse.data)
    } catch (error) {
        loader.setLoaded()
        messager.dispatchError(error)
        return
    }

    onSuccess(loginResponse)
}

async function onLoggedByGoogle(response: any) {
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
    } catch (error) {
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
    } catch (error) {
        loader.setLoaded()
        messager.dispatchError(error)
        return
    }

    try {
        const profileResponse = await profileGet()
        store.login(profileResponse.data)
    } catch (error) {
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

    // @ts-ignore
    google.accounts.id.initialize({
        client_id: config.public.googleClientId,
        context: 'signin',
        callback: onLoggedByGoogle,
        ux_mode: 'popup'
    })

    // @ts-ignore
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
    } catch (error) {
        console.log('Captcha error: ', error)
        messager.setMessage(t('error.captcha'))
        passkeyLoader.setLoaded()
        return
    }

    let initResponse: PasskeyInitResponseInterface

    try {
        initResponse = await passkeyInit(challenge)
    } catch (error) {
        passkeyLoader.setLoaded()
        messager.dispatchError(error)
        return
    }

    let authResponse: AuthenticationResponseJSON

    try {
        authResponse = await startAuthentication(initResponse)
    } catch (error) {
        passkeyLoader.setLoaded()
        messager.dispatchError(error)
        return
    }

    let loginResponse: LoginResponseInterface

    try {
        loginResponse = await passkeyLogin(initResponse.challenge, authResponse, challenge)
    } catch (error) {
        passkeyLoader.setLoaded()
        messager.dispatchError(error)
        return
    }

    try {
        const profileResponse = await profileGet()
        store.login(profileResponse.data)
    } catch (error) {
        passkeyLoader.setLoaded()
        messager.dispatchError(error)
        return
    }

    onSuccess(loginResponse)
}
</script>

<template>
    <UCard :ui="{body: {padding: 'px-6 py-6 sm:p-10'}}">
        <UForm ref="form" :state="request" @submit="onSubmit">
            <UFormGroup
                class="mb-6"
                size="xl"
                :label="$t('signIn.email')"
                name="email"
                :disabled="loader.isLoading() || passkeyLoader.isLoading()"
                :ui="{label:{wrapper: 'flex content-center items-center justify-between mb-4'}}"
                :error="messager.validationMessage('email')"
                @change="messager.resetValidationMessage('email')"
            >
                <UInput v-model="request.email" />
            </UFormGroup>

            <UFormGroup
                class="mb-6"
                size="xl"
                :label="$t('signIn.password')"
                name="password"
                :disabled="loader.isLoading() || passkeyLoader.isLoading()"
                :ui="{label:{wrapper: 'flex content-center items-center justify-between mb-4'}}"
                :error="messager.validationMessage('password')"
                @change="messager.resetValidationMessage('password')"
            >
                <UInput v-model="request.password" type="password" />
            </UFormGroup>

            <ULink :to="localePath('/password/forgot')" class="link block mb-6">
                {{ $t('signIn.forgotPassword') }}
            </ULink>

            <UAlert
                v-if="messager.hasMessage"
                class="mb-6"
                icon="i-heroicons-exclamation-triangle-16-solid"
                color="orange"
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

            <UDivider :label="$t('signIn.or')" class="mb-6" />

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

            <div id="login-google-button" class="mb-6" />

            <ULink :to="localePath('/register')" class="link">
                {{ $t('signIn.dontHaveAccount') }}
            </ULink>
        </UForm>
    </UCard>
</template>

<style scoped lang="scss">

</style>
