<template>
    <div class="row">
        <div class="col-md-8 ml-md-auto mr-md-auto">
            <Register></Register>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Register from '~/components/Auth/Register.vue'

@Component({
    components: { Register },
})
export default class RegisterPage extends Vue {}
</script>
