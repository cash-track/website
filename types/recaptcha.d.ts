import { ReCaptchaInstance } from '@nuxtjs/recaptcha'

declare module 'vue/types/vue' {
    interface Vue {
        $recaptcha: ReCaptchaInstance
    }
}
