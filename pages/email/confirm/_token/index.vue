<template>
    <div class="row">
        <div class="col-md-8 ml-md-auto mr-md-auto">
            <EmailConfirmation :token="$route.params.token"></EmailConfirmation>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import EmailConfirmation from '~/components/Auth/EmailConfirmation.vue'

@Component({
    components: { EmailConfirmation },
})
export default class EmailConfirmTokenPage extends Vue {}
</script>
