<template>
    <div class="row">
        <div class="col-md-8 ml-md-auto mr-md-auto">
            <Register></Register>
        </div>
    </div>
</template>

<script lang="ts">
import { Mixins, Component } from 'vue-property-decorator'
import Register from '~/components/Auth/Register.vue'
import GuestOnly from '~/shared/GuestOnly'

@Component({
    components: { Register },
    head: {
        title: 'Register | Cash Track',
    },
    nuxtI18n: false,
})
export default class RegisterPage extends Mixins(GuestOnly) {}
</script>
