<template>
    <div class="help">
        <h1 class="display-4">{{ $t('help.help') }}</h1>
        <hr />

        <p>{{ $t('help.notice') }}</p>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
    head: {
        title: 'Help | Cash Track',
    },
})
export default class HelpPage extends Vue {}
</script>
