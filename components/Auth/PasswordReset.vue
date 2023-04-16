<template>
    <b-form novalidate @submit="onSubmit">
        <b-card footer-tag="footer" header-tag="header">
            <template v-slot:header>
                {{ $t('passwordReset.title') }}
            </template>

            <b-form-group
                v-if="!isCodeInvalid && !isSuccess"
                label-align-md="right"
                label-cols-md="4"
                label-for="password"
                :invalid-feedback="validationMessage('password')"
                :state="validationState('password')"
            >
                <template v-slot:label>
                    {{ $t('passwordReset.newPassword') }}
                    <span class="text-danger">*</span>
                </template>
                <b-form-input
                    id="password"
                    v-model="form.password"
                    class="col-md-8"
                    required
                    type="password"
                    :disabled="isLoading"
                    :state="validationState('password')"
                    @input="resetValidationMessage('password')"
                ></b-form-input>
            </b-form-group>

            <b-form-group
                v-if="!isCodeInvalid && !isSuccess"
                label-cols-md="4"
                label-align-md="right"
                label-for="password-confirmation"
                :invalid-feedback="validationMessage('passwordConfirmation')"
                :state="validationState('passwordConfirmation')"
            >
                <template v-slot:label>
                    {{ $t('passwordReset.newPasswordConfirmation') }}
                    <span class="text-danger">*</span>
                </template>
                <b-form-input
                    id="password-confirmation"
                    v-model="form.passwordConfirmation"
                    class="col-md-8"
                    type="password"
                    required
                    :state="validationState('passwordConfirmation')"
                    :disabled="isLoading"
                    @input="resetValidationMessage('passwordConfirmation')"
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
                {{ $t('passwordReset.success[0]') }}
                {{ $t('passwordReset.success[1]') }}
                <nuxt-link to="/login">
                    {{ $t('passwordReset.success[2]') }}
                </nuxt-link>
                {{ $t('passwordReset.success[3]') }}
            </b-alert>

            <b-alert variant="warning" fade :show="isCodeInvalid">
                <b-icon-exclamation-triangle-fill></b-icon-exclamation-triangle-fill>
                {{ $t('passwordReset.codeInvalid[0]') }}
                {{ $t('passwordReset.codeInvalid[1]') }}
                <nuxt-link to="/password/forgot">
                    {{ $t('passwordReset.codeInvalid[2]') }}
                </nuxt-link>
                {{ $t('passwordReset.codeInvalid[3]') }}
            </b-alert>

            <template v-if="!isSuccess && !isCodeInvalid" v-slot:footer>
                <div class="form-row">
                    <b-col md="8" offset-md="4">
                        <b-button
                            :disabled="isLoading"
                            type="submit"
                            variant="primary"
                            @click="onSubmit"
                        >
                            {{ $t('passwordReset.reset') }}
                            <b-spinner v-show="isLoading" small></b-spinner>
                        </b-button>
                    </b-col>
                </div>
            </template>
        </b-card>
    </b-form>
</template>

<script lang="ts">
import { Mixins, Component, Prop } from 'vue-property-decorator'
import Loader from '~/shared/Loader'
import Messager from '~/shared/Messager'
import Validator from '~/shared/Validator'
import { resetPassword, ResetPasswordRequestInterface } from '~/api/password'
import { ValidationResponseInterface } from '~/api/response'

@Component
export default class PasswordReset extends Mixins(Loader, Messager, Validator) {
    @Prop()
    resetCode!: string

    form: ResetPasswordRequestInterface = {
        code: '',
        password: '',
        passwordConfirmation: '',
    }

    isSuccess: boolean = false

    isCodeInvalid: boolean = false

    async mounted() {
        this.form.code = this.resetCode

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

        resetPassword(this.$axios, this.form, challenge)
            .then(this.onSuccess)
            .catch(this.dispatchError)
            .finally(this.setLoaded)
    }

    onSuccess() {
        this.isSuccess = true
    }

    protected onUnprocessableEntityResponse(
        response: ValidationResponseInterface
    ) {
        this.setValidationMessages(response.errors)

        if (this.hasValidationMessage('code')) {
            this.isCodeInvalid = true
        }
    }
}
</script>
