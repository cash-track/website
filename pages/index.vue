<template>
    <div class="landing-page">
        <b-jumbotron :header="$t('home.header')" :lead="$t('home.lead')">
            <p>{{ $t('home.banner') }}</p>
            <span v-if="isProfileLoading || !isLogged">
                <b-button
                    variant="primary"
                    :disabled="isProfileLoading"
                    :to="{ name: 'login' }"
                    >{{ $t('home.login') }}</b-button
                >
                {{ $t('home.or') }}
                <b-button
                    variant="primary"
                    :disabled="isProfileLoading"
                    :to="{ name: 'register' }"
                    >{{ $t('home.register') }}</b-button
                >
            </span>
            <span v-if="isLogged">
                <b-button variant="primary" :href="walletsLink">
                    {{ $t('home.wallets') }}
                </b-button>
            </span>
        </b-jumbotron>
        <b-row>
            <b-col md="4">
                <h2>{{ $t('home.easy') }}</h2>
                <p>{{ $t('home.easyDescription') }}</p>
            </b-col>
            <b-col md="4">
                <h2>{{ $t('home.fast') }}</h2>
                <p>{{ $t('home.fastDescription') }}</p>
            </b-col>
            <b-col md="4">
                <h2>{{ $t('home.secure') }}</h2>
                <p>{{ $t('home.secureDescription') }}</p>
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
    nuxtI18n: false,
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
