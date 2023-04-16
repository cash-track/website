<template>
    <div class="privacy-policy">
        <h1 class="display-4">{{ $t('privacyPolicy.privacyPolicy') }}</h1>
        <hr />

        <p>
            <b>{{ $t('privacyPolicy.effectiveDate') }}</b>
            <br />
            <b>{{ $t('privacyPolicy.lastUpdated') }}</b>
        </p>

        <p>{{ $t('privacyPolicy.intro[0]') }}</p>

        <p>{{ $t('privacyPolicy.intro[1]') }}</p>

        <h3>{{ $t('privacyPolicy.infoWeCollect[0]') }}</h3>

        <p>{{ $t('privacyPolicy.infoWeCollect[1]') }}</p>
        <ol>
            <li>{{ $t('privacyPolicy.infoWeCollect[2]') }}</li>
            <li>{{ $t('privacyPolicy.infoWeCollect[3]') }}</li>
            <li>{{ $t('privacyPolicy.infoWeCollect[4]') }}</li>
            <li>{{ $t('privacyPolicy.infoWeCollect[5]') }}</li>
        </ol>

        <h3>{{ $t('privacyPolicy.howWeCollectInfo[0]') }}</h3>
        <p>{{ $t('privacyPolicy.howWeCollectInfo[1]') }}</p>
        <ol>
            <li>{{ $t('privacyPolicy.howWeCollectInfo[2]') }}</li>
            <li>{{ $t('privacyPolicy.howWeCollectInfo[3]') }}</li>
            <li>{{ $t('privacyPolicy.howWeCollectInfo[4]') }}</li>
        </ol>

        <h3>{{ $t('privacyPolicy.howWeUseInfo[0]') }}</h3>
        <p>{{ $t('privacyPolicy.howWeUseInfo[1]') }}</p>
        <ol>
            <li>{{ $t('privacyPolicy.howWeUseInfo[2]') }}</li>
            <li>{{ $t('privacyPolicy.howWeUseInfo[3]') }}</li>
            <li>{{ $t('privacyPolicy.howWeUseInfo[4]') }}</li>
        </ol>
        <p>{{ $t('privacyPolicy.howWeUseInfo[5]') }}</p>

        <h3>{{ $t('privacyPolicy.howWeShareInfo[0]') }}</h3>

        <p>{{ $t('privacyPolicy.howWeShareInfo[1]') }}</p>
        <ol>
            <li>{{ $t('privacyPolicy.howWeShareInfo[2]') }}</li>
        </ol>

        <p>{{ $t('privacyPolicy.howWeShareInfo[3]') }}</p>
        <p>{{ $t('privacyPolicy.howWeShareInfo[4]') }}</p>

        <h3>{{ $t('privacyPolicy.retentionInfo[0]') }}</h3>
        <p>{{ $t('privacyPolicy.retentionInfo[1]') }}</p>

        <h3>{{ $t('privacyPolicy.yourRights[0]') }}</h3>
        <p>{{ $t('privacyPolicy.yourRights[1]') }}</p>
        <p>{{ $t('privacyPolicy.yourRights[2]') }}</p>

        <h3>{{ $t('privacyPolicy.cookies[0]') }}</h3>
        <p>
            {{ $t('privacyPolicy.cookies[1]') }}
            <router-link to="cookie-policy">
                {{ $t('privacyPolicy.cookies[2]') }}
            </router-link>
            .
        </p>

        <h3>{{ $t('privacyPolicy.security[0]') }}</h3>
        <p>{{ $t('privacyPolicy.security[1]') }}</p>

        <h3>{{ $t('privacyPolicy.dataProtection[0]') }}</h3>
        <p>{{ $t('privacyPolicy.dataProtection[1]') }}</p>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
    head: {
        title: 'Privacy Policy | Cash Track',
    },
})
export default class PrivacyPolicyPage extends Vue {}
</script>
