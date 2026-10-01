---
"@xoroh/kern-mcp": patch
---

Release plumbing and workspace dependency reconciliation.

`@xoroh/kern-mcp` now builds with `tsup` (`--format esm,cjs --dts
--dts-resolve`) instead of a bare `bun build`, so the package ships real
`exports`, `main`, `module`, `types` and a `./manifest` subpath with correct
`.d.ts`/`.d.cts` pairs. Before this, `check:publish` could not pass: publint
reported the declared entry points as missing files. Also adds `engines.node
>=20.19`, `LICENSE` in `files`, and a `git+https` repository URL.

New `scripts/preflight-publish.mjs`, wired into `check:publish` and into CI,
asserts that no published manifest carries a `workspace:` specifier in a
shipped dependency field.

`packages/kern-native` fixes `test:jest`, which could not run at all:
`react-native >= 0.86` no longer bundles a `jest-preset.js`, so
`@react-native/jest-preset` is now an explicit devDependency with the
react-native path pinned per package. Per K-05's rule, the internal
`@xoroh/kern-theme` dependency moves from `dependencies` to
`peerDependencies` (+ a devDependency for local builds) so the published
tarball never carries a `workspace:` specifier.

`bun.lock` is reconciled against every manifest in the workspace and is
verified deterministic (`bun install --frozen-lockfile` reports no changes).

**NOTE — licence flag, needs a founder ruling.** `packages/kern/package.json`
carries `"license": "Apache-2.0"` in this commit while `LICENSE`,
`packages/kern/LICENSE`, `README.md` and `GOVERNANCE.md` all say MIT. This was
already in the working tree before this commit; it is preserved verbatim, not
adopted. Reverting or confirming it is a licence change and is founder-gated.