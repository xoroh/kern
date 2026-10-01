---
"@xoroh/kern-native": patch
---

`SheetSurface`: the close glyph is a prop, so the component stops reading
`tokens.typography` and becomes extraction-ready.

Finding 2 of the extraction order. The source file was already theme-free, but
its transitive closure was not: the close affordance rendered `<Text variant="title">×</Text>`,
and kern's `Text` reads `tokens.typography` for the type scale and font weight.

The default is an `×` inside the PLATFORM's own Text, not kern's. That matters
twice over: kern's Text would re-couple the file to the token engine, and a bare
string is not an option because React Native rejects a raw string inside a View
— which the Pressable is. The existing test caught that the moment it was tried.

**The closure is now 2 files and 0 token reads** (verified by walking it, not by
reading the one file). That is the property that matters: the `overlay-styles`
lesson was that a clean source file can still have a dirty dependency graph.

Better API, not merely a convenient one:

- A close button's appearance is the caller's business. A sheet wanting a real
  icon button, a themed label, or nothing can now say so.
- The hardcoded `×` was doing double duty as both the visual and the only
  rendering, so the accessible name came from `closeLabel` while the visible
  glyph was fixed. Those can now disagree, which is the caller's call.

`closeGlyph` defaults to `×`, so no existing call site changes what it renders.

Verified: native jest 157/157 across 13 suites, native typecheck PASS,
`check:primitives` PASS, closure check reports EXTRACTION-READY.

One note on the tests, because it cost four unrelated suites: an earlier version
of the new test called `unmount()` between two render passes, which tore down
shared harness state and broke Menu, ContextMenu, Select and Snackbar. Split
into two independent tests rather than worked around — the component change was
clean throughout, and the fault was mine in the test, not in the code.