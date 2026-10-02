---
"@xoroh/kern": patch
"@xoroh/kern-tokens": patch
"@xoroh/kern-native": patch
---

Build lifecycle: order is now derived from the dependency graph, and a clean
checkout installs.

Three changes, none of which alter the published output:

- **`prepare` removed** from `@xoroh/kern`, `@xoroh/kern-native` and
  `@xoroh/kern-tokens`. `prepare` exists so a package installed *from git* gets
  built during install; inside a workspace bun links workspace packages
  directly, so nothing needs building to be linked. What it was actually buying
  was a second, parallel, unordered build inside `bun install` — a race in which
  a package's DTS step could run before its dependency had emitted `.d.ts`,
  leaving a JS-only `dist`.
- **`scripts/build-order.mjs`** topologically sorts the buildable packages from
  their declared `@xoroh/*` dependencies and builds them in that order, failing
  loudly on a cycle. The root `build` no longer hard-codes
  primitives → tokens → kern → native → icons → mcp; that literal was a
  hand-ordered chain, a second source of truth that silently rots when a package
  is added. Add a dependency and the build order follows.
- **`check:cold`** now performs the full cold property — wipe `node_modules` and
  every `dist`, frozen install, graph-ordered build, then assert every declared
  export exists. It is the gate that caught all of this; it is also the gate
  that must run in CI, because every defect in this arc was invisible locally
  and visible only from an empty `dist/`.

Installing a git checkout of an internal package no longer builds it during
install; run `bun run build` first.