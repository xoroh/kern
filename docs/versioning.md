# Kern versioning story

How Kern versions are decided, written, and shipped — and where the line is
between describing a release and executing one.

> **Standing note:** publishing is founder-gated (see §6). This document
> describes the machinery; it never authorises a publish.

## 1. The shape

Kern versions **per package** with [changesets](https://github.com/changesets/changesets).
Every user-facing change lands with a changeset file; automation turns the
accumulated changesets into version bumps, changelog entries, and (when
enabled) npm publishes. Nothing is versioned by hand.

All packages sit at `0.0.0` today — nothing published yet. The first release
covers `@xoroh/kern-tokens`, `@xoroh/kern`, and `@xoroh/kern-native`
(see `CHANGELOG.md` → Unreleased).

## 2. The packages

| Package | Published | Notes |
|---|---|---|
| `@xoroh/kern-tokens` | yes | tokens + themes + tones, platform-free |
| `@xoroh/kern` | yes | web (React) components on Base UI |
| `@xoroh/kern-native` | yes | native (React Native) components |
| `@xoroh/kern-primitives` | yes | primitives |
| `@xoroh/kern-icons` | yes | icons |
| `@xoroh/kern-mcp` | yes | MCP server + manifest |
| `@xoroh/kern-cli` | no (`private: true`) | CLI tooling, never published |

Public packages carry `publishConfig: { access: public, provenance: true }`
(see e.g. `packages/kern/package.json`).

## 3. Writing a changeset

Add a Markdown file under `.changeset/` named after the change, e.g.
`.changeset/fix-acronym-slugs.md`:

```md
---
"@xoroh/kern-primitives": patch
---

One-line summary a user would understand, then the why.
```

- Front matter maps **each affected package** to `patch`, `minor`, or `major`.
- `patch` = fix, `minor` = new feature, `major` = breaking change.
- One changeset may bump several packages at different levels.
- Say what the user gets, not what the diff does.

Repo config (`.changeset/config.json`): `access: public`,
`baseBranch: main`, `updateInternalDependencies: patch`, no `fixed` or
`linked` groups, nothing ignored. Internal dependency bumps ride along as
patches.

## 4. The version PR

When release automation is enabled, merging to `main` opens (or updates) a
`chore: version packages` PR via `changesets/action@v2`
(`version-script: bun run version-packages`). That PR:

- bumps each package version per the accumulated changesets,
- consumes the changeset files,
- writes per-package history to `packages/*/CHANGELOG.md`.

`CHANGELOG.md` at the repo root records **repo-level changes only** — it is
not the per-package history. Merging the version PR is what makes versions
real in git; publishing to npm is a separate step (§5).

## 5. Publish

`publish-script: bun run release` runs `changesets/action` publish with npm
provenance (`PUBLISH_PROVENANCE: 'true'`, `id-token: write` on the workflow,
Trusted Publishing on the npm side). Full flow lives in
`.github/workflows/release.yml`:

`push to main` (or `workflow_dispatch`) → install → build publishable
packages → `check:publish` verify → version PR or publish.

## 6. The gate (founder HOLD)

Release automation is **build + verify only** until the repo variable
`RELEASE_CHANGESSETS` is set to `'true'` — and Actions PR creation stays off
with it. The workflow says so in plain text:

> Founder HOLD / no Version Packages or publish until
> RELEASE_CHANGESSETS=true is set … do not set this while publish hold is on.

Until the founder orders it: write changesets, merge version PRs, keep every
package truthful (`files`, README, LICENSE present) — but no version
packages, no `npm publish`, no `@xoroh/kern*` 0.1.0.

## 7. Pointers

- Changesets awaiting release: `.changeset/`
- Config: `.changeset/config.json`
- Repo-level changelog: `CHANGELOG.md` · per-package: `packages/*/CHANGELOG.md`
- Release workflow: `.github/workflows/release.yml`
- Release notes process: `docs/releases.md`
