export default {
    /*
     ** Nuxt rendering mode
     ** See https://nuxtjs.org/api/configuration-mode
     */
    mode: 'universal',
    /*
     ** Nuxt target
     ** See https://nuxtjs.org/api/configuration-target
     */
    target: 'server',
    /*
     ** Headers of the page
     ** See https://nuxtjs.org/api/configuration-head
     */
    head: {
        title: 'Cash Track',
        meta: [
            {
                charset: 'utf-8',
            },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
            },
            {
                hid: 'description',
                name: 'description',
                content: process.env.npm_package_description || '',
            },
        ],
        link: [
            {
                rel: 'icon',
                type: 'image/x-icon',
                href: '/favicon.ico',
            },
            {
                rel: 'icon',
                type: 'image/png',
                href: '/img/icons/favicon-32x32.png',
                size: '32x32',
            },
            {
                rel: 'icon',
                type: 'image/png',
                href: '/img/icons/favicon-16x16.png',
                size: '16x16',
            },
            {
                rel: 'apple-touch-icon',
                href: '/img/icons/apple-touch-icon.png',
            },
        ],
    },
    /*
     ** Global CSS
     */
    css: ['~/assets/main.scss'],
    /*
     ** Plugins to load before mounting the App
     ** https://nuxtjs.org/guide/plugins
     */
    plugins: [],
    /*
     ** Auto import components
     ** See https://nuxtjs.org/api/configuration-components
     */
    components: true,
    /*
     ** Nuxt.js dev-modules
     */
    buildModules: ['@nuxt/typescript-build', '@nuxtjs/google-analytics'],
    /*
     ** Nuxt.js modules
     */
    modules: [
        // Doc: https://bootstrap-vue.js.org
        'bootstrap-vue/nuxt',
        // Doc: https://axios.nuxtjs.org/usage
        '@nuxtjs/axios',

        '@nuxtjs/style-resources',

        '@nuxtjs/recaptcha',
    ],
    /*
     ** Axios module configuration
     ** See https://axios.nuxtjs.org/options
     */
    axios: {
        headers: {
            'Content-Type': 'application/json',
        },
    },
    /*
     ** Build configuration
     ** See https://nuxtjs.org/api/configuration-build/
     */
    build: {},

    styleResources: {
        scss: ['./assets/*.scss'],
    },

    publicRuntimeConfig: {
        axios: {
            baseURL: process.env.BASE_URL,
        },
        baseUrl: process.env.BASE_URL,
        webAppUrl: process.env.WEB_APP_URL,
        googleAnalytics: {
            id: process.env.GOOGLE_ANALYTICS_ID,
        },
        recaptcha: {
            siteKey: process.env.CAPTCHA_CLIENT_KEY,
        },
    },

    googleAnalytics: {
        id: 'UA-12301-2',
    },

    bootstrapVue: {
        icons: true,
    },

    serverMiddleware: [
        {
            path: '/api',
            handler: '~/api/internal/routes.ts',
        },
    ],

    server: {
        port: 3000,
        host: '0.0.0.0',
    },

    recaptcha: {
        hideBadge: false,
        version: 3,
        size: 'normal',
    },
}
