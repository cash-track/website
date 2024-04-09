// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    $production: {
        app: {
            head: {
                script: [
                    {
                        type: 'text/javascript',
                        src:
                            'https://cdn-cookieyes.com/client_data/095aace7a4edac9e6f314df6/script.js'
                    }
                ]
            }
        }
    },
    $development: {
        devtools: { enabled: true }
    },

    app: {
        head: {
            script: [
                {
                    type: 'text/javascript',
                    src: 'https://accounts.google.com/gsi/client',
                    defer: true,
                    async: true
                }
            ],
            meta: [
                {
                    charset: 'utf-8'
                },
                {
                    name: 'viewport',
                    content: 'width=device-width, initial-scale=1'
                },
                {
                    name: 'msapplication-TileColor',
                    content: '#f5f5f5'
                },
                {
                    name: 'theme-color',
                    content: '#f5f5f5'
                },
                {
                    property: 'og:image',
                    content: '/img/logo-full.svg'
                }
            ],
            link: [
                {
                    rel: 'icon',
                    type: 'image/x-icon',
                    href: '/favicon.ico'
                },
                {
                    rel: 'icon',
                    type: 'image/png',
                    href: '/img/icons/favicon-32x32.png',
                    sizes: '32x32'
                },
                {
                    rel: 'icon',
                    type: 'image/png',
                    href: '/img/icons/favicon-16x16.png',
                    sizes: '16x16'
                },
                {
                    rel: 'apple-touch-icon',
                    href: '/img/icons/apple-touch-icon.png',
                    sizes: '180x180'
                },
                {
                    rel: 'manifest',
                    href: '/site.webmanifest'
                },
                {
                    rel: 'mask-icon',
                    href: '/img/icons/safari-pinned-tab.svg',
                    color: '#f5f5f5'
                }
            ]
        }
    },
    modules: [
        '@nuxt/devtools',
        '@nuxt/telemetry',
        '@nuxt/ui',
        '@nuxtjs/i18n',
        'nuxt-gtag',
        '@pinia/nuxt'
    ],
    css: [
        'assets/main.scss'
    ],
    devServer: {
        host: (() => {
            return process.env.HTTPS_ENABLED === 'true'
                ? process.env.HTTPS_HOST
                : '0.0.0.0'
        })(),
        port: 3000,
        https: (() => {
            return process.env.HTTPS_ENABLED !== 'true'
                ? false
                : {
                    key: process.env.HTTPS_KEY_PATH,
                    cert: process.env.HTTPS_CRT_PATH
                }
        })()
    },
    i18n: {
        baseUrl: process.env.NUXT_PUBLIC_BASE_URL,
        locales: [
            {
                code: 'en',
                file: 'en.ts',
                iso: 'en-US',
                name: '🇺🇸 English',
                flag: '🇺🇸'
            },
            {
                code: 'uk',
                file: 'uk.ts',
                iso: 'uk-UA',
                name: '🇺🇦 Українська',
                flag: '🇺🇦'
            }
        ],
        defaultLocale: 'en',
        strategy: 'prefix_except_default',
        langDir: 'lang/',

        detectBrowserLanguage: {
            useCookie: true,
            cookieKey: 'cshtrkl'
        }
    },

    runtimeConfig: {
        public: {
            baseUrl: process.env.NUXT_PUBLIC_BASE_URL,
            webAppUrl: process.env.NUXT_PUBLIC_WEB_APP_URL,
            gatewayUrl: process.env.NUXT_PUBLIC_GATEWAY_URL,
            googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID,
            captchaClientKey: process.env.NUXT_PUBLIC_CAPTCHA_CLIENT_KEY
        }
    },

    gtag: {
        id: process.env.NUXT_PUBLIC_GOOGLE_ANALYTICS_ID
    }
})
