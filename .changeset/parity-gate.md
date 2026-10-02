---
"@xoroh/kern": patch
---

Add `check:parity`, a registry-backed gate for the web/native parity contract.

The parity contract (`docs/parity-contract.md`, P2b-1) was documentation. A doc
does not fail, so it drifts within a commit. This gate makes it falsifiable.

What it enforces:

1. **ADR 002 boundary** — `kern-native`, `kern-tokens` and `kern-icons` import no
   behavior primitive (Base UI, Radix, React Aria), and `packages/kern` imports
   no `@xoroh/kern-native`.
2. **The contract's counts match reality** — re-derived from the generated
   registry (`packages/mcp/src/manifest.ts`) using the concept rule, and compared
   to the `gate:counts` line in the doc.
3. **No phantom rows** — every component named in the contract exists in the
   registry, so a row cannot dispatch work against a component that is not there.
4. **Ruled asymmetries stay declared** — `sonner`, `create-sonner-manager`, `kbd`
   and `native-select` are deliberate per D-026 / S1.3; dropping them silently
   would re-open settled rulings.

Three canaries (`segmented-button`, `command`, `snackbar`) assert the concept
rule itself. They exist because the rule regressed twice while this gate was
being written: stripping `-button` blindly made `segmented-button` look web-only
— a component shipping on both sides — and a later attempt to rescue it invented
a `filter-chip` concept that exists nowhere. Both failures were silent. A canary
that names the cause beats a wrong number.

Fixes to the contract this gate found on its first run: `menu-group` → 
`menu-group-list`, `filter-chip` row removed (duplicate of the existing
`filter-chip-row` row), `boot` → `boot-indicator`. All three named components that
did not exist under those names.

Wired into CI next to `check:kern`. No runtime change.