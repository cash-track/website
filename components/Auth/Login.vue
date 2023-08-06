<template>
    <b-form novalidate @submit="onSubmit">
        <b-card footer-tag="footer" header-tag="header">
            <template v-slot:header>{{ $t('signIn.signIn') }}</template>

            <b-form-group
                label-align-md="right"
                label-cols-md="4"
                label-for="email"
                :invalid-feedback="validationMessage('email')"
                :state="validationState('email')"
            >
                <template v-slot:label>{{ $t('signIn.email') }}</template>
                <b-form-input
                    id="email"
                    v-model="form.email"
                    class="col-md-8"
                    required
                    type="email"
                    :disabled="isLoading"
                    :state="validationState('email')"
                    @change="resetValidationMessage('email')"
                ></b-form-input>
            </b-form-group>

            <b-form-group
                label-align-md="right"
                label-cols-md="4"
                label-for="password"
                :invalid-feedback="validationMessage('password')"
                :state="validationState('password')"
            >
                <template v-slot:label>{{ $t('signIn.password') }}</template>
                <b-form-input
                    id="password"
                    v-model="form.password"
                    class="col-md-8"
                    required
                    type="password"
                    :disabled="isLoading"
                    :state="validationState('password')"
                    @change="resetValidationMessage('password')"
                ></b-form-input>
            </b-form-group>

            <b-alert
                variant="warning"
                fade
                dismissible
                :show="hasMessage"
                @dismissed="resetMessage()"
            >
                <b-icon-exclamation-triangle-fill></b-icon-exclamation-triangle-fill>
                {{ message }}
            </b-alert>

            <b-form-group label-align-md="right" label-cols-md="4">
                <b-button to="/register" variant="link">
                    {{ $t('signIn.dontHaveAccount') }}
                </b-button>
            </b-form-group>

            <b-form-group
                label-align-md="right"
                label-cols-md="4"
                content-cols-md="5"
            >
                <div id="login-google-button"></div>
            </b-form-group>

            <template v-slot:footer>
                <div class="form-row">
                    <b-col md="8" offset-md="4">
                        <b-button
                            :disabled="isLoading"
                            type="submit"
                            variant="primary"
                            @click="onSubmit"
                        >
                            {{ $t('signIn.login') }}
                            <b-spinner v-show="isLoading" small></b-spinner>
                        </b-button>
                        <b-button to="/password/forgot" variant="link">
                            {{ $t('signIn.forgotPassword') }}
                        </b-button>
                    </b-col>
                </div>
            </template>
        </b-card>
    </b-form>
</template>

<script lang="ts">
import { Mixins, Component } from 'vue-property-decorator'
import Loader from '~/shared/Loader'
import Messager from '~/shared/Messager'
import Validator from '~/shared/Validator'
import {
    login,
    LoginRequestInterface,
    LoginResponseInterface,
} from '~/api/login'
import { googleAuthProvider } from '~/api/authProvider'
import { profileGet } from '~/api/profile'

@Component
export default class Login extends Mixins(Loader, Messager, Validator) {
    form: LoginRequestInterface = {
        email: '',
        password: '',
        remember: false,
    }

    async mounted() {
        try {
            await this.$recaptcha.init()
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Captcha init error: ', error)
        }

        this.initGoogleButton()
    }

    protected initGoogleButton() {
        const btn = document.getElementById('login-google-button')

        if (!btn) {
            return
        }

        // eslint-disable-next-line no-undef
        google.accounts.id.initialize({
            client_id: this.$config.googleAuth.clientId,
            context: 'signin',
            callback: this.onLoggedByGoogle,
            ux_mode: 'popup',
        })

        // eslint-disable-next-line no-undef
        google.accounts.id.renderButton(btn, {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: 'signin_with',
        })
    }

    beforeDestroy() {
        this.$recaptcha.destroy()
    }

    protected async onLoggedByGoogle(response: any) {
        this.resetValidationMessages()
        this.resetMessage()
        this.setLoading()

        if (!response.credential) {
            // eslint-disable-next-line no-console
            console.log('Google auth error: ', response)
            this.setMessage(
                'Unable to login by Google. Please try again later or refresh page.'
            )
            this.setLoaded()
            return
        }

        let challenge = ''

        try {
            challenge = await this.$recaptcha.execute('login')
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log('Captcha execute error: ', error)
            this.setLoaded()
            return
        }

        let loginResponse: LoginResponseInterface

        try {
            loginResponse = await googleAuthProvider(
                this.$axios,
                {
                    token: response.credential,
                },
                challenge
            )
        } catch (error) {
            this.dispatchError(error)
            this.setLoaded()
            return
        }

        try {
            const profileResponse = await profileGet(this.$axios)
            this.$store.commit('auth/login', profileResponse.data)
        } catch (error) {
            this.dispatchError(error)
            this.setLoaded()
            // return
        }

        this.onSuccess(loginResponse)
    }

    protected async onSubmit(event: Event) {
        event.preventDefault()
        event.stopPropagation()

        this.resetValidationMessages()
        this.resetMessage()
        this.setLoading()

        let challenge = ''

        try {
            challenge = await this.$recaptcha.execute('login')
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log('Captcha execute error: ', error)
            this.setLoaded()
            return
        }

        let loginResponse: LoginResponseInterface

        try {
            loginResponse = await login(this.$axios, this.form, challenge)
        } catch (error) {
            this.dispatchError(error)
            this.setLoaded()
            return
        }

        try {
            const profileResponse = await profileGet(this.$axios)
            this.$store.commit('auth/login', profileResponse.data)
        } catch (error) {
            this.dispatchError(error)
            this.setLoaded()
            return
        }

        this.onSuccess(loginResponse)
    }

    protected onSuccess(response: LoginResponseInterface) {
        window.location.href = response.redirectUrl
    }
}
</script>
