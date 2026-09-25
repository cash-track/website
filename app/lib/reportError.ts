import * as Sentry from '@sentry/vue'
import { FetchError } from 'ofetch'

// 4xx are client errors and a missing status is a network failure; neither is a bug.
export function isReportable(error: unknown): boolean {
    if (!(error instanceof FetchError)) {
        return true
    }

    return (error.statusCode ?? 0) >= 500
}

export function reportUnexpectedError(error: unknown): void {
    if (!isReportable(error)) {
        return
    }

    console.error(error)
    Sentry.captureException(error)
}
