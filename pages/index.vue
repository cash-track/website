<template>
    <div class="landing-page">
        <b-jumbotron
            header="Monitor your money"
            lead="Tracking your money income and expense is important to know where to optimise your life quality"
        >
            <p>Use Cash Track for free. No fees and pricing plan</p>
            <span v-if="isProfileLoading || !isLogged">
                <b-button variant="primary" :disabled="isProfileLoading" :to="{name: 'login'}">Login</b-button>
                or
                <b-button variant="primary" :disabled="isProfileLoading" :to="{name: 'register'}">Register</b-button>
            </span>
            <span v-if="isLogged">
                <b-button variant="primary" :href="walletsLink">Wallet</b-button>
            </span>
        </b-jumbotron>
        <b-row>
            <b-col md="4">
                <h2>Easy</h2>
                <p>Our service is easy to go. Just log in or register to start track anything you need</p>
            </b-col>
            <b-col md="4">
                <h2>Fast</h2>
                <p>Try for yourself. It's quite fast. Let us know if it is not ;)</p>
            </b-col>
            <b-col md="4">
                <h2>Secure</h2>
                <p>We're keeping your data protected from others. Be sure you can manage who can see it.</p>
            </b-col>
        </b-row>
    </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import WebAppLinks from '~/shared/WebAppLinks'

@Component({
    head: {
        title: 'Cash Track',
    },
})
export default class IndexPage extends Mixins(WebAppLinks) {
    get isLogged(): boolean {
        return this.$store.state.auth.isLogged
    }

    get isProfileLoading(): boolean {
        return this.$store.state.auth.isProfileLoading
    }
}
</script>
