---
"@xoroh/kern-primitives": patch
---

Repoint every `useControllableState` consumer at the primitives layer, and
delete both per-renderer copies.

This is what makes the previous commit more than additive. The hook existed as
two byte-identical files -- `packages/kern/src/utils/` and
`packages/kern-native/src/utils/` -- so the "shared kernel" was never shared and
a web/native divergence would have been invisible until a consumer misbehaved.
There is now one implementation.

18 consumer files across both renderers, plus the package dependency in each
(`workspace:*` in `dependencies`, per the D-034 ruling: internal packages are
real dependencies, not peers, so the build order derives from the graph).

`@xoroh/kern-primitives` re-exports `useControllableState` and `StateAction`;
neither renderer exported the hook publicly before, so no public API changes.

Verified: `test:all` PASS -- 268 web, 41 native, 76 icons, 39 tokens, 15 new
primitives -- so the repointed consumers behave identically through the shared
implementation rather than merely compiling. `check:primitives` PASS,
`check:layers` PASS (both renderers now correctly depend on a layer-0 package),
`check:parity` PASS after registry regeneration, `typecheck` PASS.

`bun install` still trips the D-034 build-order defect (kern's `prepare` runs
before its dependency's `dist` exists). That is the fix already routed to
kern-release-bot and is independent of this change; it was reproduced here
because this commit is the first to add a real cross-package build edge.