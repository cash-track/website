<template>
    <div class="row">
        <div class="col-md-8 ml-md-auto mr-md-auto">
            <PasswordReset :reset-code="$route.params.code"></PasswordReset>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import PasswordReset from '~/components/Auth/PasswordReset.vue'

@Component({
    components: { PasswordReset },
})
export default class PasswordResetPage extends Vue {}
</script>
