<template>
    <b-form novalidate @submit="onSubmit">
        <b-card footer-tag="footer" header-tag="header">
            <template v-slot:header>Reset Password</template>

            <b-form-group
                v-if="!isCodeInvalid && !isSuccess"
                label-align-md="right"
                label-cols-md="4"
                label-for="password"
                :invalid-feedback="validationMessage('password')"
                :state="validationState('password')"
            >
                <template v-slot:label>
                    New Password <span class="text-danger">*</span>
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
                    Confirm Password <span class="text-danger">*</span>
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
                Your password has been changed. Now you can
                <nuxt-link to="/login">login</nuxt-link> using new credentials.
            </b-alert>

            <b-alert variant="warning" fade :show="isCodeInvalid">
                <b-icon-exclamation-triangle-fill></b-icon-exclamation-triangle-fill>
                Your reset password link is not valid or expired. Please
                <nuxt-link to="/password/forgot">request</nuxt-link>
                another password reset link.
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
                            Reset
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

    mounted() {
        this.form.code = this.resetCode
    }

    onSubmit() {
        this.resetMessage()
        this.resetValidationMessages()
        this.setLoading()

        resetPassword(this.$axios, this.form)
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
