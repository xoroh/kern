---
"@xoroh/kern": minor
---

Web fixes for the three tranche-2 behaviour divergences ruled in
`.team/reports/reviews/m3/2026-10-01-p2b4-tranche2-divergence-rulings.md`
(M3 compliance review). All three were FAIL-as-shipped contract violations:
behaviour that existed on one renderer and not the other, or semantics a
sighted user got and a screen-reader user did not. The fourth divergence (the
native dialog's `accessibilityRole`) is `kern-lead`'s and is not touched here.

**1. `Dialog` and `AlertDialog` now announce that they are modal.**

Base UI's `Popup` traps focus and inerts the rest of the page but emits no
`aria-modal`, so a modal dialog was announced as a plain group with no
indication that the rest of the page is unreachable. `NavigationDrawer`
already had to set the attribute by hand for exactly this reason
(`navigation-drawer.tsx`); `dialog.tsx` and `alert-dialog.tsx` had the
identical gap and now set it too. One attribute each, no behaviour change.

**2. `ListItem` grows an interactive variant.**

`ListItem` was display-only, but nothing stopped a host passing `onClick`
through `...props` — producing a row that looked clickable, announced as a
plain `listitem`, and was not focusable or keyboard-operable at all. Native
already had this right (`onPress` ⇒ `accessibilityRole="button"`), so web
grew the variant rather than native demoting:

- `onPress` renders a real `<button>` — `role="button"`, in the tab order,
  activated by Enter **and** Space, natively `disabled`.
- `href` renders a real `<a>` — `role="link"`, with the destination exposed.
  `href` wins when both are passed and the handler still runs.
- A static row now states `role="listitem"` explicitly instead of relying on
  the `<li>` default, so the static/interactive role split is a testable
  property rather than an accident that a `<div>` swap would pass.
- The wrapper `<li>` is `role="none"` in the interactive case, so assistive
  tech lands on the control instead of announcing "list item, button" — the
  same sentence twice.

Additive: existing `<ListItem headline … />` call sites are unchanged.

**3. `Input` accepts `errorMessage?: string`.**

The prop existed on native `Input` and not on web, so the same host code was a
type error on one renderer. Native's shape is the correct one and is
unchanged — RN has no `accessibilityState.invalid`, so deleting the prop there
would drop the only announced error text. On web, `errorMessage` now:

- **implies** `error`, so `aria-invalid` fires without passing both;
- renders as `FieldMessage variant="error"`, already `role="alert"`;
- is wired to the field via `aria-describedby`, so the text is read on focus
  rather than floating on the page. A host's own `aria-describedby` is
  appended to, not overwritten — it is a space-separated list.

`Input` now returns a fragment when an error message is present. It is a
single element otherwise, so the common case is unaffected.

Verification: 11 new behaviour tests across `web-parity-tranche2.test.tsx` and
`overlays.test.tsx`, driven by new rows in `parity/contract.ts`
(`modal`, `interactive`/`interactiveRole`, `errorMessageCarriesText`) so the
obligations are declared once and asserted per renderer. 11 injected
mutations, 11 caught. `check:parity` counts unchanged — no registry row added
or removed.
