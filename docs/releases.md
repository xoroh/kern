# Releases

Status: current

Changesets. Six packages publish; each versions independently.
`@xoroh/cli` is private and never published.

| Package | Directory | Public | First release |
|---|---|---|---|
| `@xoroh/kern` | `packages/kern` | yes | `0.1.0` |
| `@xoroh/kern-theme` | `packages/kern-theme` | yes | `0.1.0` |
| `@xoroh/kern-native` | `packages/kern-native` | yes | `0.1.0` |
| `@xoroh/kern-icons` | `packages/kern-icons` | yes | `0.1.0` |
| `@xoroh/kern-start` | `packages/kern-start` | yes | `0.1.0` |
| `@xoroh/kern-mcp` | `packages/mcp` | yes | `0.1.0` |
| `@xoroh/cli` | `packages/cli` | no (`private: true`) | — |

`@xoroh/kern` subpaths (`.`, `./theme`, `./tokens`, `./utils`) release as one
version — the `exports` map is the unit, not the file.

## Flow

1. Every PR touching `packages/` adds a changeset: `bun run changeset`
   (patch/minor/major per package). A PR that only changes `docs/`,
   `.agents/`, or root markdown needs none.
2. Push to `main` → the release workflow opens or updates a **Version
   Packages** PR (bumps versions + rewrites `CHANGELOG.md`). Nothing publishes
   yet.
3. Merge the Version Packages PR when a batch feels ready → publishes to npm
   with provenance.

Check what is pending at any time: `bun x changeset status`.

## Verifying a package before it publishes

`bun run check:publish` runs `publint` + `attw --pack` across all six
publishable packages. It catches the failures that only appear after
`npm pack`: broken `exports` conditions, missing `types` for a condition,
side-effect files missing from `files`. Run it before merging any change that
touches `package.json` `exports`, `files`, or `peerDependencies`.

## One-time setup (founder-gated; do once, then ignore)

- Push the release workflow: `gh auth refresh -s workflow` (interactive),
  then `git push`. Needed once — the token that created it lacks the
  `workflow` scope for workflow files.
- `NPM_TOKEN` repo secret (granular token, publish on `@xoroh/*`):
  repo Settings → Secrets → Actions. Without it the release workflow
  versions but never publishes.

Publishing itself (`bun run release`, i.e. `changeset publish`) is
founder-gated. Prepare and verify; do not publish.

## Conventions

- `0.x` = unstable, anything may break. `1.0.0` = stability promise.
- First release per package goes out as `0.1.0` (minor changeset on `0.0.0`).
- One changeset may name several packages — the packages-split changeset did.
  Name exactly the packages whose **public surface or behavior** changed;
  a private refactor inside one package does not need its neighbours listed.
- Deleting a `.changeset/*.md` file that is not a changeset breaks
  `changeset status` and therefore the release. See
  [`conventions/changesets.md`](conventions/changesets.md).