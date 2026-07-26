// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        '@nuxt/eslint',
        '@nuxt/ui',
        '@nuxtjs/i18n',
        'nuxt-gtag',
        '@pinia/nuxt'
    ],
    $development: {
        devtools: { enabled: true }
    },

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
    css: [
        '~/assets/css/main.css'
    ],

    runtimeConfig: {
        public: {
            baseUrl: process.env.NUXT_PUBLIC_BASE_URL,
            webAppUrl: process.env.NUXT_PUBLIC_WEB_APP_URL,
            gatewayUrl: process.env.NUXT_PUBLIC_GATEWAY_URL,
            googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID,
            captchaClientKey: process.env.NUXT_PUBLIC_CAPTCHA_CLIENT_KEY
        }
    },
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
    compatibilityDate: '2026-07-26',

    typescript: {
        tsConfig: {
            compilerOptions: {
                // Nuxt pins `types`, so @types packages must be opted in by name.
                types: ['google.accounts']
            }
        },
        nodeTsConfig: {
            compilerOptions: {
                // `process.env` is read throughout this file.
                types: ['node']
            }
        }
    },

    eslint: {
        config: {
            stylistic: {
                indent: 4,
                quotes: 'single',
                semi: false,
                commaDangle: 'never'
            }
        }
    },

    gtag: {
        id: process.env.NUXT_PUBLIC_GOOGLE_ANALYTICS_ID
    },
    i18n: {
        // Locale files live in i18n/locales/ — langDir's default, and no longer overridable.
        baseUrl: process.env.NUXT_PUBLIC_BASE_URL,
        locales: [
            {
                code: 'en',
                file: 'en.ts',
                language: 'en-US',
                name: '🇺🇸 English',
                flag: '🇺🇸'
            },
            {
                code: 'uk',
                file: 'uk.ts',
                language: 'uk-UA',
                name: '🇺🇦 Українська',
                flag: '🇺🇦'
            }
        ],
        defaultLocale: 'en',
        strategy: 'prefix_except_default',

        detectBrowserLanguage: {
            useCookie: true,
            cookieKey: 'cshtrkl'
        }
    }
})
