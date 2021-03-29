<template>
    <div class="row">
        <div class="col-md-8 ml-md-auto mr-md-auto">
            <PasswordReset :reset-code="$route.params.code"></PasswordReset>
        </div>
    </div>
</template>

<script lang="ts">
import { Mixins, Component } from 'vue-property-decorator'
import PasswordReset from '~/components/Auth/PasswordReset.vue'
import GuestOnly from '~/shared/GuestOnly'

@Component({
    components: { PasswordReset },
    head: {
        title: 'Reset Password | Cash Track',
    },
})
export default class PasswordResetPage extends Mixins(GuestOnly) {}
</script>
