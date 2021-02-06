<template>
    <div class="help">
        <h1 class="display-4">Help</h1>
        <hr />

        ...
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
