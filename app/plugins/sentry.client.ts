import * as Sentry from '@sentry/vue'

// Handled flows and browser noise, not bugs.
const IGNORED_ERRORS: (string | RegExp)[] = ['ResizeObserver loop', /^Failed to fetch$/, /^Load failed$/]

export default defineNuxtPlugin((nuxtApp) => {
    const { sentryDsn, appVersion } = nuxtApp.$config.public
    if (!sentryDsn) return

    Sentry.init({
        app: nuxtApp.vueApp,
        dsn: sentryDsn,
        release: appVersion ? `website@${appVersion}` : undefined,
        environment: import.meta.dev ? 'development' : 'production',
        // Errors only; Tempo owns tracing.
        tracesSampleRate: 0,
        // sentry-trace/baggage headers would fail the gateway's CORS preflight.
        tracePropagationTargets: [],
        ignoreErrors: IGNORED_ERRORS,
        beforeSend(event, hint) {
            const traceId = (hint.originalException as { response?: Response } | null)?.response?.headers?.get('x-ct-trace-id')
            if (traceId) event.tags = { ...event.tags, trace_id: traceId }
            return event
        }
    })
})
