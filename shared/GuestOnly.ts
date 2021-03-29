import { Vue, Component, Watch } from 'vue-property-decorator'

@Component
export default class GuestOnly extends Vue {
    get isLogged(): boolean {
        return this.$store.state.auth.isLogged
    }

    @Watch('isLogged')
    onLogged() {
        if (!this.isLogged) {
            return
        }

        this.$router.push('/')
    }
}
