// GSI script loads async; poll briefly, give up silently if blocked (ad blockers etc.)
export function onGoogleReady(callback: () => void, attempts = 20) {
    if (typeof window.google !== 'undefined' && window.google.accounts?.id) {
        callback()
        return
    }

    if (attempts > 0) {
        setTimeout(() => onGoogleReady(callback, attempts - 1), 250)
    }
}
