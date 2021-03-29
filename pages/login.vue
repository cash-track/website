<template>
    <div class="row">
        <div class="col-md-8 ml-md-auto mr-md-auto">
            <Login></Login>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import Login from '~/components/Auth/Login.vue'
import GuestOnly from '~/shared/GuestOnly'

@Component({
    components: { Login },
    head: {
        title: 'Login | Cash Track',
    },
})
export default class LoginPage extends Mixins(GuestOnly) {}
</script>
