---
"@xoroh/kern-mcp": patch
---

Regenerate the component inventory and reconcile the parity contract prose.

The registry was **already current** — `generate:components` produced zero diff
in `manifest.ts` and `docs/components.md`, because the counts moved in `92b42e7`
and the generator was re-run there. So this commit is not a regen of stale
output; it is the reconciliation the stale prose needed, plus the one generated
input that was still uncommitted.

**Landed:** `packages/mcp/src/component-sources.ts` — the variant-audit's
`fabStyles(variant, "default", scheme)` → `fabStyles("default", scheme)` signature
fix, which was left dirty in the shared tree on purpose while `design-system-lead`
worked. The generated outputs are derived from it, so it has to land with them or
the next regen reintroduces the wrong call.

**Reconciled in `docs/parity-contract.md`:**

- Rows `drawer`, `popover` and `scroll-area` read "to build" after P2b-3 tranche 5
  shipped them. Now marked shipped with their real native contract and test
  pointer, so the table no longer contradicts the code.
- Recorded `review-m3`'s note on the two phantom `input-otp` part-names, verified
  against the registry: `input-otp` appears **twice** (web at line 749, native at
  1911), which makes it shared, and `input-otpinput` / `input-otproot` are
  malformed names from the generator's camel→kebab transform losing the hyphen
  before a repeated capital. They inflate the web-only heading by exactly 2, so a
  reader should subtract two from the gate's 35. **Stated as prose, not as a
  second number** — the gate reads any bare figure in that section as a live
  claim, and failed this commit's first draft for exactly that reason.

**Counts (from the gate, not from the prose):** registry 334 rows (web 248,
native 86) → **55 shared · 23 native-only · 35 web-only · 0 stubs**. 5 ruled
deliberate asymmetries.

Verified: `check:parity` PASS · `check:m3` PASS · `bun run lint` PASS (0 errors,
full repo, now that `2652367` cleared the residue) · `typecheck` PASS (all 5) ·
`@xoroh/kern` test PASS (web + cross-renderer parity) · `test:jest` PASS ·
native vitest PASS.

**Idempotence proven, not assumed:** `generate:components` run twice with
`md5sum -c` on both outputs → `manifest.ts: OK`, `docs/components.md: OK`. This is
the property whose absence caused the S4 lint blocker, so it is checked rather
than trusted.

**Follow-up filed, not fixed here:** the generator's camel→kebab defect that
produces `input-otpinput` / `input-otproot`. Fixing it moves a gated count, and a
count moving under a gate edit is precisely what the two-line `gate:counts`
assertion exists to catch — so it wants its own commit, not a drive-by.
