---
"@xoroh/kern-native": minor
---

Add native `LoadingIndicator` — M3's indeterminate activity feedback, announced
as a **status** rather than a progressbar.

Buildable and worth building: the web contract this mirrors (`role="status"`,
mandatory accessible name, `aria-hidden` spinner, reduced-motion stops the
rotation rather than hiding the element, no `delay`/`showAfter`) is behaviour
the platform does not give for free, and native `Loader` had **none** of it —
just an `ActivityIndicator` with a label.

## Why `status`, and why it matters here

Existing native `CircularProgress` handles both cases and always announces
`accessibilityRole="progressbar"`. In its indeterminate case that announces a
bar with **no `now`** — claiming a quantity the component does not have, which
is the precise failure the web contract calls out. This publishes
`role="status"` with a **polite** live region and **no** `accessibilityValue`,
because "is this still happening" is a status question, not a measurement.

`CircularProgress` with a `value` remains the determinate case; the two answer
different questions.

## Details worth keeping

- **The ring is removed from the accessibility tree** (`accessibilityElementsHidden`
  + `no-hide-descendants`): it carries nothing the status region does not.
- **Reduced motion stops the rotation, never the element.** The ring stays
  rendered, and keeps a transparent border segment so a static ring still reads
  as incomplete rather than as a solid disc.
- **`aria-busy` deliberately left to the host.** The web puts it on the region
  being loaded; the indicator is a descendant, not an ancestor, and reaching
  outward to set it would be wrong.
- A visible `label` is not also used as the accessible name — that would
  duplicate it. Mirrors the web, which omits `aria-label` in exactly this case.

Verified: native jest **207/207** across 18 suites (11 new), typecheck PASS.