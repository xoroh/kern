# Preview NO-GO checklist (KERN-083) — UNSIGNED

Status: drafted 2026-10-13 by the implementing agent. This list GOES GREEN
only with explicit owner sign-off per line. An unsigned checklist is not a
release; publishing on this document alone would bypass every approval the
plan requires.

## Gates (all green on the candidate tree)

- [x] All 11 root contract gates pass (layers, coverage, kern, parity,
  elevation-parity, consumption, contrast, theme-matrix, registry-paths,
  generated, workflow).
- [x] `bun run check:docs` exits 0 (22 sub-gates).
- [x] Unit suites: tokens 150, primitives 194, kern 806+, icons 85, native
  Vitest 95 + Jest 449, contracts 23, CLI 26, MCP 29, scripts 29+.
- [x] Site typecheck + production build; mobile typecheck + Metro export;
  full 21-test browser suite.
- [x] Consumer fixtures ALL GREEN (8 tarballs, no workspace: leakage;
  standalone install/typecheck/SSR; nested workspace; tarball source add;
  native rows).
- [x] `check:pack`, `preflight:publish`, per-package `check:publish` green.

## Blocking findings (must clear before GO)

- [ ] Dependency advisories: 19 GHSA hits in the toolchain graph
  (`@modelcontextprotocol/sdk` OAuth, `sharp`/librsvg, `node-forge`,
  `source-map-js`, `shell-quote`, `braces`, esbuild). None is in the shipped
  component runtime path, but the release MUST record triage per advisory
  (upgrade, replace, or waive with reason) — "dev-only" is a triage outcome,
  not a default.
- [ ] Device runs: no simulator/device or screen-reader pass exists for the
  native renderer. RNTL + Expo export are not a device.
- [ ] Governance/support/namespace readiness (KERN-082): owner decision.
- [ ] Publication authorization (KERN-084): explicit owner action. Release
  variables stay disabled; no credentials were created or used.

## Release hygiene (done)

- [x] Every package ships LICENSE + README (check-pack).
- [x] Icon Apache-2.0 terms + NOTICE ship in `@xoroh/kern-icons`.
- [x] Changesets parse (`changeset status` green); implementation changeset
  filed (minor contracts/CLI, patches elsewhere).
- [x] Tarball hashes + releaseSet recorded (consumer report + CLI payload).
- [x] Preview notes drafted (`docs/planning/PREVIEW_NOTES.md`) with truthful
  limitations and upgrade guidance.
