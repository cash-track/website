import path from 'path'
import fs from 'fs'

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
        script: [
            {
                type: 'text/javascript',
                src:
                    'https://cdn-cookieyes.com/client_data/095aace7a4edac9e6f314df6/script.js',
            },
            {
                type: 'text/javascript',
                src: 'https://accounts.google.com/gsi/client',
                defer: true,
                async: true,
            },
        ],
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
            {
                name: 'msapplication-TileColor',
                content: '#00aba9',
            },
            {
                name: 'theme-color',
                content: '#ffffff',
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
                sizes: '180x180',
            },
            {
                rel: 'manifest',
                href: '/site.webmanifest',
            },
            {
                rel: 'mask-icon',
                href: '/img/icons/safari-pinned-tab.svg',
                color: '#5bbad5',
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
        '@nuxtjs/i18n',

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
            baseURL: process.env.GATEWAY_URL,
        },
        baseUrl: process.env.BASE_URL,
        webAppUrl: process.env.WEB_APP_URL,
        gatewayUrl: process.env.GATEWAY_URL,
        googleAnalytics: {
            id: process.env.GOOGLE_ANALYTICS_ID,
        },
        recaptcha: {
            siteKey: process.env.CAPTCHA_CLIENT_KEY,
        },
        googleAuth: {
            clientId: process.env.GOOGLE_CLIENT_ID,
        },
    },

    googleAnalytics: {
        id: 'UA-12301-2',
    },

    bootstrapVue: {
        icons: true,
    },

    /* @deprecated */
    serverMiddleware: [
        {
            path: '/api',
            handler: '~/api/internal/routes.ts',
        },
    ],

    server: {
        port: 3000,
        host: (() => {
            return process.env.HTTPS_ENABLED === 'true'
                ? process.env.HTTPS_HOST
                : '0.0.0.0'
        })(),
        https: (() => {
            return process.env.HTTPS_ENABLED !== 'true'
                ? undefined
                : {
                      key: fs.readFileSync(
                          path.resolve(__dirname, process.env.HTTPS_KEY_PATH)
                      ),
                      cert: fs.readFileSync(
                          path.resolve(__dirname, process.env.HTTPS_CRT_PATH)
                      ),
                  }
        })(),
    },

    recaptcha: {
        hideBadge: false,
        version: 3,
        size: 'normal',
    },

    i18n: {
        baseUrl: process.env.BASE_URL,
        locales: [
            {
                code: 'en',
                file: 'en.ts',
                iso: 'en-US',
                name: '🇺🇸 English',
                flag: '🇺🇸',
            },
            {
                code: 'uk',
                file: 'uk.ts',
                iso: 'uk-UA',
                name: '🇺🇦 Українська',
                flag: '🇺🇦',
            },
        ],
        defaultLocale: 'en',
        strategy: 'prefix_except_default',
        langDir: 'lang/',

        detectBrowserLanguage: {
            useCookie: true,
            cookieKey: 'cshtrkl',
        },

        vueI18n: {
            fallbackLocale: 'en',
        },
    },
}
