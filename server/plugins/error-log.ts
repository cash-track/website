// Tokens and reset codes travel in the path, so they are masked before logging.
const SECRET_SEGMENT = /\/(reset|confirm)\/[^/]+/

// One JSON line per 5xx so promtail can lift `level`; Nitro's own log is multi-line plain text.
export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('error', (error, { event }) => {
        const status = (error as { statusCode?: number }).statusCode ?? 500
        if (status < 500) {
            return
        }

        console.error(JSON.stringify({
            level: 'error',
            msg: 'SSR request failed',
            status,
            method: event?.method,
            path: event?.path.split('?')[0]?.replace(SECRET_SEGMENT, '/$1/***'),
            error: error.message,
            stack: error.stack
        }))
    })
})
