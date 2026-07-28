// Takes the raw string rather than reading `document.cookie`, so it serves both the client
// and the SSR request header.
export function readCookieValue(cookieString: string, name: string): string | null {
    const prefix = `${name}=`
    const pair = cookieString
        .split(';')
        .map(part => part.trim())
        .find(part => part.startsWith(prefix))

    return pair ? decodeURIComponent(pair.slice(prefix.length)) : null
}
