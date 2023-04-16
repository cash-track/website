<template>
    <div class="row">
        <div class="col-md-8 ml-md-auto mr-md-auto">
            <PasswordForgot></PasswordForgot>
        </div>
    </div>
</template>

<script lang="ts">
import { Mixins, Component } from 'vue-property-decorator'
import PasswordForgot from '~/components/Auth/PasswordForgot.vue'
import GuestOnly from '~/shared/GuestOnly'

@Component({
    components: { PasswordForgot },
    head: {
        title: 'Restore Password | Cash Track',
    },
    nuxtI18n: false,
})
export default class PasswordForgotPage extends Mixins(GuestOnly) {}
</script>
