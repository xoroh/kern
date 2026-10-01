---
"@xoroh/kern": minor
"@xoroh/kern-tokens": minor
---

D-034: the package map is now `primitives -> tokens -> renderers`.

Two structural moves, both breaking, both free while every package is `0.0.0`:

**1. `@xoroh/kern-theme` -> `@xoroh/kern-tokens`.** The package is a token engine
plus the M3 conformance gate (`tokens`, `resolveThemeDetails`, `ResolvedTheme`,
the spacing/typography/shape scales, `check:m3`). It ships no visual theme —
light and dark exist as *schemes* resolved from it. The old name promised
something the package does not contain.

It stays separate, and the reason is structural rather than stylistic: it is the
one layer BOTH renderers need, so it must sit beneath both. Folding it into
`@xoroh/kern` would force `kern-native` to import the web package, inverting ADR
002's renderer boundary and pulling `react-dom` and Base UI into a React Native
bundle. MUI, Radix, Tamagui and shadcn all keep the same layer separate.

**2. `@xoroh/kern-start` -> the `@xoroh/kern/start` subpath.** 1,365 LOC, one
internal consumer, and the same renderer as core — it was React components for a
second framework, so a package boundary (which promises independent versioning)
was a promise it could not keep. It is now `packages/kern/src/start`, served by a
`./start` export. Its 15 tests run as part of `@xoroh/kern`.

The five component files imported `cn` from `"@xoroh/kern"`, which was correct
from a separate package and self-referential once they were core; that became
`../utils/cn`.

Verified: `typecheck` PASS (all four packages) · `test:all` PASS · `lint` PASS ·
`build` PASS (all four) · `check:parity` PASS · `check:m3` PASS · registry
regeneration clean · and `@xoroh/kern/start` imports successfully from a real
consumer with all symbols present.

**Pre-existing defect found and disclosed, not fixed here:** `@xoroh/kern`'s
`dts-resolve` build fails when `packages/kern/dist` is absent, because its
`prepare` script runs `tsup ... --dts-resolve` and the DTS step resolves
`@xoroh/kern-tokens` through `dist`. Confirmed present on the parent commit with
this change fully stashed, so it predates it. It only appears in a clean tree
(`dist/` is gitignored), which is why CI would hit it and local runs did not.
Owner: `kern-release-bot` with the publish gate.
