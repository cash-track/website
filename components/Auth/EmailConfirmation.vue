<template>
    <div>
        <b-alert variant="primary" :show="isLoading">
            <b-spinner small></b-spinner>
            {{ $t('emailConfirmation.loading') }}
        </b-alert>
        <b-alert variant="success" :show="!isLoading && isSuccess">
            <b-icon-check2-circle></b-icon-check2-circle>
            <span v-if="isLogged">
                {{ $t('emailConfirmation.successLogged[0]') }}
                {{ $t('emailConfirmation.successLogged[1]') }}
                {{ $t('emailConfirmation.successLogged[2]') }}
                <a :href="profileLink">
                    {{ $t('emailConfirmation.successLogged[3]') }}
                </a>
                .
            </span>
            <span v-else>
                {{ $t('emailConfirmation.success[0]') }}
                {{ $t('emailConfirmation.success[1]') }}
                <nuxt-link to="/login">
                    {{ $t('emailConfirmation.success[2]') }}
                </nuxt-link>
                {{ $t('emailConfirmation.success[3]') }}
            </span>
        </b-alert>
        <b-alert variant="warning" :show="!isLoading && !isSuccess">
            {{ $t('emailConfirmation.codeInvalid[0]') }}
            {{ $t('emailConfirmation.codeInvalid[1]') }}
            {{ $t('emailConfirmation.codeInvalid[2]') }}
            <span v-if="!isLogged">
                {{ $t('emailConfirmation.codeInvalid[3]') }}
            </span>
            {{ $t('emailConfirmation.codeInvalid[4]') }}
        </b-alert>
    </div>
</template>

<script lang="ts">
import { Mixins, Component, Prop } from 'vue-property-decorator'
import Loader from '~/shared/Loader'
import Messager from '~/shared/Messager'
import WebAppLinks from '~/shared/WebAppLinks'
import { confirmEmail } from '~/api/email'

@Component
export default class EmailConfirmation extends Mixins(
    Loader,
    Messager,
    WebAppLinks
) {
    @Prop()
    token!: string

    isSuccess = false

    get isLogged(): boolean {
        return this.$store.state.auth.isLogged
    }

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

        if (!this.isLogged) {
            return
        }

        setTimeout(() => {
            window.location.href = this.profileLink
        }, 2000)
    }

    onFailure() {
        this.isSuccess = false
    }
}
</script>
