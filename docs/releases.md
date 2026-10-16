# Releases

Status: current

Changesets. Eight packages publish; each versions independently.
`@xoroh/kern-primitives` is internal (`private: true`) and never publishes.

| Package | Directory | Public | First release |
|---|---|---|---|
| `@xoroh/kern` | `packages/kern` | yes | `0.1.0` |
| `@xoroh/kern-tokens` | `packages/kern-tokens` | yes | `0.1.0` |
| `@xoroh/kern-material-3` | `packages/kern-material-3` | yes | `0.1.0` |
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

## Preflight: internal dependencies are peerDependencies, never `workspace:*`

Requested by K-05 and enforced by `scripts/preflight-publish.mjs`, which runs
as the last step of `bun run check:publish` (and standalone as
`bun run preflight:publish`).

**The rule: an internal `@xoroh/*` dependency that ships must be declared in
`peerDependencies` with a real range. `workspace:` is never allowed in
`dependencies`, `peerDependencies` or `optionalDependencies` — only in
`devDependencies`.**

Why it must be a peer: `kern-tokens` ships the tokens and the theme runtime. A
consumer must resolve **one** instance of it. Two copies split the token
objects and scheme resolution apart and theming breaks in ways that are
miserable to debug. That is the definition of a peer dependency. The same
applies to `kern` for `/kern/start`.

Why `workspace:*` cannot be shipped: **npm does not rewrite the `workspace:`
protocol on pack** — only pnpm and yarn do. A `workspace:*` spec in a shipped
field therefore lands **verbatim** in the tarball and every consumer install
dies:

```
npm pack <pkg> && npm i <pkg>.tgz
-> npm error code EUNSUPPORTEDPROTOCOL  Unsupported URL Type "workspace:"
```

`publint` and `attw` do not catch this: they lint the manifest, not the packed
tarball. That is the whole reason `preflight:publish` exists.

### How Kern does it

```
packages/kern        peerDependencies  @xoroh/kern-tokens: "*"
                     devDependencies   @xoroh/kern-tokens: "workspace:*"
packages/kern-native peerDependencies  @xoroh/kern-tokens: "*"
                     devDependencies   @xoroh/kern-tokens: "workspace:*"
packages/kern/src/start  peerDependencies  @xoroh/kern: "*"
                     devDependencies   @xoroh/kern: "workspace:*"
```

The `devDependencies` copy is what makes the monorepo resolve locally; the
`peerDependencies` copy is what the consumer sees. Both are required.

### Tightening the range

The `"*"` ranges are deliberate **for 0.1.0 only**, and they are the last open
item on this rule: every package is still at `"version": "0.0.0"`, so a
`^0.1.0` range would exclude the only version that actually exists. The
tightening to `^0.1.0` happens in the same commit that first sets `0.1.0`.
Ruled and parked in `.team/reports/S1-rulings.md` §S1.4 — do not write the
range early, and do not "fix" it to `^0.1.0` before the bump lands.

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
