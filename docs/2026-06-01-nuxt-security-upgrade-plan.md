# Nuxt Security Upgrade Plan — `website`

**Created:** 2026-06-01
**Status:** Planned (deferred from the 2026-06-01 dependency security PR)
**Scope:** Clear the 31 security advisories that are gated behind a major Nuxt 3 framework
upgrade. These were intentionally **not** fixed in the override-only security PR because each
requires a cross-major dependency bump or a breaking framework migration.

---

## Why these were deferred

The 2026-06-01 security PR cleared 20 advisories using `package.json` `overrides` only — no
direct-dependency version changes — because every direct dep was left at its master version.
That worked for transitive deps where the patched version is **same-major** (i18n runtime,
eslint toolchain, `koa`, `cross-spawn`, `@babel/*`, `svgo`, `js-yaml`, `diff`,
`path-to-regexp`).

The remaining 31 advisories cannot be fixed that way. They fall into three coupled groups,
all anchored to the Nuxt version:

1. **Nuxt core + Vite stack** — `nuxt`, `@nuxt/kit`, `@nuxt/vite-builder`, `@nuxt/telemetry`,
   `vite`, `vite-node`, `@vitejs/plugin-vue`, `@vitejs/plugin-vue-jsx`, `esbuild`,
   `vite-plugin-inspect`, `vite-plugin-vue-inspector`. Patched versions are cross-major
   (`vite` 5 → 7, `esbuild` 0.24 → 0.25) and only ship inside newer Nuxt releases.
2. **Head management** — `unhead`, `@unhead/vue`. Nuxt ≥ 3.17 migrates `unhead` 1.x → 2.x.
   The installed `@nuxtjs/i18n@8` imports `getActiveHead` from `unhead`, which **no longer
   exists** in `unhead` 2.x — so bumping Nuxt past 3.16 hard-breaks the build until i18n is
   also upgraded to v9.
3. **DevTools download/build toolchain** — `@nuxt/devtools` (1.0.8) pulls
   `pacote → @npmcli/run-script → node-gyp → {cacache, make-fetch-happen, npm-registry-fetch,
   tar 6.x, @sigstore/*, sigstore, tuf-js}`, plus `giget`, `c12`, `ajv`, `devalue`, `nanoid`.
   `tar`'s six 2026 CVEs are patched only in the 7.x line (≥ 7.5.11); the 6.x copies here
   would need a cross-major jump. All of this is replaced wholesale by upgrading
   `@nuxt/devtools` (which happens via the Nuxt upgrade). `parse-git-config@3.0.0` has **no
   patched release** — it is dropped only when the newer devtools chain stops depending on it.

### The cascade discovered during the security PR

Bumping `nuxt` 3.10.3 → 3.21.6 (the version that clears all `nuxt` advisories) forces, in order:

- **Node ≥ 22.12** — Nuxt 3.21's `oxc-walker` does `require("oxc-parser")`, and `oxc-parser`
  is ESM-only; `require()` of an ESM package only works on Node 22.12+. The repo currently
  builds on Node 22.11.
- **`sass-embedded` as an explicit devDependency** — Vite 7 drops the bundled Sass compiler.
  `assets/main.scss` then fails to build. (Note: this `.scss` build dependency is **already
  missing on master** — see "Pre-existing build gap" below.)
- **`@nuxtjs/i18n` 8 → 9 (breaking)** — required for `unhead` 2 compatibility; v9 has
  breaking config and composable changes that need code updates and re-verification.

---

## Deferred advisories (31)

Re-run `npm audit` after the upgrade to confirm each is cleared.

| Severity | Package | Installed range | Cleared by |
|---|---|---|---|
| critical | `nuxt` | ≤ 3.21.5 | `nuxt` ≥ 3.21.6 |
| high | `@nuxt/kit` | 3.1.0 – 3.15.4 | Nuxt upgrade |
| high | `@nuxt/vite-builder` | ≤ 3.15.4 | Nuxt upgrade |
| high | `@nuxt/telemetry` | ≤ 2.6.5 | Nuxt upgrade |
| high | `@nuxt/devtools` | ≤ 2.6.3 | `@nuxt/devtools` ≥ 2.6.4 (via Nuxt) |
| high | `devalue` | ≤ 5.6.3 | `devalue` ≥ 5.6.4 (via Nuxt/Nitro) |
| high | `c12` | 1.1.0 – 2.0.4 | via Nuxt config loader |
| high | `giget` | 0.0.1 – 1.2.5 | via `@nuxt/devtools` |
| high | `node-gyp` | ≤ 10.3.1 | via `@nuxt/devtools` → `pacote` chain |
| high | `pacote` | 5.0.0 – 21.0.0 | via `@nuxt/devtools` |
| high | `@npmcli/run-script` | 1.1.1 – 9.0.1 | via `pacote` |
| high | `cacache` | 14.0.0 – 18.0.4 | via `pacote` |
| high | `make-fetch-happen` | 7.1.1 – 14.0.0 | via `pacote` |
| high | `npm-registry-fetch` | 7.0.0 – 18.0.0 | via `pacote` |
| high | `sigstore` | 1.6.0 – 2.3.1 | via `pacote` |
| high | `@sigstore/sign` | ≤ 2.3.2 | via `pacote` |
| high | `@sigstore/tuf` | ≤ 2.3.4 | via `pacote` |
| high | `tuf-js` | ≤ 2.2.1 | via `pacote` |
| high | `tar` | ≤ 7.5.10 | `tar` ≥ 7.5.11 (6.x consumers must move to 7.x) |
| high | `parse-git-config` | `*` (no fix) | **No patched release** — dropped when devtools chain stops depending on it |
| moderate | `vite` | ≤ 6.4.1 | `vite` ≥ 6.4.2 (Nuxt ships 7.x) |
| moderate | `vite-node` | ≤ 2.2.0-beta.2 | via Nuxt/Vitest |
| moderate | `vite-plugin-inspect` | ≤ 0.8.8 | via `@nuxt/devtools` |
| moderate | `vite-plugin-vue-inspector` | ≤ 5.3.0 | via `@nuxt/devtools` |
| moderate | `@vitejs/plugin-vue` | 1.8.0 – 5.2.0 | via Vite upgrade |
| moderate | `@vitejs/plugin-vue-jsx` | ≤ 4.1.0 | via Vite upgrade |
| moderate | `esbuild` | ≤ 0.24.2 | `esbuild` ≥ 0.25.0 (via Vite) |
| moderate | `nanoid` | 4.0.0 – 5.0.8 | `nanoid` ≥ 5.0.9 |
| moderate | `unhead` | ≤ 2.1.12 | `unhead` ≥ 2.1.13 (Nuxt ≥ 3.17) |
| low | `@unhead/vue` | ≤ 2.1.10 | via `unhead` upgrade |
| moderate | `ajv` | < 6.14.0 | via dependency tree refresh |

