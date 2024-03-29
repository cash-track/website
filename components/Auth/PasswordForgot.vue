<template>
    <b-form novalidate @submit="onSubmit">
        <b-card footer-tag="footer" header-tag="header">
            <template v-slot:header>{{ $t('passwordForgot.title') }}</template>

            <b-form-group
                v-show="!isSuccess"
                label-align-md="right"
                label-cols-md="4"
                label-for="email"
                :invalid-feedback="validationMessage('email')"
                :state="validationState('email')"
            >
                <template v-slot:label>
                    {{ $t('passwordForgot.email') }}
                </template>
                <b-form-input
                    id="email"
                    v-model="email"
                    class="col-md-8"
                    required
                    type="email"
                    :disabled="isLoading"
                    :state="validationState('email')"
                    @change="resetValidationMessage('email')"
                ></b-form-input>
            </b-form-group>

            <b-alert
                variant="warning"
                fade
                dismissible
                :show="hasMessage && !isSuccess"
                @dismissed="resetMessage()"
            >
                <b-icon-exclamation-triangle-fill></b-icon-exclamation-triangle-fill>
                {{ message }}
            </b-alert>

            <b-alert variant="success" fade :show="isSuccess">
                <b-icon-check2-circle></b-icon-check2-circle>
                {{ $t('passwordForgot.success[0]') }}<br />
                {{ $t('passwordForgot.success[1]') }}<br />
                {{ $t('passwordForgot.success[2]') }}<br />
                {{ $t('passwordForgot.success[3]') }}
            </b-alert>

            <template v-if="!isSuccess" v-slot:footer>
                <div class="form-row">
                    <b-col md="8" offset-md="4">
                        <b-button
                            :disabled="isLoading"
                            type="submit"
                            variant="primary"
                            @click="onSubmit"
                        >
                            {{ $t('passwordForgot.reset') }}
                            <b-spinner v-show="isLoading" small></b-spinner>
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
import { forgotPassword } from '~/api/password'

@Component
export default class PasswordForgot extends Mixins(
    Loader,
    Messager,
    Validator
) {
    email: string = ''

    isSuccess: boolean = false

    async mounted() {
        try {
            await this.$recaptcha.init()
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Captcha init error: ', error)
        }
    }

    beforeDestroy() {
        this.$recaptcha.destroy()
    }

    async onSubmit() {
        this.resetMessage()
        this.resetValidationMessages()
        this.setLoading()

        let challenge = ''

        try {
            challenge = await this.$recaptcha.execute('login')
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log('Captcha execute error: ', error)
        }

        forgotPassword(this.$axios, this.email, challenge)
            .then(this.onSuccess)
            .catch(this.dispatchError)
            .finally(this.setLoaded)
    }

    onSuccess() {
        this.isSuccess = true
    }
}
</script>
