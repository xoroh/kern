---
"@xoroh/kern": patch
---

Document the primitive parity contract and ratify how a component is counted.

No runtime change: no export, prop, token, or behaviour changes. This is the
P2b-1 deliverable — the per-behaviour contract between the web and React Native
renderer families.

- **`docs/parity-contract.md`** — one row per behaviour: `component · behaviour ·
  web contract · native contract · M3 source · test pointer`, covering the 26
  native-only concepts (needing a web version) and the 34 web-only concepts
  (needing a native version). Contracts are stated as `role` / label / state and
  never as primitive internals, so a future behavior-primitive ruling cannot
  invalidate a row.
- **`docs/conventions/parity.md`** — ratifies the **concept rule**: counts are
  stated in concepts, never in source files, resolved against the generated
  registry in `packages/mcp/src/manifest.ts`. A name is a sub-part only when
  stripping a part suffix yields a name already registered on the same platform.

Four differences are recorded as **deliberate asymmetries**, not gaps, so a
parity gate does not flag them as missing work: `sonner` → native `Snackbar`
(D-026/S1.3 — web `Sonner` is `Snackbar`'s imperative API over the same toast
manager), `kbd` (no touch analogue), and `native-select` (RN form is the platform
`Picker`). `preview-card` has no M3 source and is referred to `review-m3`.