---

## Step-by-step upgrade

> Run all `npm`/`node` commands with a Node **≥ 22.12** on `PATH`. Cut a fresh branch from
> `origin/master`. The repo's global `~/.npmrc` sets `ignore-scripts=true`, so run
> `npx nuxt prepare` manually after install, and note that native optional bindings
> (`@oxc-parser/*`, etc.) may need an explicit `npm install --no-save <binding>` if a bulk
> install skips them.

### Stage 0 — Prerequisites (no code yet)
1. Install/select Node ≥ 22.12 (e.g. `nvm install 22.12.0 && nvm use 22.12.0`). Pin it for
   the repo — add `.nvmrc` (`22.12`) and bump CI's Node version in the shared
   `cash-track/.github` build workflow.
2. Read the upstream upgrade guides: Nuxt 3.10 → latest 3.x release notes, `@nuxtjs/i18n`
   v8 → v9 migration, `unhead` v1 → v2, Vite 5 → 7.

### Stage 1 — Build tooling
3. Add `sass-embedded` to `devDependencies` (resolves the `assets/main.scss` build; see
   "Pre-existing build gap"). Verify `npm run build` once it's in.
4. Add `compatibilityDate: '2026-06-01'` to `nuxt.config.ts` (Nitro warns without it).

### Stage 2 — i18n v9 (do before/with the Nuxt bump)
5. `npm install @nuxtjs/i18n@^9` and migrate config + composables per the v9 guide
   (option renames, `vueI18n` config path, `useI18n` usage). This is the breaking part —
   budget real time and re-test every localized page (EN + UK).
6. Drop the `vue-i18n` / `@intlify/*` overrides added in the security PR once i18n v9 pulls
   patched `vue-i18n` natively (confirm with `npm ls vue-i18n @intlify/shared`).

### Stage 3 — Nuxt + Vite stack
7. `npm install nuxt@^3.21.6`. This pulls Vite 7, `unhead` 2, patched `@nuxt/devtools`,
   `@nuxt/vite-builder`, `esbuild`, `nanoid`, `devalue`, and the refreshed `pacote`/`node-gyp`
   chain (clears the bulk of the deferred list).
8. `npx nuxt prepare`, then `npm run build`. Fix any Vite 7 / unhead 2 fallout
   (CSS handling, `useHead` usage, module compatibility).

### Stage 4 — Residual overrides
9. Review the `overrides` block. Remove any now-redundant entries (the i18n group; possibly
   `path-to-regexp`, `glob`, `minimatch` if the new tree resolves patched versions natively).
   Keep only those still required by `npm audit`.
10. For `tar`: confirm the new `@nuxt/devtools` chain resolves `tar` ≥ 7.5.11. If a stray 6.x
    copy remains, add a scoped override `"tar@>=6.0.0 <7.0.0": "^7.5.11"` **only after**
    verifying its consumers tolerate tar 7 (API/ESM change) — otherwise leave it documented.
11. `parse-git-config`: verify it's gone from the tree. If still present with no patched
    release, document as accepted risk (dev-only, build-time).

### Stage 5 — Verification gates
12. `npm audit` → target **0 vulnerabilities** (or only `parse-git-config` documented).
13. `npm run lint:js` → clean.
14. `npm run build` → succeeds.
15. `agent-browser` smoke test of the marketing site per project CLAUDE.md: home page
    `https://dev-cash-track.app`, language switch EN ↔ UK, all top-level routes render.
16. Update this doc's status to "Done" and reference the upgrade PR.

---

## Pre-existing build gap (not introduced by the security PR)

`nuxt.config.ts` imports `assets/main.scss`, but neither `sass` nor `sass-embedded` is in
master's dependency tree (they appear only as a `"*"` optional peer in the lockfile). A clean
`npm install && npm run build` on **master** fails with
`Preprocessor dependency "sass-embedded" not found`. CI presumably provides it out-of-band.
Stage 1 step 3 fixes this properly by declaring `sass-embedded` as a devDependency.
