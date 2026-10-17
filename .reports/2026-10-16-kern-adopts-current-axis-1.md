# Report: PR 1 — Refresh vendor/axis to 82c3179 and wire stale-tarball check

Date: 2026-10-17
Branch: `feat/m3-adopt-axis-render` (stacked on `origin/main` at `7434d369` — the kern-m3 rename PR #61 landed first and this work rebased onto it)
Commits: `0007e99a` (refresh + gate), `8f4fae5b` (report + generated site props sync)
Related: Part 1 of 3 for Kern adopting current Axis

## Outcome

Kern now consumes Axis `main` at `82c3179` (Axis PR #53: Base UI alignment
pass — render composition, toast queue, portal host) packed from a clean
Axis worktree with Axis's own `scripts/pack-vendor.mjs`, and a new CI gate
(`check:stale-tarball`) fails the build if any reference points at a
missing or stale tarball or if the lockfile integrity does not match the
committed bytes.

## Key artifacts & changes
1. **Packed Tarball:** built with `node scripts/pack-vendor.mjs` in the clean Axis worktree (detached at `82c3179`, no dirty tree — the script refuses to name tarballs after uncommitted code):
   - Commit: `82c3179`
   - File: `vendor/axis/axis-82c3179.tgz` (179,541 bytes)
   - SHA512 (base64, as pinned by bun.lock): `yoNjjvL9nVTzI+Gbl5GCoucZqK+iJ7XFawfnb1G1g6OfushoX6Wzo91ktQUUKNIwAqw5xsRV24H4vEpTKj8exw==`
   - Removed: `vendor/axis/axis-bed35547.tgz`
2. **References updated** (kern-cli needed no code change — `init.ts` already derives the tarball by globbing `vendor/axis` and erroring when count ≠ 1, so the directory listing is the single source of the filename; `init.test.ts` covers this):
   - `packages/kern/package.json`
   - `packages/kern-native/package.json`
   - `apps/site/package.json`
   - `docs/architecture/kern-axis-migration-and-roadmap.md`
   - `bun.lock`
   - Zero references to `axis-bed35547` remain across repository.
3. **CI Check (`check:stale-tarball`):**
   - Script: `scripts/check-stale-tarball.mjs`
   - Enforces single tarball in `vendor/axis`, verifies tarball SHA512 against actual file on disk, validates `packages/kern`, `packages/kern-native`, `apps/site`, and `bun.lock`.
   - Wired into `package.json` and `.github/workflows/ci.yml`.
   - Verified that mutating the tarball filename or hash causes CI gate failure.
4. **Site Primitives Check:**
   - Updated `apps/site/scripts/check-primitives-docs.mjs` to recognize new state/props exports and `@xoroh/axis/models` exports.

## Commands run + real output (this validation pass, worktree `feat/m3-adopt-axis-render`)

- `bun run lint` → `Checked 1243 files in 5s. No fixes applied. Found 1 info.` exit 0
- `bun run typecheck` → `@xoroh/kern-tokens … kern-m3 … kern … kern-native … kern-icons:` all `Exited with code 0`
- `bun run test` (vitest fan-out: tokens, contracts, m3, kern, kern-native, icons, mcp) → all `Exited with code 0` (kern-icons tail: `Tests 85 passed (85)`)
- `bun run test:native:jest` → `Test Suites: 50 passed, 50 total / Tests: 449 passed, 449 total`
- `packages/kern-cli`: `bun test` → `46 pass / 0 fail / 175 expect() calls across 6 files`
- `bun run build` → `build-order: ok — 9 package(s) built in dependency order.`
- Gates, each exit 0 with its own summary line:
  `check:kern` (45/45 M3 roles) · `check:layers` · `check:native-theme` ·
  `check:xoroh-leaks` · `check:ts-policy` · `check:stale-refs` (no dead
  rules) · `check:stale-tarball` · `check:primitives` (legacy kernel
  frozen; `@xoroh/axis` resolves) · `check:coverage` · `check:consumption`
  (286 exported names) · `check:currency` (14 claims) · `check:elevation`,
  `check:contrast` · `check:theme-matrix` (30 cells) · `check:workflow`
  (27 gates invoked, 22 gate files reachable) · `icons:check` ·
  `check:generated` (19 generators, 24 derived files byte-match) ·
  `check:generated:census` · `check:pack` · `check:registry-paths`
  (418 paths) · `preflight:publish` (8 packages, no `workspace:` shipped) ·
  `test:scripts` (32 tests, 4 files)
- `apps/site`: `typecheck` + `check:docs` (`check-page-md ok`, MCP index
  205 pages) + `build` (`✓ built in 2.23s`)
- `bun run test:e2e` (playwright against `vite preview :4173`) → `26 passed (34.9s)`
- `apps/mobile`: `typecheck` clean; `bun run bundle` (Expo export
  android+ios) → real Hermes bundles (2.1MB each), exit 0
- Clean-clone proof (`git clone --no-hardlinks <worktree> /tmp/opencode/kern-git && git checkout feat/m3-adopt-axis-render && bun install --frozen-lockfile`) →
  `1100 packages installed [1221.00ms]`, tarball materialized in every
  consumer's `node_modules`, `bun run check:stale-tarball` passes there.

## Acceptance

1. **PASS** — `grep -rn axis-bed35547` over tracked text files (excluding
   `.reports/`, archives, changesets) returns nothing; `bun.lock` contains
   zero occurrences.
2. **PASS — shown failing, then passing:**
   - Reintroduce the old filename in `packages/kern/package.json` →
     `check:stale-tarball FAILED — 3 violation(s): … points to stale or mismatched tarball "file:../../vendor/axis/axis-bed35547.tgz" (expected …axis-82c3179.tgz)`, exit 1.
   - Corrupt the lockfile integrity hash → `check:stale-tarball FAILED — 1 violation(s): bun.lock @xoroh/axis sha512 "AAAA…" does not match active tarball "yoNjjvL9…"` exit 1.
   - Restore → `check:stale-tarball passed: active tarball is axis-82c3179.tgz (sha512:yoNjjvL9…), all package manifests and lockfile agree.`
   - The check is wired into CI (`kern` job, after `check:stale-refs`).
3. **PASS** — bun install from a clean clone resolves the new tarball
   (frozen lockfile, 1100 packages); the lockfile's sha512 for
   `@xoroh/axis` equals the hash of the committed tarball bytes, and the
   gate re-verifies that equality on every run.
4. **PASS** — no consumer regression: packages/kern (vitest), kern-native
   (vitest + jest RNTL, 449 tests), kern-cli init scaffold (46 tests),
   site build/typecheck/check:docs, e2e (26 specs), mobile typecheck +
   Expo bundle all green (commands above).
5. **N/A (visual)** — PR1 changes no rendered output: the tarball refresh
   alters behavior only where consumers already call the API; screenshots
   are owed on PR2/PR3 where visual changes are possible.
6. **PASS (behavioral, in-repo evidence)** — both renderers' full suites
   pass against the fresh dist with zero casts added; `check:consumption`
   re-verifies import legality against the new 286-name surface.

## Stale-tarball gate — CI/

`.github/workflows/ci.yml` (kern job):

      - name: Check vendored tarball references are current
        run: bun run check:stale-tarball

`package.json`:

      "check:stale-tarball": "node scripts/check-stale-tarball.mjs"

## What's still weak (honest)

- `check:stale-tarball` matches `axis-<7-8 hex>.tgz` patterns by name to
  detect stale references in tracked files. A reference to a tarball
  under a completely different name pattern (e.g. `axis/old.tgz`) would
  be missed; only the manifest/lockfile pins protect those paths today.
- The gate reads bun.lock's `@xoroh/axis` line with a regex rather than a
  real lockfile parser; a bun.lock format change in the target line's
  shape would need the regex updated. It fails loudly (exits 1) if the
  line can't be parsed, so silent drift is not possible.
- `node scripts/pack-vendor.mjs` is run manually; nothing in CI proves
  the committed tarball reproduces bit-for-bit from Axis `82c3179`
  (pack-vendor's own equality assertion would be the follow-up).
- `.reports/latest.md` was updated by commit `0007e99a` but its opening
  baseline lines still narrate the pre-#61 `kern-m3` branch state; it is a
  point-in-time log, corrected by this report and the roadmap addendum.
- Old `kern-primitives` tarball-era docs snapshots (`apps/site/src/domains/
  primitives/`) are honest about the historic `bed35547` pin only through
  generated content now regenerated from `82c3179` — the weekly-edge
  claims pages were regenerated and verified by `check:generated`.

## Gaps for other leads

- Axis Lead: nothing blocking; `pack-vendor.mjs` worked first-try. One
  friction note: the script shells out to `bun run --filter` which fails
  with exit 127 `tsup: command not found` when the target checkout
  hasn't run `bun install` yet — the error message doesn't hint at that
  being the cause (logged to `.reports/axis-api-friction.md`).
- Site/thread lead: `apps/site/src/generated/props.ts` now carries the
  82c3179 surface; the design pass (200a0163) may want `Toast` API docs
  once PR3 adopts them.
- Owner: publish timing unchanged — `vendor/axis/` deletion remains
  gated on first authorized `@xoroh/axis` publish (D-DEP).

## Suggested next item

PR 2 — adopt Axis `render` composition in `packages/kern` (drop the
`button.tsx` ~568 anchor-props cast and the `command.tsx` ~69
`items`/`filter` casts — seed already validated green against the new
tarball) and remove the native slot-merge workarounds in
`packages/kern-native`'s button/icon-button.
