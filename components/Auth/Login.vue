<template>
    <b-form novalidate @submit="onSubmit">
        <b-card footer-tag="footer" header-tag="header">
            <template v-slot:header>Sign In</template>

            <b-form-group
                label-align-md="right"
                label-cols-md="4"
                label-for="email"
                :invalid-feedback="validationMessage('email')"
                :state="validationState('email')"
            >
                <template v-slot:label>Email</template>
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
                <template v-slot:label>Password</template>
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

            <b-form-group label-cols-md="4">
                <b-form-checkbox v-model="form.remember" :disabled="isLoading">
                    Remember Me
                </b-form-checkbox>
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

            <template v-slot:footer>
                <div class="form-row">
                    <b-col md="8" offset-md="4">
                        <b-button
                            :disabled="isLoading"
                            type="submit"
                            variant="primary"
                            @click="onSubmit"
                        >
                            Login
                            <b-spinner v-show="isLoading" small></b-spinner>
                        </b-button>
                        <b-button to="/password/forgot" variant="link">
                            Forgot Your Password?
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

@Component
export default class Login extends Mixins(Loader, Messager, Validator) {
    form: LoginRequestInterface = {
        email: '',
        password: '',
        remember: false,
    }

    protected onSubmit(event: Event) {
        event.preventDefault()
        event.stopPropagation()

        this.resetValidationMessages()
        this.resetMessage()
        this.setLoading()

        login(this.$axios, this.form)
            .then(this.onSuccess)
            .catch(this.dispatchError)
            .finally(this.setLoaded)
    }

    protected onSuccess(response: LoginResponseInterface) {
        console.log('redirecting...', response.redirectUrl)

        window.location.href = response.redirectUrl
    }
}
</script>
