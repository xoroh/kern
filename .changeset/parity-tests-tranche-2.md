---
"@xoroh/kern": patch
"@xoroh/kern-native": patch
---

Cross-renderer behaviour parity, tranche 2: chips, lists, dialogs, text fields.

Extends the P2b-4 parity contract (`kern/parity/contract.ts`) with six rows —
`chip` (filter + assist), `list-item`, `dialog`, `input`, `textarea` — and adds a
matching suite on each renderer. The contract file stays data-only and imports
neither package, so ADR 002's boundary is untouched; the components still never
meet.

**Rows were written from measurement, not from the props each component
appears to take.** Every candidate was probed on both renderers first, which is
why the tranche asserts less than it might have. Five divergences were found and
deliberately NOT encoded as contract rows, because writing them would have meant
either landing a red suite or pinning one renderer's API shape as if it were the
contract. They are filed in
`.team/findings/2026-10-01-p2b4-tranche2-measured-divergences.md` and need a
design ruling:

- `list-item`: web exposes no interactive variant at all and stays `listitem`
  even when a host attaches `onClick`; native becomes `role="button"` on
  `onPress`.
- `dialog`: web sets no `aria-modal` (the same one-attribute gap the P2b-2
  changeset closed for `NavigationDrawer`), and native's card carries
  `accessibilityRole="none"` rather than `dialog`.
- native `Input`/`Textarea` set no `accessibilityRole`.
- `errorMessage` is a native `Input` prop with no web counterpart, so the web
  message has to come from a sibling `FieldMessage`.

Two contract-level changes came out of the work. `ParityRow` gained an optional
`family` discriminant, because a boolean checked/pressed axis is the wrong shape
for a name-bearing surface or a text field and forcing one would have meant
inventing a fake state neither renderer has. `contractFor` gained an optional
`variant` argument, because `chip` now has two rows and resolving by array
position would silently re-point call sites the next time a row is inserted.

Every assertion was mutation-proven — each was checked to FAIL against an
injected regression, and two were rewritten after the mutation proved them
decorative: the web `list-item` assertion originally read `textContent`, which
still contains `aria-hidden` subtrees and so passed a mutation that hid the
supporting line from assistive tech; it now asserts the line stays in the
accessibility tree. An ARIA `listitem` also does not derive its name from
content (verified), so the web row asserts rendered-and-announced text rather
than an accessible name that does not exist there.

No behaviour change in either package: 10 web tests and 11 native tests, all new.