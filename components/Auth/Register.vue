<template>
    <b-form novalidate @submit="onSubmit">
        <b-card footer-tag="footer" header-tag="header">
            <template v-slot:header>Sign Up</template>

            <b-form-group
                label-cols-md="4"
                label-align-md="right"
                label-for="name"
                :invalid-feedback="validationMessage('name')"
                :state="validationState('name')"
            >
                <template v-slot:label>
                    Name <span class="text-danger">*</span>
                </template>

                <b-form-input
                    id="name"
                    v-model="form.name"
                    class="col-md-8"
                    required
                    :state="validationState('name')"
                    :disabled="isLoading"
                    @input="resetValidationMessage('name')"
                ></b-form-input>
            </b-form-group>

            <b-form-group
                label-cols-md="4"
                label-align-md="right"
                label-for="last-name"
                :invalid-feedback="validationMessage('lastName')"
                :state="validationState('lastName')"
            >
                <template v-slot:label>Last Name</template>
                <b-form-input
                    id="last-name"
                    v-model="form.lastName"
                    class="col-md-8"
                    :state="validationState('lastName')"
                    :disabled="isLoading"
                    @input="resetValidationMessage('lastName')"
                ></b-form-input>
            </b-form-group>

            <b-form-group
                label-cols-md="4"
                label-align-md="right"
                label-for="nick-name"
                :invalid-feedback="validationMessage('nickName')"
                :state="nickNameValidationState"
            >
                <template v-slot:label>
                    Nick Name <span class="text-danger">*</span>
                </template>
                <b-form-input
                    id="nick-name"
                    v-model="form.nickName"
                    class="col-md-8"
                    required
                    debounce="1000"
                    :state="nickNameValidationState"
                    :disabled="isLoading"
                    @input="resetValidationMessage('nickName')"
                ></b-form-input>
            </b-form-group>

            <b-form-group
                label-align-md="right"
                label-cols-md="4"
                label-for="email"
                :invalid-feedback="validationMessage('email')"
                :state="validationState('email')"
            >
                <template v-slot:label>
                    Email <span class="text-danger">*</span>
                </template>
                <b-form-input
                    id="email"
                    v-model="form.email"
                    class="col-md-8"
                    required
                    type="email"
                    :disabled="isLoading"
                    :state="validationState('email')"
                    @input="resetValidationMessage('email')"
                ></b-form-input>
            </b-form-group>

            <b-form-group
                label-align-md="right"
                label-cols-md="4"
                label-for="password"
                :invalid-feedback="validationMessage('password')"
                :state="validationState('password')"
            >
                <template v-slot:label>
                    Password <span class="text-danger">*</span>
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
                            Register
                            <b-spinner v-show="isLoading" small></b-spinner>
                        </b-button>
                    </b-col>
                </div>
            </template>
        </b-card>
    </b-form>
</template>

<script lang="ts">
import { Mixins, Component, Watch } from 'vue-property-decorator'
import Loader from '~/shared/Loader'
import Messager from '~/shared/Messager'
import Validator from '~/shared/Validator'
import {
    checkNickName,
    register,
    RegisterRequestInterface,
    RegisterResponseInterface,
} from '~/api/register'

@Component
export default class Register extends Mixins(Loader, Messager, Validator) {
    form: RegisterRequestInterface = {
        name: '',
        lastName: '',
        nickName: '',
        email: '',
        password: '',
        passwordConfirmation: '',
    }

    isNickNameValid: boolean | null = null

    @Watch('form.nickName')
    onNickNameChanged() {
        this.isNickNameValid = null
        this.validateNickName()
    }

    get nickNameValidationState(): boolean | null {
        if (this.isNickNameValid !== null) {
            return this.isNickNameValid
        }

        return this.validationState('nickName')
    }

    protected validateNickName() {
        checkNickName(this.$axios, this.form.nickName)
            .then(() => {
                this.isNickNameValid = true
            })
            .catch((error: any) => {
                this.isNickNameValid = false

                if (
                    error.response &&
                    error.response.status === 422 &&
                    error.response.data?.errors?.nickName
                ) {
                    this.setValidationMessages({
                        nickName: error.response.data?.errors?.nickName,
                    })
                }
            })
    }

    protected onSubmit(event: Event) {
        event.preventDefault()
        event.stopPropagation()

        this.resetValidationMessages()
        this.resetMessage()
        this.setLoading()

        register(this.$axios, this.form)
            .then(this.onSuccess)
            .catch(this.dispatchError)
            .finally(this.setLoaded)
    }

    protected onSuccess(response: RegisterResponseInterface) {
        console.log('redirecting...', response.redirectUrl)

        window.location.href = response.redirectUrl
    }
}
</script>
