import { VueReCaptcha } from 'vue-recaptcha-v3'

export default defineNuxtPlugin((nuxtApp) => {
    const key = nuxtApp.$config.public?.captchaClientKey?.toString() ?? ''
    nuxtApp.vueApp.use(VueReCaptcha, {
        siteKey: key,
        loaderOptions: {
            autoHideBadge: false
        }
    })
})
