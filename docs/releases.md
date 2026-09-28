# Releases

Changesets. Each publishable package (`@xoroh/kern`, `@xoroh/kern-emdash`,
`@xoroh/kern-mcp`) versions independently; `@xoroh/kern` subpaths release
as one.

## Flow

1. Every PR touching `packages/` adds a changeset: `bun run changeset`
   (patch/minor/major per package).
2. Push to `main` → the release workflow opens/updates a **Version Packages**
   PR (bumps + changelog). Nothing publishes yet.
3. Merge the Version Packages PR when a batch feels ready → publishes to npm
   with provenance. Check status anytime: `bun x changeset status`.

## One-time setup

- `NPM_TOKEN` repo secret (granular token, publish on `@xoroh/*`).
  See `TODO.md` (local-only).

## Conventions

- `0.x` = unstable, anything may break. `1.0.0` = stability promise.
- First release per package goes out as `0.1.0` (minor changeset on `0.0.0`).
