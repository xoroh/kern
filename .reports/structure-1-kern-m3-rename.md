# Structure (1): rename `kern-material-3` → `kern-m3` — plan note

Date: 2026-10-16. Owner decision D-STRUCTURE as refined: per system a
platform-free preset package (`kern-m3`, renamed from `kern-material-3`)
plus separate web and native widget packages; `kern-tokens` stays the
shared engine; `@xoroh/kern` is NOT renamed. Large PR, opened unmerged
for Kern Lead review. No publish, no version bumps, no tags.

## Why rename at all

`kern-material-3` names the system inline in every import, manifest, and
script path. With 10+ systems coming, the preset package must read as one
system slot among many (`kern-m3`, `kern-<next>`), not as the foundation
itself. The tokens engine (`kern-tokens`) is already system-neutral; this
rename completes that split on the preset side.

## Compat: hard rename, no alias (decision 010)

Owner decision `docs/decisions/010-kern-m3-rename-and-no-global-registration.md`
(accepted): hard rename, no compat alias — nothing is published (see 020).
An earlier draft of this note proposed a re-export stub ("keep compat");
that is WITHDRAWN: it contradicts both 010 and ADR-007, and a stub would
need permanent CI/publish maintenance for zero consumers. Internal
filenames (`material-3.ts`, `themes/material-3.json`, theme id
`"material-3"`) do NOT rename: they are not import surface (exports map
is), and churning them adds diff without meaning. Revisit if a second
system lands.

## Blast radius (all in this PR)

- `git mv packages/kern-material-3 packages/kern-m3` + manifest
  (`@xoroh/kern-m3`, same version/exports/license/files).
- 89 referencing files: `@xoroh/kern-material-3` → `@xoroh/kern-m3` in
  source imports (kern, kern-native, tokens, cli, mcp, site scripts),
  `packages/kern-material-3` → `packages/kern-m3` in scripts/CI/manifests,
  subpath JSON imports (`themes/*.json`), CLI scaffold `file:` specs +
  init tests, root test/typecheck fan-outs, CI matrix leg, preflight list,
  check:publish fan-out.
- Docs/prose: versioning.md, releases.md, CHANGELOG Unreleased, roadmap
  D-STRUCTURE, skills where they name the package, content
  `foundations/tokens.ts` where it names the package (theme-id prose
  untouched — preset names do not change).
- Verification: full build, both typechecks, both native runners, lint,
  freshness, check:docs, check:kern, check:elevation-parity,
  check:publish, changeset status. No changeset (pre-publish
  rename, no user-facing surface change — versions stay 0.0.0).

## Explicitly NOT in this PR

Second-system packages, `--system` flags, the unified registry, URL
changes, the Button M3 rename, HCT. Those are structure (2)–(4) and later.
