<template>
    <div class="row">
        <div class="col-md-8 ml-md-auto mr-md-auto">
            <PasswordForgot></PasswordForgot>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import PasswordForgot from '~/components/Auth/PasswordForgot.vue'

@Component({
    components: { PasswordForgot },
    head: {
        title: 'Restore Password | Cash Track',
    },
})
export default class PasswordForgotPage extends Vue {}
</script>
