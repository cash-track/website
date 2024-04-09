<script setup lang="ts">
import type { Form, FormSubmitEvent } from '#ui/types'
import { FetchError } from 'ofetch'
import { useReCaptcha } from 'vue-recaptcha-v3'
import { watchDebounced } from '@vueuse/shared'
import { onMounted, useI18n, useLocalePath, useRuntimeConfig } from '#imports'
import { useLoader } from '@/shared/Loader'
import { type LoginResponseInterface } from '@/api/login'
import { checkNickName, register, type RegisterRequestInterface, type RegisterResponseInterface } from '@/api/register'
import { useValidationMessager } from '@/shared/ValidatorMessager'
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
const form = ref<Form<RegisterRequestInterface>>()
const confirmation = ref<boolean>(false)
const isNickNameValid = ref<boolean|null>(null)

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
    } catch (error) {
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
    } catch (error) {
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

    onSuccess(registerResponse)
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

function onSuccess(response: LoginResponseInterface|RegisterResponseInterface) {
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
</script>

<template>
    <UCard :ui="{body: {padding: 'px-6 py-6 sm:p-10'}}">
        <UForm ref="form" :state="request" @submit="onSubmit">
            <UFormGroup
                class="mb-6"
                size="xl"
                :label="$t('register.name')"
                name="name"
                :disabled="loader.isLoading()"
                :ui="{label:{wrapper: 'flex content-center items-center justify-between mb-4'}}"
                :error="messager.validationMessage('name')"
                @change="messager.resetValidationMessage('name')"
            >
                <UInput v-model="request.name" />
            </UFormGroup>

            <UFormGroup
                class="mb-6"
                size="xl"
                :label="$t('register.lastName')"
                name="lastName"
                :disabled="loader.isLoading()"
                :ui="{label:{wrapper: 'flex content-center items-center justify-between mb-4'}}"
                :error="messager.validationMessage('lastName')"
                :hint="$t('optional')"
                @change="messager.resetValidationMessage('lastName')"
            >
                <UInput v-model="request.lastName" />
            </UFormGroup>

            <UFormGroup
                class="mb-6"
                size="xl"
                :label="$t('register.nickName')"
                name="nickName"
                :disabled="loader.isLoading()"
                :ui="{label:{wrapper: 'flex content-center items-center justify-between mb-4'}}"
                :error="messager.validationMessage('nickName')"
                @change="isNickNameValid ? messager.resetValidationMessage('nickName') : null"
            >
                <UInput v-model="request.nickName" :trailing="isNickNameValid !== null">
                    <template #trailing>
                        <UIcon
                            v-show="isNickNameValid === true"
                            name="i-heroicons-check-circle-20-solid"
                            class="text-green-500 text-xl"
                        />
                        <UIcon
                            v-show="isNickNameValid === false"
                            name="i-heroicons-exclamation-triangle-20-solid"
                            class="text-red-500 text-xl"
                        />
                    </template>
                </UInput>
            </UFormGroup>

            <UFormGroup
                class="mb-6"
                size="xl"
                :label="$t('register.email')"
                name="email"
                :disabled="loader.isLoading()"
                :ui="{label:{wrapper: 'flex content-center items-center justify-between mb-4'}}"
                :error="messager.validationMessage('email')"
                @change="messager.resetValidationMessage('email')"
            >
                <UInput v-model="request.email" type="email" />
            </UFormGroup>

            <UFormGroup
                class="mb-6"
                size="xl"
                :label="$t('register.password')"
                name="password"
                :disabled="loader.isLoading()"
                :ui="{label:{wrapper: 'flex content-center items-center justify-between mb-4'}}"
                :error="messager.validationMessage('password')"
                @change="messager.resetValidationMessage('password')"
            >
                <UInput v-model="request.password" type="password" />
            </UFormGroup>

            <UFormGroup
                class="mb-6"
                size="xl"
                :label="$t('register.passwordConfirmation')"
                name="password-confirmation"
                :disabled="loader.isLoading()"
                :ui="{label:{wrapper: 'flex content-center items-center justify-between mb-4'}}"
                :error="messager.validationMessage('passwordConfirmation')"
                @change="messager.resetValidationMessage('passwordConfirmation')"
            >
                <UInput v-model="request.passwordConfirmation" type="password" />
            </UFormGroup>

            <UFormGroup class="mb-6">
                <label class="cursor-pointer">
                    <UCheckbox v-model="confirmation" class="inline-block align-text-top mr-1.5" />
                    {{ $t('register.confirmation[0]') }}
                    <ULink :to="localePath('/privacy-policy')" class="link">{{ $t('register.confirmation[1]') }}</ULink>
                </label>
            </UFormGroup>

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
                :disabled="loader.isLoading() || !confirmation"
            >
                {{ $t('register.register') }}
            </UButton>

            <UDivider :label="$t('register.or')" class="mb-6" />

            <div id="register-google-button" class="mb-6" />

            <ULink :to="localePath('/login')" class="link">
                {{ $t('register.alreadyHaveAccount') }}
            </ULink>
        </UForm>
    </UCard>
</template>

<style scoped lang="scss">

</style>
