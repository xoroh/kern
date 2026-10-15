# Distribution, CLI and registry

Status: executable target design. Today the CLI is private/checkout-bound; standalone installation has not been proved by this planning pass.

## Package delivery

Preserve dual ESM/CJS with typed conditions and native export conditions. Public barrels, not deep source paths, are contracts. `/start` remains one web package version. Add a publishable CLI (build/bin/files/runtime declaration, bundled registry/templates), and contracts package; include both in build-order, CI and preflight. Current public set is six, target set eight. Do not publish placeholder source-distribution claims from a bin that still reads `../../../packages`.

Supported layouts: independent web/RN repository and nested multi-app workspace. Acceptance uses packed artifacts installed without Kern checkout aliases, not only `file:` references. During prepublish dogfood, Xoroh can use verified local tarballs or an owner-controlled prerelease feed; public npm availability is not a prerequisite for early migration. Tarball tests must rewrite compatible internal packages to local test artifacts only inside disposable fixtures and also verify actual declared publication ranges, avoiding a fake registry test that hides missing dependencies.

Review runtime externalization: `kern` tsup currently externalizes tokens but not explicitly primitives; native build likewise does not explicitly externalize all internal packages. Verify identities/contexts and require peers for shared stateful runtime singletons. Agree the updated ordinary-pure-dependency exceptions in `docs/releases.md`/preflight before claiming conformity. Keep React/RN/Base UI host-compatible peer constraints; no shipped `workspace:*`, source aliases, `file:` absolute developer paths or `0.0.0` compatibility placeholders in release manifests.

## CSS delivery decision

Current web utilities are compiled by site Tailwind with a private `@source` directory not shipped in `kern` files; `./theme` contains a removed package import. Default package setup must become:

```css
/* Proposed public entries, not available as a verified release today. */
@import "@xoroh/kern/theme";
@import "@xoroh/kern/styles";
```

`theme` includes compatible ordinary token variables and component keyframes; `styles` is deterministic precompiled component/composition CSS, excluding application reset and optional font loading. Emit a named layer and publish order/override rules; exercise clsx/tailwind-merge/custom `className` overrides when host Tailwind generates overlapping utilities. Avoid global resets and a second application utility build. Token package's `theme` becomes ordinary CSS; explicit `tailwind` adapter supplies Tailwind 4 theme integration. Preserve public CSS custom-property names. Verify no unresolved package imports, `@theme`, `@source`, unsupported at-rules or missing keyframes in the default browser artifact.

Source installs use a generated explicit `@source` of the consumer's local component destination plus one foundation theme, or generate local compiled source CSS for non-Tailwind consumers. Monorepo paths are relative to the selected app CSS entry, not the shell cwd. Optional Tailwind content scanning for package mode can remain an advanced recipe, never the only supported default.

## Registry artifact

Use one versioned JSON schema from contracts and a generated release payload: components, compositions, blocks, foundations, icons, npm/version requirements, platform files, assets, styles, import rewrites, examples, compatibility, source hashes and license notices. Author semantic requirements beside source; infer static imports/exports/props with TypeScript parser. Do not use regular-expression parsing of TS object formatting at install time (`kern-cli/src/manifest.ts`, `blocks.ts` today).

Keep three block TSX sources as authored artifacts; move or publish their registry ownership outside the site bundler **only during authorized implementation**, while site previews consume identical bytes. No extra runtime block package is needed. Current block manifests list `registryDependencies` but installers do not install their component closure. Target block modes:

1. **Package-backed block**: copy block source, install compatible package components; preserve `@xoroh/kern`/`/start` imports.
2. **Source-backed block**: resolve all registry/component/file dependencies, vendor required component/composition graph and rewrite imports to local entrypoints. Cannot silently fall back to package UI.

Both declare provider `m3`, renderer, themes/tokens/icons, required capabilities, npm ranges and assets. Native-equivalent blocks need real authored sources/previews if advertised; unsupported web block on native fails early with an alternative, not an empty installation. The manifest's ordered graph must detect cycles, conflicting versions, unsupported platforms, missing files/assets, name collisions and undeclared imports. Deduplicate shared foundations by destination and releaseSet.

## Installation modes and dependencies

Default **hybrid** source mode means app-owned UI source with shared tokens/primitives/icons as package dependencies. Bare external modules are installed at compatible recorded ranges; installation prints or applies a reviewed plan rather than executes untrusted postinstall instructions. React/RN/Tailwind/Metro are host requirements. Standard `kern add` must choose renderer before registry row lookup; current first-by-name selection can select web when native has the same name.

