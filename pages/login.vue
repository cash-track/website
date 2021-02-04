<template>
    <div class="row">
        <div class="col-md-8 ml-md-auto mr-md-auto">
            <Login></Login>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Login from '~/components/Auth/Login.vue'

@Component({
    components: { Login },
    head: {
        title: 'Login | Cash Track',
    },
})
export default class LoginPage extends Vue {}
</script>
