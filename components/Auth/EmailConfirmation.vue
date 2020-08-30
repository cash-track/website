<template>
    <div>
        <b-alert variant="primary" :show="isLoading">
            <b-spinner small></b-spinner>
            Confirming your email. Just a few moments..
        </b-alert>
        <b-alert variant="success" :show="!isLoading && isSuccess">
            <b-icon-check2-circle></b-icon-check2-circle>
            Your email has been confirmed. Now you can
            <nuxt-link to="/login">log in</nuxt-link> to your account.
        </b-alert>
        <b-alert variant="warning" :show="!isLoading && !isSuccess">
            Your email is not confirmed. Confirmation link may be expired.
            Please login to your account and request another confirmation
            message.
        </b-alert>
    </div>
</template>

<script lang="ts">
import { Mixins, Component, Prop } from 'vue-property-decorator'
import Loader from '~/shared/Loader'
import Messager from '~/shared/Messager'
import { confirmEmail } from '~/api/email'

@Component
export default class EmailConfirmation extends Mixins(Loader, Messager) {
    @Prop()
    token!: string

    isSuccess = false

    mounted() {
        this.confirmEmail()
    }

    confirmEmail() {
        this.setLoading()
        this.resetMessage()

        confirmEmail(this.$axios, this.token)
            .then(this.onConfirmed)
            .catch(this.onFailure)
            .finally(this.setLoaded)
    }

    onConfirmed() {
        this.isSuccess = true
    }

    onFailure() {
        this.isSuccess = false
    }
}
</script>
