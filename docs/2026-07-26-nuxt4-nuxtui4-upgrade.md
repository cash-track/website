# Nuxt 4 / Nuxt UI 4 Upgrade — `website`

**Created:** 2026-07-26
**Status:** ✅ Done — executed on branch `chore/nuxt4-nuxtui4-migration`
**Drivers:** [issue #84](https://github.com/cash-track/website/issues/84) (2 deferred dependency
advisories) + a full "upgrade everything to latest" sweep.
**Predecessor:** [`2026-06-01-nuxt-security-upgrade-plan.md`](./2026-06-01-nuxt-security-upgrade-plan.md)
(Nuxt 3.10 → 3.21, i18n v8 → v9).

## Outcome summary

| Advisory | Status |
|---|---|
| `@nuxt/ui` [GHSA-gj2h-2fpw-fhv9](https://github.com/advisories/GHSA-gj2h-2fpw-fhv9) (moderate) — SSR `UForm` omits `method`, leaking credentials via GET on pre-hydration submit | ✅ **Cleared** |
| `esbuild` [GHSA-g7r4-m6w7-qqqr](https://github.com/advisories/GHSA-g7r4-m6w7-qqqr) (moderate) | ✅ **Cleared** (scoped `fontless > esbuild` override) |
| `brace-expansion` [GHSA-mh99-v99m-4gvg](https://github.com/advisories/GHSA-mh99-v99m-4gvg) (high) | ❌ **Not fixable today** — see below |
| `tar` [GHSA-r292-9mhp-454m](https://github.com/advisories/GHSA-r292-9mhp-454m) (moderate) | ❌ Blocked by `min-release-age`, eligible ~2026-07-28 |

`npm audit` → **12 vulnerabilities (1 moderate, 11 high)**, but only **2 distinct advisories**:
the 11 highs are all the same `brace-expansion` chain counted once per consumer.

## Version delta

| Package | Before | After |
|---|---|---|
| `nuxt` | 3.21.6 | **4.5.0** |
| `@nuxt/ui` | 2.22.3 | **4.10.0** |
| `@nuxtjs/i18n` | 9.5.6 | **10.4.1** |
| `pinia` / `@pinia/nuxt` | 2.1.7 / 0.5.1 | **4.0.2 / 1.0.1** |
| `vue` / `vue-router` | 3.4.19 / 4.3.0 | **3.5.40 / 5.2.0** |
| `eslint` | 8.x (`latest`) | **10.7.0** |
| `typescript` | — (implicit) | **6.0.3** (+ `vue-tsc` 3.3.7) |
| `tailwindcss` | 3.x (via `@nuxt/ui` 2) | **4.3.3** (explicit dep) |
| `nuxt-gtag` | 1.2.1 | **4.1.0** |
| Node (`.nvmrc`) | 22.12 | **22.23.1** (nuxt@4.5 engines floor is `^22.19.0`) |

Removed: `@nuxtjs/eslint-config-typescript`, `sass-embedded` (no more `.scss`),
`@nuxt/devtools` / `@nuxt/telemetry` from `modules` (bundled with Nuxt 4).
Added: `@nuxt/eslint`, `@iconify-json/lucide`, `@vueuse/core`, `@types/node`.

**Overrides** — the two from the 2026-06 PR (`svgo > commander`,
`@typescript-eslint/typescript-estree > minimatch`) are both gone, resolved natively. Two new ones:
- `"@unhead/vue": "^3.2.1"` — `@nuxtjs/i18n@10` and Nuxt 4 disagree on the unhead major; forcing v3
  keeps a single copy in the tree.
- `"fontless": { "esbuild": "^0.28.1" }` — clears GHSA-g7r4-m6w7-qqqr; `fontless` is the only
  consumer still pinning a vulnerable esbuild.

---

## Advisory 1 — `@nuxt/ui` GHSA-gj2h-2fpw-fhv9 ✅

The fix ships in `@nuxt/ui` ≥ 4.10.0, which requires Nuxt 4 — that is why the whole migration was
the prerequisite. Nuxt UI 4's `Form.vue` hardcodes `method="post"` on the rendered `<form>`, so the
attribute is present in the SSR HTML before any JS runs.

**Verified against the production build** (`npm run build` →
`PORT=3010 node .output/server/index.mjs`, raw `curl` of the SSR HTML — not the hydrated DOM):

```
/login              → <form id="v-0-1" method="post">
/register           → <form id="v-0-1" method="post">
/password/forgot    → <form id="v-0-1" method="post">
/uk/login           → <form id="v-0-1" method="post">
/uk/register        → <form id="v-0-1" method="post">
/uk/password/forgot → <form id="v-0-1" method="post">
```

`npm audit` no longer reports GHSA-gj2h-2fpw-fhv9. All three issue acceptance criteria met.

## Advisory 2 — `brace-expansion` GHSA-mh99-v99m-4gvg ❌

**Not fixable in this PR.** Two independent blockers:

1. **Dependency shape.** Every one of the 11 high findings sits in a single subtree:
   `nuxt → nitropack → archiver`. Three distinct `minimatch` copies consume `brace-expansion`:

   | Consumer | `minimatch` | Import style | Bumpable to `brace-expansion@5`? |
   |---|---|---|---|
   | (hoisted) | 10.2.5 | **named** (`{ expand }`) | yes |
   | `archiver-utils/node_modules/minimatch` | 9.0.9 | **default** | no — pins `^2.x` |
   | `readdir-glob/node_modules/minimatch` | 5.1.9 | **default** | no — pins `^2.x` |

   `brace-expansion@5` dropped the default export. Forcing it into the 9.x/5.x copies reproduces
   `TypeError: expand is not a function` at build time. Forcing `minimatch@^10` into those consumers
   just relocates the break — minimatch 10 also dropped its default export, which `archiver-utils`
   and `readdir-glob` rely on. There is no 1.x/2.x backport of the patch.

2. **Supply-chain policy.** `brace-expansion@5.0.8` (the only patched release) was published
   2026-07-23; `~/.npmrc` sets `min-release-age=7`, so it is not installable until ~**2026-07-30**.
   This policy was deliberately **not** bypassed.

**Actual exposure: nil.** `archiver` is imported by exactly one file in the tree —
`nitropack/dist/presets/azure/utils.mjs` — which is never loaded by this project's `node-server`
preset / Docker deploy. It is build-time-only, dev-only code for an unused Nitro preset.

**Re-check after 2026-07-30.** If `archiver-utils`/`readdir-glob` still haven't moved, the exit is
upstream: `nitropack` dropping `archiver`, or `archiver` moving to minimatch 10.

## Advisory 3 — `tar` GHSA-r292-9mhp-454m ❌ (new, not in issue #84)

Installed 7.5.20; patched in 7.5.21, published 2026-07-21 → age-blocked until ~**2026-07-28**. No
code change needed, just a re-run of `npm update tar` once eligible.

---

## Breaking changes handled

### Nuxt 3 → 4

- **`srcDir` moved to `app/`.** `api/`, `components/`, `layouts/`, `lib/`, `pages/`, `plugins/`,
  `services/`, `store/`, `assets/`, `app.vue`, `app.config.ts` all relocated under `app/`.
  `server/tsconfig.json` deleted (Nuxt 4 generates it).
- **Split tsconfigs.** Nuxt 4 emits `tsconfig.app/node/server/shared.json`, each with an explicit
  `"types": []` — which disables automatic `node_modules/@types` pickup. Ambient globals now have to
  be opted in by name via `typescript.tsConfig` / `typescript.nodeTsConfig` in `nuxt.config.ts`
  (`google.accounts` for the app, `node` for the config file itself).
- `@nuxt/devtools` and `@nuxt/telemetry` are built in — removed from `modules`.

### Nuxt UI 2 → 4

- **`UApp` is now required** at the root of `app.vue` (toasts/tooltips/overlays).
- **Tailwind v4, CSS-first.** `tailwind.config.ts` deleted; `assets/main.scss` → `assets/css/main.css`
  with `@import "tailwindcss"; @import "@nuxt/ui";` and the brand palette in a `@theme static` block.
  SFC `<style>` blocks that use `@apply` need `@reference "../assets/css/main.css";`.
- **Semantic colors.** `app.config.ts` maps `primary: 'cash'` / `neutral: 'gray'`.
- **Icons** default to `lucide` — added `@iconify-json/lucide`.
- **`variant="soft"` changed meaning**: v4 renders `bg-{color}/10`, v2 rendered `bg-{color}-50`.
  Anywhere a soft button sat on a busy background this became near-invisible.
- **Every Nuxt UI DOM root now carries `data-slot="…"`**, and solid buttons use `text-inverted`
  instead of a literal `text-white` class.

### `@nuxtjs/i18n` 9 → 10

- `restructureDir` can no longer be disabled — `lang/en.ts|uk.ts` → `i18n/locales/`, and `langDir`
  dropped (its default is now correct).
- `useLocaleHead()` lost its `key` option; head tags are unhead v3 discriminated types now.

### ESLint 8 → 10

`.eslintrc` deleted; flat config `eslint.config.mjs` wrapping `withNuxt()` from `@nuxt/eslint`.
Stylistic rules (4-space indent, single quotes, no semicolons, no trailing commas) now live under
`eslint.config.stylistic` in `nuxt.config.ts`. `lint:js` simplifies to `eslint .`.

## Regressions found and fixed

Three real visual/behavioural regressions surfaced during browser verification. All were caused by
Nuxt UI v4 design-system changes, not by the framework bump.

1. **Every auth-form input rendered with a red error ring on first paint.**
   `UFormField`'s `error` prop is declared `type: [Boolean, String]` — Boolean first — so Vue's
   boolean casting turns `:error="''"` into `true`. `ValidatorMessager.validationMessage()` returned
   `''` for a clean field, which put every untouched input into the error state (red ring +
   `aria-invalid`). Fixed by returning `undefined` instead (`app/lib/ValidatorMessager.ts`).
   Verified both directions: clean → `ring-accented` / `aria-invalid="false"`; 422 response → ring +
   per-field message.

2. **All three buttons on `/about` rendered green-on-green (invisible labels).**
   `main.css` had `.info-page a:not(.text-white)` to exclude Nuxt UI buttons from the prose-link
   colour. v4 emits `text-inverted`, not `text-white`, so the exclusion stopped matching. Fixed with
   `a:not([data-slot])`, which keys off the marker every Nuxt UI root now carries.

3. **Home-page support CTA near-invisible over the video background** — the `variant="soft"` change
   above. Restored to production parity with an explicit
   `bg-primary-50 dark:bg-primary-950 hover:bg-primary-500 hover:text-white`.

## Accepted differences from production

Design-system baseline changes, applied consistently across the site — not defects:

- Body/heading text is `oklch(0.373 0.034 259.733)` rather than pure black.
- `variant="outline"` rings are 50%-alpha instead of solid.
- Inputs are ~2px shorter.

**Not a regression:** `/uk` (the localized home page) 404s. `app/pages/index.vue` calls
`defineI18nRoute(false)` — identical at HEAD, and production `https://cash-track.app/uk` behaves the
same way.

## Verification performed

`/website` has **no e2e tests**, so functional verification was manual via `agent-browser` against
the full local stack.

- `npm run lint:js` ✓ · `npm run typecheck` ✓ · `npm run build` ✓ (5.25 MB, 1.22 MB gzip)
- SSR `method="post"` on the **production build**, all 6 auth routes (above)
- 21 routes across both locales return 200; language switcher EN ↔ UK (`lang="en-US"` / `uk-UA`)
- Mobile nav at 390×844 (collapse `display:none` → `block`, height 202px); dark mode
- Login error paths: 401 → `UAlert` renders "Невірний email або пароль."; empty submit → 422 with
  per-field errors. No credentials were used — `.testing.local` was never read.
- CI needs no changes: `quality.yml` passes `node-version: "22"` and the shared workflow's default
  `lint-command` (`npm run lint`) works with the flat config. `Dockerfile`'s floating
  `node:22-alpine` satisfies the new engines floor.
