# Releases

Status: current

Changesets. Eight packages publish; each versions independently.
`@xoroh/kern-primitives` is internal (`private: true`) and never publishes.

| Package | Directory | Public | First release |
|---|---|---|---|
| `@xoroh/kern` | `packages/kern` | yes | `0.1.0` |
| `@xoroh/kern-tokens` | `packages/kern-tokens` | yes | `0.1.0` |
| `@xoroh/kern-m3` | `packages/kern-m3` | yes | `0.1.0` |
| `@xoroh/kern-primitives` | `libs/kern-primitives` | no (`private: true`, internal implementation package) | — |
| `@xoroh/kern-native` | `packages/kern-native` | yes | `0.1.0` |
| `@xoroh/kern-icons` | `packages/kern-icons` | yes | `0.1.0` |
| `@xoroh/kern-contracts` | `packages/kern-contracts` | yes | `0.1.0` |
| `@xoroh/kern-mcp` | `packages/mcp` | yes | `0.1.0` |
| `@xoroh/kern-cli` | `packages/kern-cli` | yes | `0.1.0` |

`@xoroh/kern` subpaths (`.`, `./theme`, `./tokens`, `./utils`) release as one
version — the `exports` map is the unit, not the file.

## Flow

1. Every PR touching `packages/` adds a changeset: `bun run changeset`
   (patch/minor/major per package). A PR that only changes `docs/`,
   `.agents/`, or root markdown needs none.
2. Push to `main` → the release workflow builds and verifies with a read-only
   token. Version PR creation and publishing remain disabled unless the
   `RELEASE_CHANGESSETS=true` Actions variable is explicitly enabled.
3. If that gate is ever authorized, the write-enabled job runs only from
   `main` and waits for approval in the protected `npm-publish` environment
   before opening/updating a **Version Packages** PR or publishing. Publishing
   remains founder-gated; do not enable the variable as part of routine setup.

Check what is pending at any time: `bun x changeset status`.

## Verifying a package before it publishes

`bun run check:publish` runs `publint` + `attw --pack` across all eight
publishable packages (primitives excluded: internal-only). It catches the failures that only appear after
`npm pack`: broken `exports` conditions, missing `types` for a condition,
side-effect files missing from `files`. Run it before merging any change that
touches `package.json` `exports`, `files`, or `peerDependencies`.

`check:publish` inspects the built output, so packages must already be built:
run `bun run build` first, or publint will fail on `exports`/`main`/`types`
entries that point at missing `dist/` files. The Release workflow runs
`bun run build` before its "Verify publishable packages" step for the same
reason (CI already builds each package before its own `check:publish`).

## Release dry run (no publish)

What a release would ship, without shipping it. Run from the repo root
after `bun run build`:

1. Pack every publishable package and read the file list:
   `cd packages/<name> && bun pm pack --dry-run`. The eight publishable
   packages are the table at the top of this file. `@xoroh/kern` and
   `@xoroh/kern-native` intentionally ship their `src/` trees (packed
   `kern add` vendors component sources from the tarball) — everything else
   ships `dist` plus declared data files.
2. Provenance: every publishable manifest carries
   `"publishConfig": {"access": "public", "provenance": true}`, and the
   release job runs with `id-token: write` plus `PUBLISH_PROVENANCE=true`
   (see `.github/workflows/release.yml`). `npm publish` without both emits
   no provenance attestation.
3. Changelog: `bun x changeset status` (read-only) shows what the pending
   `.changeset/*.md` files would release. First release per package goes
   out as `0.1.0` — while on `0.x`, land breaking changes as minors (see
   `docs/conventions/changesets.md`); a `major` on `0.0.0` would publish
   `1.0.0`, a stability promise this repo has not made.
4. Sweep for internal files: `bun run release-sweep`. Maintainers run it
   before a release and it must be green: it fails on reports,
   planning leftovers, scratch and stray tarballs in the repo, and on
   test, planning, audit or report files inside any pack output. It is
   not yet a CI gate. Never `npm publish`, tag, bump versions, deploy,
   or touch secrets as part of the dry run — preparation only.
5. Release-mode preflight: `bun run preflight:release`. Green means every
   shipped dependency resolves from the registry. Red today on the Axis
   vendor tarball (see Axis cutover below) — that red is the release
   blocker, not background noise.

## Preflight: internal dependencies ship with a real range, never `workspace:*`

Requested by K-05 and enforced by `scripts/preflight-publish.mjs`, which runs
as the last step of `bun run check:publish` (and standalone as
`bun run preflight:publish`).

**The rule: an internal `@xoroh/*` dependency that ships is declared in
`dependencies` with a real range — these are runtime needs, not peer
expectations. `workspace:` is never allowed in `dependencies`,
`peerDependencies` or `optionalDependencies` — only in `devDependencies`.**