Full **snapshot** (`--self-contained`) vendors token runtime + CSS + schemas/theme JSON + necessary primitive/icon modules/assets and rewrites their internal imports using AST transforms. Exact upstream versions/license provenance remain in receipt. If a user chooses style-only snapshot, name it explicitly and pin matching runtime packages; do not silently pair frozen CSS with drifting runtime values. Current block self-contained instructions copy no token CSS, and component self-contained only copies CSS, so neither is proof of full isolation. Third-party React/Base UI/RN/SVG remain required dependencies even in full snapshot mode; never call it zero-dependency.

Resolver requirements: relative files, extension substitutions for `.js` imports, directory indexes, JSON, CSS imports, static assets, type-only dependencies, package self imports, export conditions, platform suffixes (`.native`, `.ios`, `.android`, `.web`), literal dynamic imports and `require`. Unresolved/nonliteral imports require a declared manifest dependency or hard refusal. Path escapes, symlinks outside payload, URL payloads and overwrite conflicts are rejected. Source-installed `/start` must not depend on the entire provider barrel accidentally; compute/export local symbols with deterministic import mapping.

Native is supported in this release scope: Metro discovers installed TS/JS assets, RN/SVG export conditions, font host loader setup, peer compatibility, safe-area/gesture host configuration where truly needed. Avoid adding an Expo package merely to solve generic RN distribution. A tested Expo starter plus an RN-host consumer smoke is required; RN-web gallery is supplemental only.

## CLI commands/configuration (proposed)

Current verbs: `init`, `add`. Proposed additive verbs: `list`, `info`, `plan`, `diff`, `upgrade`, `validate`; current messages refer to some of these before they exist.

`kern.json` schema contains renderer/provider, delivery mode, selected workspace/app, source destination/import alias, CSS entry/style strategy, token/theme/icon mode, registry/version/integrity and receipt location. Detect package manager/workspace; show choices if ambiguous; never place dependencies in workspace root when the chosen app owns them. `init --platform web|native --mode package|source` defaults to registry artifacts after release; `--from` remains explicit development-only checkout mode. `--dry-run` emits structured plan, files/npm/config/style changes and reasons. Unsupported/malformed options fail, not silently ignored flags.

Receipt v2: schemaVersion, releaseSet/package versions/provider/renderer/mode, registry integrity, installed symbols, every closure file's upstream/current hashes, owner/shared dependencies, original baseline for three-way diff, assets/licenses and configuration outputs. Preserve v1 migration compatibility. Record identical pre-existing shared files too; current `continue` paths do not add those files to the new component receipt. Re-adding identical payload is idempotent, not an upgrade error after partial work.

All mutation commands use **resolve → validate → inspect incumbent/receipt → stage → commit atomically**. Late missing asset, version mismatch or customized file leaves the destination byte-identical; writes never precede conflict checks. Rollback only staged/this-command files, not user work. `upgrade` defaults to diff/dry-run, proposes three-way merge, backs up receipts/files, refuses unresolved conflicts and never deletes custom code. Do not tell users to delete owned files to re-add. Dependency installers require explicit confirmation separately from copying.

## Real consumer matrix and acceptance

P4 tasks `KERN-033`–047 implement/test this matrix:

| Layout/renderer | Package | Hybrid source | Full snapshot | Block |
|---|---|---|---|---|
| standalone web (with/without Tailwind host) | build, types, computed styles, SSR | complete closure/config and build | no Kern runtime import leakage, theme goldens | all three current blocks in both modes |
| nested workspace web | app-local deps, shared versions, hoisting-independent styles | deterministic path/alias resolution | receipt shared ownership | closure de-duplication |
| standalone Expo/RN | Metro/native SVG/fonts export | platform-specific files + assets | private path/runtime leak detector | real native block fixture or explicit unsupported metadata |
| multi-app workspace RN | Metro/peer/React singleton | app selection + Metro asset handling | independent destinations | provider/platform refusal tests |

Current commands: CLI `bun run --filter @xoroh/kern-cli test`, typecheck; root `check:publish`, `preflight:publish`, `check:pack`, `check:dist`, `check:dist:types`; site `node apps/site/scripts/check-blocks.mjs`. These do not cover the proposed matrix. Add CI fixture runner and packed-artifact installation suites; no success claim until actual install/build/render/validation was run. Preserve custom-source bytes under failed upgrades and include source maps/declarations/NOTICE/license checks in tarballs.
