import { useRuntimeConfig } from '#app'

export interface ReleaseInfoInterface {
    version: string
    hasReleaseTag: boolean
    hasCommit: boolean
    shortCommit: string
    versionHref: string
    commitHref: string
}

// Snapshot builds pass a branch name (e.g. "master") as appVersion, not a release tag —
// only treat it as one when it looks like one (e.g. "v2.0.5").
const releaseTagPattern = /^v\d/

function releaseTagLink(tag: string): string {
    return `https://github.com/cash-track/website/releases/tag/${tag}`
}

function commitLink(sha: string): string {
    return `https://github.com/cash-track/website/commit/${sha}`
}

export function useReleaseInfo(): ReleaseInfoInterface {
    const config = useRuntimeConfig()

    const version = config.public.appVersion
    const commit = config.public.appCommit
    const hasReleaseTag = releaseTagPattern.test(version)

    return {
        version,
        hasReleaseTag,
        hasCommit: commit.length > 0,
        shortCommit: commit.slice(0, 7),
        versionHref: releaseTagLink(version),
        // With a release tag both the tag and the sha link to the same release page;
        // without one the sha links to its own commit page.
        commitHref: hasReleaseTag ? releaseTagLink(version) : commitLink(commit)
    }
}
