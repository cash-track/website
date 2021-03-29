<template>
    <div>
        <b-navbar toggleable="lg" type="light">
            <b-container>
                <b-navbar-brand :to="{name: 'index'}">Cash Track</b-navbar-brand>

                <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

                <b-collapse id="nav-collapse" is-nav>
                    <b-navbar-nav>
                        <b-nav-item v-if="isProfileLoading || isLogged" :disabled="isProfileLoading" :href="walletsLink">Wallets</b-nav-item>
                        <b-nav-item v-if="isProfileLoading || isLogged" :disabled="isProfileLoading" :href="profileLink">Profile</b-nav-item>
                        <b-nav-item :to="{name: 'help'}" exact-active-class="active">Help</b-nav-item>
                        <b-nav-item :to="{name: 'about'}" exact-active-class="active">About</b-nav-item>
                    </b-navbar-nav>

                    <b-navbar-nav class="ml-auto">
                        <b-navbar-nav v-if="isProfileLoading || !isLogged">
                            <b-nav-item :to="{name: 'login'}" :disabled="isProfileLoading" exact-active-class="active">Sign In</b-nav-item>
                            <b-nav-item :to="{name: 'register'}" :disabled="isProfileLoading" exact-active-class="active">Sign Up</b-nav-item>
                        </b-navbar-nav>
                        <b-nav-item-dropdown v-if="isLogged" right>
                            <template v-slot:button-content>
                                {{ profile.name }}
                            </template>
                            <b-dropdown-item :href="profileLink">Dashboard</b-dropdown-item>
                            <b-dropdown-item href="#" @click="onLogout">Sign Out</b-dropdown-item>
                        </b-nav-item-dropdown>
                    </b-navbar-nav>
                </b-collapse>
            </b-container>
        </b-navbar>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import {
    profileGet,
    ProfileInterface,
    ProfileResponseInterface,
} from '~/api/profile'
import { logout } from '~/api/login'

@Component
export default class Header extends Vue {
    mounted() {
        this.loadProfile()
    }

    loadProfile() {
        profileGet(this.$axios)
            .then(this.onProfileSuccess)
            .catch(this.onProfileError)
    }

    onProfileSuccess(res: ProfileResponseInterface) {
        this.$store.commit('auth/login', res.data)
    }

    onProfileError() {
        this.$store.commit('auth/logout')
    }

    onLogout() {
        logout(this.$axios).finally(() => {
            this.$store.commit('auth/logout')
            this.$router.push('/')
        })
    }

    get isLogged(): boolean {
        return this.$store.state.auth.isLogged
    }

    get isProfileLoading(): boolean {
        return this.$store.state.auth.isProfileLoading
    }

    get profile(): ProfileInterface | null {
        return this.$store.state.auth.profile
    }

    get walletsLink() {
        return `${this.$config.webAppUrl}/wallets`
    }

    get profileLink() {
        return `${this.$config.webAppUrl}/profile`
    }
}
</script>

<style scoped lang="scss">
.navbar {
    background: #f5f5f5;
    border-bottom: 1px solid #e5e5e5;
    border-radius: 0;
    margin-bottom: 20px;
}
</style>