Why `workspace:*` cannot be shipped: **npm does not rewrite the `workspace:`
protocol on pack** — only pnpm and yarn do. A `workspace:*` spec in a shipped
field therefore lands **verbatim** in the tarball and every consumer install
dies:

```
npm pack <pkg> && npm i <pkg>.tgz
-> npm error code EUNSUPPORTEDPROTOCOL  Unsupported URL Type "workspace:"
```

`publint` and `attw` do not catch this: they lint the manifest, not the packed
tarball. That is the whole reason `preflight:publish` exists. The gate packs
with npm (the tool `changeset publish` uses), so it inspects the artefact
consumers receive. npm is required to run it; without npm it says so and
exits instead of failing confusingly.

### How Kern does it

```
packages/kern        dependencies      @xoroh/kern-tokens: "^0.0.0", @xoroh/kern-m3: "^0.0.0"
                     devDependencies   @xoroh/kern-tokens: "workspace:*", @xoroh/kern-m3: "workspace:*"
packages/kern-native dependencies      @xoroh/kern-tokens: "^0.0.0", @xoroh/kern-m3: "^0.0.0"
                     devDependencies   @xoroh/kern-tokens: "workspace:*", @xoroh/kern-m3: "workspace:*"
packages/kern-m3     dependencies      @xoroh/kern-tokens: "^0.0.0"
                     devDependencies   @xoroh/kern-tokens: "workspace:*"
packages/mcp         dependencies      @xoroh/kern-cli: "^0.0.0", @xoroh/kern-icons: "^0.0.0"
                     devDependencies   @xoroh/kern-m3: "workspace:*"
packages/kern-cli    dependencies      @xoroh/kern-contracts: "^0.0.0"
```

The `devDependencies` copy is what makes the monorepo resolve locally; the
`dependencies` copy is what the consumer installs. Both are required.

### Tightening the range

The `"^0.0.0"` ranges move to `"^0.1.0"` in the bump commit: `changeset
version` rewrites internal ranges alongside the versions
(`updateInternalDependencies`). Do not write `^0.1.0` early, and do not
hand-edit the ranges — the version commit owns them.

### Release mode: no `file:`/`link:` in shipped fields

`bun run preflight:release` runs the same gate plus a registry-addressability
check: `file:` and `link:` specifiers in shipped fields fail. They resolve
inside this monorepo and break consumer installs exactly like `workspace:`.
It is red today on the Axis vendor tarball — see the Axis cutover below —
so it runs by hand before a publish, not in PR CI.

## Axis cutover (before Kern publishes)

`@xoroh/kern` and `@xoroh/kern-native` currently resolve `@xoroh/axis`
from a vendored tarball (`file:../../vendor/axis/*.tgz`), which works in
this monorepo and breaks everywhere else. Switch it in this order:

1. `@xoroh/axis` 0.1.0 is published first.
2. `kern` and `kern-native` switch `@xoroh/axis` from
   `file:../../vendor/axis/*.tgz` to `^0.1.0` from the registry, and
   `vendor/axis` is deleted.
3. Refresh `bun.lock`, then re-run all release gates: build,
   `check:publish`, preflight in release mode (`bun run preflight:release`),
   `release-sweep`.
4. Only then does Kern publish.

## Founder HOLD — build+verify only

While founder HOLD is on (npm publish / 0.1.0 timing), the Release workflow runs
Install → Build → Verify only. Version Packages PR creation and npm publish are
gated behind the repo Actions variable `RELEASE_CHANGESSETS=true` (and the
Actions permission to create pull requests). Do not enable that variable until
Faroeq lifts the hold.

## Release workflow protection

The workflow token is read-only by default. Only the gated release job gets
`contents: write`, `pull-requests: write`, and `id-token: write`. Manual
dispatches from non-`main` refs cannot enter that job. The `npm-publish`
environment is restricted to protected branches and requires approval from
the `release` team; administrators cannot bypass that gate. Store the npm
publishing credential as an environment secret there, not as a repository-wide
secret. The site deployment is likewise limited to protected `main` and waits
for approval in the `production` environment.

All third-party Actions used by this repository are pinned to full commit
SHAs, and repository settings require SHA-pinned Actions.

## Release workflow action

The Release workflow (`.github/workflows/release.yml`) uses the v2
`changesets/action`, pinned to a full commit SHA.
v2 renamed inputs (`version-script`, `publish-script`, `commit-message`, `pr-title`),
takes `github-token` explicitly, and no longer writes `.npmrc` from `NPM_TOKEN` —
npm auth is via `actions/setup-node` `registry-url` (plus Trusted Publishing /
`id-token: write` for provenance).

## Workflow maintenance

- Updating workflow files requires the GitHub OAuth `workflow` scope. Submit
  changes through a pull request; do not push directly to protected `main`.
- `NPM_TOKEN` environment secret (granular token, publish on `@xoroh/*`):
  repo Settings → Environments → `npm-publish`. Do not create or enable this
  secret while the founder hold is active.

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
