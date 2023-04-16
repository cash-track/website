<template>
    <div class="about">
        <h1 class="display-4">{{ $t('about.title') }}</h1>
        <hr />
        <blockquote class="blockquote">
            <p class="mb-0">{{ $t('about.quote') }}</p>
            <footer class="blockquote-footer">
                <cite title="Source Title">{{ $t('about.quoteAuthor') }}</cite>
            </footer>
        </blockquote>

        <p>{{ $t('about.lines[0]') }}</p>
        <p>{{ $t('about.lines[1]') }}</p>
        <p>{{ $t('about.lines[2]') }}</p>

        <ul>
            <li>{{ $t('about.features[0]') }}</li>
            <li>{{ $t('about.features[1]') }}</li>
            <li>{{ $t('about.features[2]') }}</li>
            <li>{{ $t('about.features[3]') }}</li>
        </ul>

        <p class="lead">{{ $t('about.connect') }}</p>
        <p>
            <b-button variant="primary" to="register">
                {{ $t('about.register') }}
            </b-button>
            {{ $t('about.or') }}
            <b-button variant="primary" to="login">
                {{ $t('about.login') }}
            </b-button>
        </p>

        <p>{{ $t('about.moreLines[0]') }}</p>

        <p>
            {{ $t('about.moreLines[1]') }}
            {{ $t('about.moreLines[2]') }}
            <a
                href="https://github.com/cash-track/website/issues/new"
                target="_blank"
                >{{ $t('about.moreLines[3]') }}
            </a>
            {{ $t('about.moreLines[4]') }}
        </p>
        <p>{{ $t('about.moreLines[5]') }}</p>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
    head: {
        title: 'About | Cash Track',
    },
})
export default class AboutPage extends Vue {}
</script>
