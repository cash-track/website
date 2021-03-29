import { Vue, Component } from 'vue-property-decorator'

@Component
export default class WebAppLinks extends Vue {
    get walletsLink() {
        return `${this.$config.webAppUrl}/wallets`
    }

    get profileLink() {
        return `${this.$config.webAppUrl}/profile`
    }
}
