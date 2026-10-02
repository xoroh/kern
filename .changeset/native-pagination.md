---
"@xoroh/kern-native": minor
---

Add native `Pagination` — page navigation with a sliding window, ellipsis gaps,
and prev/next.

Verified as a real gap first: 12 behaviour lines in the web contract, no native
exported symbol.

## What it owns

- **Which page is current**, controlled or uncontrolled, 1-based. Every render
  derives the window from it, so there is exactly one source of truth.
- **Prev/next clamp at the ends** and are disabled there rather than wrapping. A
  pager that wraps from the last page to the first is a different component from
  the one M3 describes.
- **The window**: short lists show every page, long ones keep the first two, a
  window around the current page, and the last two, with inert gaps between.

## Two deliberate platform substitutions, recorded not hidden

- **RN has no `aria-current`.** Web marks the active page with
  `aria-current="page"`; native carries it in `accessibilityState.selected`, so a
  screen reader hears "selected" where the web says "current page". A real
  divergence in wording, not an oversight.
- **`role="navigation"`, not `accessibilityRole`.** RN's platform-trait
  `AccessibilityRole` union does not carry `navigation`; the ARIA-aligned `Role`
  union does. Same reasoning as `meter`, `fieldset`, `loading-indicator` and
  `drawer`.

## `pageWindow` is exported and tested directly

It is the only part of this component with real logic in it, so testing it
directly is both cheaper and clearer than asserting a windowing algorithm
through rendered output.

A note on a test I had to correct rather than "fix" the code around: I asserted
that pressing "Page 11" works from page 1 of 20 — and page 11 is not on screen at
page 1, because the window is 1, 2, …, 19, 20. The component was right. The test
now says so explicitly: `pageWindow` is a VIEW, and a page outside it is
genuinely absent.

The controlled `page` is also clamped defensively, so a host handing back 0 or
`count + 1` produces a real page rather than a broken window.

Verified: native jest 242/242 across 20 suites (17 new), typecheck PASS.