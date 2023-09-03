<template>
    <div>
        <b-navbar toggleable="lg" type="light">
            <b-container>
                <b-navbar-brand :to="{ name: 'index' }">
                    <logo></logo>
                </b-navbar-brand>

                <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

                <b-collapse id="nav-collapse" is-nav>
                    <b-navbar-nav>
                        <b-nav-item
                            v-if="isProfileLoading || isLogged"
                            :disabled="isProfileLoading"
                            :href="walletsLink"
                            >{{ $t('wallets') }}</b-nav-item
                        >
                        <b-nav-item
                            v-if="isProfileLoading || isLogged"
                            :disabled="isProfileLoading"
                            :href="profileLink"
                            >{{ $t('profile') }}</b-nav-item
                        >
                        <b-nav-item
                            :to="localePath({ name: 'help' })"
                            exact-active-class="active"
                            >{{ $t('help.help') }}</b-nav-item
                        >
                        <b-nav-item
                            :to="localePath({ name: 'about' })"
                            exact-active-class="active"
                            >{{ $t('about.about') }}</b-nav-item
                        >
                    </b-navbar-nav>

                    <b-navbar-nav class="ml-auto">
                        <b-nav-item-dropdown right>
                            <template v-slot:button-content>
                                <span class="current-locale">
                                    {{ $t('flag') }}
                                </span>
                            </template>
                            <b-dropdown-item
                                v-for="locale of locales"
                                :key="locale.code"
                                :active="currentLocale === locale.code"
                                @click="onLocaleChange(locale.code, $event)"
                            >
                                {{ locale.name }}
                            </b-dropdown-item>
                        </b-nav-item-dropdown>

                        <b-navbar-nav v-if="isProfileLoading || !isLogged">
                            <b-nav-item
                                :to="{ name: 'login' }"
                                :disabled="isProfileLoading"
                                exact-active-class="active"
                                >{{ $t('signIn.signIn') }}</b-nav-item
                            >
                            <b-nav-item
                                :to="{ name: 'register' }"
                                :disabled="isProfileLoading"
                                exact-active-class="active"
                                >{{ $t('register.signUp') }}</b-nav-item
                            >
                        </b-navbar-nav>
                        <b-nav-item-dropdown v-if="isLogged" right>
                            <template v-slot:button-content>
                                <profile-avatar
                                    :user="profile"
                                ></profile-avatar>
                                {{ profile.name }}
                            </template>
                            <b-dropdown-item :href="profileLink">
                                {{ $t('dashboard') }}
                            </b-dropdown-item>
                            <b-dropdown-item href="#" @click="onLogout">
                                {{ $t('signOut') }}
                            </b-dropdown-item>
                        </b-nav-item-dropdown>
                    </b-navbar-nav>
                </b-collapse>
            </b-container>
        </b-navbar>
    </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import {
    profileGet,
    profilePutLocale,
    ProfileInterface,
    ProfileResponseInterface,
} from '~/api/profile'
import { logout } from '~/api/login'
import ProfileAvatar from '~/components/ProfileAvatar.vue'
import Logo from '~/components/Logo.vue'
import WebAppLinks from '~/shared/WebAppLinks'

@Component({
    components: { ProfileAvatar, Logo },
})
export default class Header extends Mixins(WebAppLinks) {
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

    get locales() {
        return this.$i18n.locales
    }

    get currentLocale() {
        return this.$i18n.locale
    }

    onLocaleChange(locale: string, event: Event) {
        event.preventDefault()
        event.stopPropagation()

        this.$i18n.setLocale(locale)

        if (this.isLogged) {
            profilePutLocale(this.$axios, locale)
        }
    }
}
</script>

<style scoped lang="scss">
.navbar {
    background: #f5f5f5;
    border-bottom: 1px solid #e5e5e5;
    border-radius: 0;
    margin-bottom: 20px;

    .navbar-brand {
        padding-top: 0;
        padding-bottom: 0;
        height: 36px;
    }

    .b-avatar {
        margin: -13px 5px -10px 0;
    }

    .current-locale {
        color: rgba(0, 0, 0, 1);
        line-height: 1;
        font-size: 20px;
    }
}
</style>
