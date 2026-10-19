# Structure (2): no global M3 registration — plan note

Date: 2026-10-17/18. Owner structure sequence PR (2) of 4, opened unmerged
for Kern Lead review as PR #67 (branch `structure/2-no-global-registration`,
base `main`, 2 commits). No publish, no version bumps, no tags. No compat
aliases, no fallbacks (ADR-007 / 020). Untouched: `libs/kern-primitives`,
`vendor/axis/*`, untracked reviewer reports.

## Decision executed

Decision 010
(`docs/decisions/010-kern-m3-rename-and-no-global-registration.md`,
accepted): `@xoroh/kern` must not register M3 globally. Importing
`@xoroh/kern`, `@xoroh/kern-native` or `@xoroh/kern-m3` now registers
NOTHING with the universal resolver. Registration is one explicit call,
`registerM3()`, owned by the application entry. A `check:layers` rule
enforces the split (the decision's enforcement clause, now implemented).

## Why the native lazy `defaultScheme()` was forced (not scope creep)

`packages/kern-native/src/theme.tsx` had `export const defaultScheme =
resolveThemeDetails("light")` at module scope. ESM evaluates imports before
the importing module's body runs, so with auto-registration removed, ANY app
importing `@xoroh/kern-native` would throw "Unknown preset" before its own
`registerM3()` call could execute. `defaultScheme` is now a lazy memoized
function (87 call sites, mechanical `defaultScheme` → `defaultScheme()`
sweep across 66 files, imports/re-exports untouched). Default parameter
values evaluate at call time — after the app entry has run — and the result
is cached, keeping the old static-value semantics. Web needed no such change
(`web-theme.ts` resolves only inside functions/hooks).

## Blast radius (all in this PR)

- `packages/kern-m3/src/material-3.ts`: module-scope `registerPreset` loop
  → exported `registerM3()` (idempotent, map overwrite). `index.ts` + README
  document the contract. `expressive-shapes.ts` keeps its package-internal
  shape-registry loop (kern-m3's own map, not the universal resolver — out
  of 010's scope).
- `packages/kern/src/index.ts`, `packages/kern-native/src/index.ts`: side-
  effect imports removed (comments now state the contract).
- Test harnesses register explicitly (consumers, like apps):
  `packages/kern-m3/vitest.setup.ts` (new, wired in `vitest.config.ts`),
  `packages/kern/vitest.setup.ts`, `packages/kern-native/vitest.setup.ts`,
  `packages/kern-native/jest.setup.cjs`.
- New fail-before/pass-after purity tests (fresh `vi.resetModules`
  registries the setups cannot reach): `kern-m3/src/entry-purity.test.ts`,
  `kern/src/entry-purity.test.ts`, `kern-native/src/entry-purity.test.ts`.
  `material-3.test.ts` now exercises `registerM3()` directly. Stale
  side-effect comments/imports removed in 8 kern-m3 test files,
  `seed-theme.test.ts`, native `theme-comp.test.tsx`; MCP
  `zero-to-screen.test.ts` comment refreshed (keeps its source-instance
  explicit loop — `registerM3()` would target the built package instance).
- Site: `src/register-m3.ts` (new) imported first in `router.tsx` — route
  modules resolve M3 at module scope, order is load-bearing and commented;
  Biome's sort keeps it first (`reg` < `rou`).
- CLI starter: `App.tsx` registers at entry, declares `@xoroh/kern-m3`
  directly (`__KERN_M3_DEP__` stamped by init); `init.test.ts` asserts both;
  starter README lists three `file:` deps.
- Docs: getting-started install + register step (`REGISTER` snippet,
  compiled by check:snippets); preset-picker + mobile quickstarts show the
  call; install lines include direct deps.
- `scripts/check-layers.mjs`: new source rule — renderer `src/` (tests
  exempt) must not side-effect-import a system package or call
  `registerM3/registerPreset/defineThemePreset`.
- Token scripts (`gen-preset-css`, `gen-theme-matrix`, `check-theme-matrix`,
  `check-contrast`) already register explicitly — untouched, verified.

## Verification (all green locally, real output)

- `bun run build`: 9 packages in dependency order, ok.
- `bun run typecheck`: 6 packages, exit 0.
- `bun run lint`: 1247 files, clean (fixed: import order x2, formatting,
  `noAssignInExpressions` in `defaultScheme`).
- `bun run test:all`: tokens 70, contracts 32, m3 103 (14 files),
  web 835 (78 files), icons 85, native vitest 104 (10 files),
  native jest 449 (50 suites) — all exit 0.
- CLI: 6 files / 46 tests pass.
- Site `build` (client + SSR), `check:docs` full suite ok,
  `check:snippets` 20 compile (incl. new REGISTER), `test:e2e` 26/26.
- `check:generated` fresh (19 generators, 24 files),
  `check:dist` + `check:dist:types` ok, `check:layers` ok (new rule
  passing), `check:kern` 45/45, `check:elevation-parity` holds
  (pre-existing rulings only).
- `changeset status`: pre-existing entries only, none added (release hold).

## Explicitly NOT in this PR

Structure (3) generated registry + `--system`, (4) web/native widget split,
second-system packages, URL migration (D-URLS vs ADR-007 still escalated),
Button M3 rename, HCT. CI status for PR #67 recorded in `.reports/latest.md`.
