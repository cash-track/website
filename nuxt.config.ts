import { sentryVitePlugin } from '@sentry/vite-plugin'

// Set only in CI release builds (Docker build secret); local and PR builds skip source maps.
const sentryAuthToken = process.env.SENTRY_AUTH_TOKEN

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

    // Shared with the frontend SPA via `cshtrkt`; domain scoping happens at runtime in shared-cookies.client.ts.
    colorMode: {
        preference: 'system',
        fallback: 'light',
        storage: 'cookie',
        storageKey: 'cshtrkt',
        cookieAttrs: {
            path: '/',
            maxAge: 60 * 60 * 24 * 365,
            sameSite: 'lax',
            secure: true
        }
    },

    runtimeConfig: {
        public: {
            baseUrl: process.env.NUXT_PUBLIC_BASE_URL,
            webAppUrl: process.env.NUXT_PUBLIC_WEB_APP_URL,
            gatewayUrl: process.env.NUXT_PUBLIC_GATEWAY_URL,
            googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID,
            captchaClientKey: process.env.NUXT_PUBLIC_CAPTCHA_CLIENT_KEY,
            appVersion: process.env.NUXT_PUBLIC_APP_VERSION ?? '',
            appCommit: process.env.NUXT_PUBLIC_APP_COMMIT ?? '',
            sentryDsn: process.env.NUXT_PUBLIC_SENTRY_DSN ?? ''
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

    // Browser bundle only: the SDK runs client-side. Hidden maps are uploaded, then deleted
    // from the client build dir before Nitro copies it to .output/public, so they never ship.
    ...(sentryAuthToken && { sourcemap: { client: 'hidden' as const } }),
    vite: {
        plugins: sentryVitePlugin({
            disable: !sentryAuthToken,
            authToken: sentryAuthToken,
            url: 'https://de.sentry.io/',
            org: 'cashtrack-o2',
            project: 'website',
            // Events match maps by injected debug id, so no Sentry release is created here.
            release: { create: false, finalize: false, inject: false },
            sourcemaps: {
                // `nuxt build` uses node_modules/.cache/nuxt/.nuxt as buildDir; `.nuxt` covers overrides.
                filesToDeleteAfterUpload: [
                    './node_modules/.cache/nuxt/.nuxt/dist/client/**/*.map',
                    './.nuxt/dist/client/**/*.map'
                ]
            },
            telemetry: false
        }).map(plugin => ({
            ...plugin,
            applyToEnvironment: (environment: { name: string }) => environment.name === 'client'
        }))
    },

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

        // Shared with the frontend SPA via `cshtrkl`; domain scoping happens at runtime in shared-cookies.client.ts.
        detectBrowserLanguage: {
            useCookie: true,
            cookieKey: 'cshtrkl'
        }
    }
})
