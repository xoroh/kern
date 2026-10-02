---
"@xoroh/kern": patch
"@xoroh/kern-native": patch
"@xoroh/kern-primitives": patch
"@xoroh/kern-mcp": patch
---

Ship-installable manifests: no `workspace:` protocol can reach a published
tarball, and internal packages now ship real semver ranges.

Three rulings from the D-035/D-036 release-semantics arc, all found by the
publish gate:

- **D-035** — `@xoroh/kern-primitives` was declared `"workspace:*"` in
  `dependencies` of both renderers. npm does not rewrite the protocol on pack,
  so every consumer install of the published `@xoroh/kern` or
  `@xoroh/kern-native` died with `EUNSUPPORTEDPROTOCOL`. Now `"^0.0.0"`, which
  matches the workspace package's own version, so the monorepo still links
  locally.
- **D-036** — `@xoroh/kern-tokens` was a `peerDependency` (`"*"`), which
  expresses *install* order but not *build* order. It is now a real dependency
  in both renderers, also `"^0.0.0"`. Substitutable hosts (`react`, `react-dom`,
  `react-native`, `@base-ui/react`) deliberately **stay** peers — the line is
  substitutability, and a consumer swapping kern's own token engine would get
  colours kern's components do not assume.
- **Undeclared-dependency fixes** so a clean checkout builds without hoisting:
  `bun-types` (`@xoroh/kern-mcp`, required by its tsconfig `types[]`) and
  `axe-core` (`@xoroh/kern`, imported by `accessibility.test.tsx`) were
  required by source but declared by no manifest. `jest` and
  `@testing-library/jest-dom` are likewise now declared by `@xoroh/kern`.

No behavioural change for consumers: the same versions resolve, the same code
ships, and the tree is finally installable from a fresh clone.