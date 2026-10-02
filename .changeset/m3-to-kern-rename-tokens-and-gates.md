---
"@xoroh/kern-tokens": minor
---

M3 → kern rename across the tokens and gate layer (founder directive, board.md 2026-10-02).

**Files renamed**
- `src/m3-elevation.ts` → `src/kern-elevation.ts`
- `src/m3-roles.ts` → `src/kern-roles.ts`
- `src/themes/m3.json` → `src/themes/kern.json`
- `scripts/check-m3.mjs` → `scripts/check-kern.mjs`
- `bun run check:m3` → `bun run check:kern` (root `package.json`, `ci.yml`, PR template)

**Identifiers**
- `M3_ELEVATION_COMPONENTS` → `KERN_ELEVATION_COMPONENTS`
- `M3_RESTING_ELEVATION` → `KERN_RESTING_ELEVATION`

**Theme id `"m3"` → `"kern"`, with `"m3"` kept as an accepted legacy alias.**
`ThemeId` is exported public API and `extends?: "m3"` appears in the `CustomTheme` type, so a
bare rename would silently break every published consumer. `canonical()` maps `"m3" → "kern"`
before any lookup, so both ids resolve.

### What deliberately did NOT change

Per the directive's rule, "M3" survives wherever it is a genuine reference to the Google Material 3
specification — not a name of ours:

- `M3_ROLES` — the 45 roles M3 defines. Renaming it collided with a pre-existing `KERN_ROLES`
  (kern's own 13 deviations), which is a real hazard worth recording.
- `--md-sys-*` — M3's own token namespace, present in 485 generated CSS references.
- Prose citing the spec: *"M3 defines levels 0-5"*, `m3.material.io` URLs, the 18 space tokens.

The gate's own output is now `kern contract passes` (our gate), while still reporting
`45/45 M3 roles` (the spec). Those are different claims and now read differently.

### A live bug this surfaced

`auditRoleInventory` compared roles against `KERN_ROLES` for **both** the M3 set and the kern set —
a rename collision briefly made it compare the 13 deviations against themselves, reporting all 45
M3 roles as unregistered. Caught by running the gate, not by reading the diff. Fixed with two
distinct locals (`m3Roles` / `kernRoles`) and a comment explaining why the names must not merge.

Verified unchanged by the rename: **45/45 M3 roles (+13 kern deviations) · 18 spacing ·
elevation 0-5 · resting elevation 19/19 · shape 10 · motion standard/expressive** ·
`check:contrast` 1242 checks / 0 orphans · `check:parity` passes · `check:generated` fresh ·
typecheck 4/4 · 429 tests · build green for `kern-tokens`, `kern`, `kern-primitives`, `kern-icons`.
