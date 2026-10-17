# Report: PR 1 — Refresh vendor/axis to 82c3179 and wire stale-tarball check

Date: 2026-10-17
Branch: `chore/axis-vendor-82c3179`
Related: Part 1 of 3 for Kern adopting current Axis

## Overview
Refreshed the vendored Axis dependency from `bed35547` to `82c3179` packed directly from clean Axis worktree (`/home/novexo/Desktop/Business/xoroh-monorepo/axis-vendor-clean`).
Added an automated CI check `check:stale-tarball` enforcing that only the current tarball exists, all consuming package manifests and lockfile reference it, its sha512 matches, and zero orphan/stale `.tgz` files remain in `vendor/axis`.
Updated primitive docs and models checks in `apps/site/scripts/check-primitives-docs.mjs` to account for new exports (models, props, state).

## Key Artifacts & Changes
1. **Packed Tarball:**
   - Commit: `82c3179`
   - File: `vendor/axis/axis-82c3179.tgz` (179,541 bytes)
   - SHA512: `yoNjjvL9nVTzI+Gbl5GCoucZqK+iJ7XFawfnb1G1g6OfushoX6Wzo91ktQUUKNIwAqw5xsRV24H4vEpTKj8exw==`
   - Removed: `vendor/axis/axis-bed35547.tgz`
2. **References Updated:**
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

## Verification Gates
- `bun run typecheck`: Passed (all 6 packages: tokens, contracts, m3, kern, kern-native, kern-icons)
- `bun run check:stale-tarball`: Passed
- `bun run check:workflow`: Passed (27 gates invoked)
- `bun run check:stale-refs`: Passed (0 dead rules)
- `bun run check:consumption`: Passed (286 exported names)
- `bun run check:layers`: Passed
- `bun run check:kern`: Passed (45/45 M3 roles)
- `bun run check:parity`: Passed (418 registry rows match)
- `bun run check:currency`: Passed (14 claims pass)
- `bun run lint`: Passed (Biome 0 errors)
- `bun run test`: Passed
- `bun run test:native` & `bun run test:native:jest`: Passed (50 test suites, 449 tests)
- `bun run --cwd packages/kern-cli test`: Passed (6 files, 46 tests)
- `bun run --cwd apps/site check:docs`: Passed
- `bun run --cwd apps/site build`: Passed
