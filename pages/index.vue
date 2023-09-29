<template>
    <div class="landing-page">
        <b-jumbotron
            class="welcome"
            :header="$t('home.header')"
            :lead="$t('home.lead')"
        >
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
                <h3>🤌 {{ $t('home.easy') }}</h3>
                <p>{{ $t('home.easyDescription') }}</p>
            </b-col>
            <b-col md="4">
                <h3>💫 {{ $t('home.fast') }}</h3>
                <p>{{ $t('home.fastDescription') }}</p>
            </b-col>
            <b-col md="4">
                <h3>☔️ {{ $t('home.secure') }}</h3>
                <p>{{ $t('home.secureDescription') }}</p>
            </b-col>
        </b-row>
        <b-jumbotron
            class="telegram"
            header-level="4"
            :header="$t('home.telegram.header')"
            :lead="$t('home.telegram.lead')"
        >
            <span>
                <b-button
                    href="https://t.me/cash_track"
                    target="_blank"
                    variant="outline-primary"
                >
                    {{ $t('home.telegram.subscribe') }} <tg-icon></tg-icon>
                </b-button>
            </span>
        </b-jumbotron>
    </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import TgIcon from '@/components/Shared/TgIcon.vue'
import WebAppLinks from '~/shared/WebAppLinks'

@Component({
    head: {
        title: 'Cash Track',
    },
    nuxtI18n: false,
    components: { TgIcon },
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

<style scoped lang="scss">
@import 'node_modules/bootstrap/scss/functions';
@import 'node_modules/bootstrap/scss/variables';
@import 'node_modules/bootstrap/scss/mixins/_breakpoints';

.telegram {
    background-image: url('/img/tg-logo.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: calc(100% + 120px) 40px;
    background-color: #f5fff5;
}

.welcome {
    background: linear-gradient(
        -45deg,
        #ee7752,
        #e73c7e,
        #23a6d5,
        #23d5ab,
        #5ccb80
    );
    background-size: 400% 400%;
    animation: gradient 60s ease infinite;
    color: #f5fff5;
}

@keyframes gradient {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}

@include media-breakpoint-down(sm) {
    .welcome .display-3 {
        font-size: 3rem;
    }
}
</style>
