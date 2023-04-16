<template>
    <div class="cookie-policy">
        <h1 class="display-4">{{ $t('cookiePolicy.cookiePolicy') }}</h1>
        <hr />

        <p>
            <b>{{ $t('cookiePolicy.effectiveDate') }}</b>
            <br />
            <b>{{ $t('cookiePolicy.lastUpdated') }}</b>
        </p>

        <h3>{{ $t('cookiePolicy.whatAreCookies[0]') }}</h3>
        <div>
            <p>{{ $t('cookiePolicy.whatAreCookies[1]') }}</p>
            <p>{{ $t('cookiePolicy.whatAreCookies[2]') }}</p>
        </div>

        <h3>{{ $t('cookiePolicy.howDoWeUseCookies[0]') }}</h3>
        <div>
            <p>{{ $t('cookiePolicy.howDoWeUseCookies[1]') }}</p>
            <p>{{ $t('cookiePolicy.howDoWeUseCookies[2]') }}</p>
        </div>

        <h3>{{ $t('cookiePolicy.typesOfCookiesWeUse') }}</h3>

        <div class="cky-audit-table-element"></div>

        <h3 class="mb-2">
            {{ $t('cookiePolicy.manageCookiesPreferences[0]') }}
        </h3>

        <a class="cky-banner-element btn btn-primary">
            {{ $t('cookiePolicy.cookieSettings') }}
        </a>
        <br />

        <div>
            <p>{{ $t('cookiePolicy.manageCookiesPreferences[1]') }}</p>
            <p>{{ $t('cookiePolicy.manageCookiesPreferences[2]') }}</p>
            <ul>
                <li>
                    Chrome:
                    <a
                        href="https://support.google.com/accounts/answer/32050"
                        target="_blank"
                    >
                        https://support.google.com/accounts/answer/32050
                    </a>
                </li>
                <li>
                    Safari:
                    <a
                        href="https://support.apple.com/en-in/guide/safari/sfri11471/mac"
                        target="_blank"
                    >
                        https://support.apple.com/en-in/guide/safari/sfri11471/mac
                    </a>
                </li>
                <li>
                    Firefox:
                    <a
                        href="https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox?redirectslug=delete-cookies-remove-info-websites-stored&redirectlocale=en-US"
                        target="_blank"
                    >
                        https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox?redirectslug=delete-cookies-remove-info-websites-stored&redirectlocale=en-US
                    </a>
                </li>
                <li>
                    Internet Explorer:
                    <a
                        href="https://support.microsoft.com/en-us/topic/how-to-delete-cookie-files-in-internet-explorer-bca9446f-d873-78de-77ba-d42645fa52fc"
                        target="_blank"
                    >
                        https://support.microsoft.com/en-us/topic/how-to-delete-cookie-files-in-internet-explorer-bca9446f-d873-78de-77ba-d42645fa52fc
                    </a>
                </li>
            </ul>
            <p>{{ $t('cookiePolicy.manageCookiesPreferences[3]') }}</p>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
    head: {
        title: 'Cookie Policy | Cash Track',
    },
})
export default class CookiePolicyPage extends Vue {}
</script>
