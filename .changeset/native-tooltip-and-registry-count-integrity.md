---
"@xoroh/kern": patch
"@xoroh/kern-native": minor
"@xoroh/kern-mcp": patch
---

Native M3 Tooltip, and a count-integrity defect in the component registry that
made every previously-quoted parity count wrong (P2b-3 tranche 4, `kern-lead`).

**The registry was missing three components, not one.** The generator collected
candidates only from `export function X` and `export const X = {`, so three
barrel-exported components matched neither and received **no registry row at
all**:

| Component | Shape | Row before |
|---|---|---|
| `ExtendedFab` (native) | `export const ExtendedFab = forwardRef<…>` | missing |
| `ErrorBoundary` (native) | `export class ErrorBoundary extends Component` | missing |
| `FieldRoot` (native) | `export { Root as FieldRoot }` | missing |

All three are exported from the package entry and consumable. `ExtendedFab`
shipped in tranche 2 and its commit message asserted the registry row had moved;
it had not.

This stayed invisible because the generator is deterministic — "re-run and the
file is byte-identical" proves *stability*, not *completeness*, and every gate
read the same incomplete registry. `generate-manifest.mjs` now matches all five
export shapes and **fails loudly** when a barrel export produces no candidate,
because "this component does not exist" and "this component exists and the
generator cannot see it" are distinguishable at that point and a registry must
never conflate them. Removing the `forwardRef` scanner now aborts the generator
by name.

Corrected counts (`check:parity`, from the generated registry):

| | before | after |
|---|---|---|
| registry rows | 330 | **334** |
| shared | 53 | **55** |
| native-only | 22 | **23** |
| web-only | 37 | **35** |

**`Tooltip` (native, new).** M3's plain Tooltip. `review-m3` ruled it a GAP
rather than a registerable deliberate asymmetry
(`.team/reports/reviews/m3/2026-10-01-tooltip-ruling.md`): M3 has a tooltip
concept and specifies it for the touch platform, so the "no touch analogue"
premise fails at the source, and D-026.1′ already recorded it MISSING.

What diverges is the **trigger**, and only that. M3's trigger is hover or focus;
touch has no hover, so the native side implements focus — which is M3-conformant
as written, since focus genuinely exists on RN (keyboard, switch, TV, screen
readers). The hint is carried in `accessibilityHint` on the trigger at all times,
not only while the surface is showing: a tooltip that existed only while focused
would put the text behind an interaction a touch user may never have, which is
M3's NC-3 negative. The surface is inert — no interactive role, ignores touches.

**No long-press or inline-hint gesture is implemented.** The touch affordance is
`design-system-lead`'s open ruling (D-026.1′ / SPECS-6); shipping a gesture
before that ruling would make the behaviour a kern invention consumers have to
discover. A regression test fails if a hover path is added.

New cross-renderer contract row `tooltip` (family `hint-surface`), with **both**
suites. The web suite was written from measuring the shipped component, and that
measurement constrained the row: Base UI's popup carries no `role` and the
trigger carries no `aria-describedby`, so neither is asserted — asserting the
missing link would be a red suite on day one, and asserting its absence would
bless the gap as the design. Both are recorded as web-side debt.

**Verified:** `check:parity` (334 rows, 55/23/35) · `typecheck` 5/5 ·
`check:kern` 45/45 roles + 8/8 elevation · `test:all` · `lint` byte-identical to
the `03e66ae` baseline (3 pre-existing findings, none from this change) ·
**10 mutations injected, 10 caught** (7 native tooltip behaviours, 2 web, 1
generator scanner), every file restored.