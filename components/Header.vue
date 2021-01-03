<template>
    <div>
        <b-navbar toggleable="lg" type="light">
            <b-container>
                <b-navbar-brand :to="{name: 'index'}">Cash Track</b-navbar-brand>

                <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

                <b-collapse id="nav-collapse" is-nav>
                    <b-navbar-nav>
                        <b-nav-item v-if="isLogged" :href="walletsLink">Wallets</b-nav-item>
                        <b-nav-item v-if="isLogged" :href="profileLink">Profile</b-nav-item>
                        <b-nav-item :to="{name: 'help'}" exact-active-class="active">Help</b-nav-item>
                        <b-nav-item :to="{name: 'about'}" exact-active-class="active">About</b-nav-item>
                    </b-navbar-nav>

                    <b-navbar-nav class="ml-auto">
                        <b-navbar-nav v-if="!isLogged">
                            <b-nav-item :to="{name: 'login'}" exact-active-class="active">Sign In</b-nav-item>
                            <b-nav-item :to="{name: 'register'}" exact-active-class="active">Sign Up</b-nav-item>
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
    isLogged: boolean = false
    profile: ProfileInterface | null = null

    mounted() {
        // TODO. Load profile only if logged
        this.loadProfile()
    }

    loadProfile() {
        // TODO. Use vuex actions to fetch and store auth state on frontend
        profileGet(this.$axios)
            .then(this.onProfileSuccess)
            .catch(this.onProfileError)
    }

    onProfileSuccess(res: ProfileResponseInterface) {
        this.profile = res.data
        this.isLogged = true
    }

    onProfileError() {
        this.isLogged = false
    }

    onLogout() {
        // TODO. Use vuex actions to update auth state on frontend
        logout(this.$axios).finally(() => {
            this.isLogged = false
            this.profile = null
            this.$router.push('/')
        })
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
