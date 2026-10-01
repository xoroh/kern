---
"@xoroh/kern-mcp": patch
---

Regenerate the component inventory from the component sources.

`manifest.ts` and `component-sources.ts` are generated, not hand-maintained.
This picks up K-02's five new web components (`Banner`, `BannerAction`,
`Command*`, `CountrySelect*`, `SegmentedButton*`, `Sonner*`) and K-03's native
counterparts: 314 entries, 80 embedded component sources. `list_components`,
`get_component` and `design_audit` now see the components that actually exist.

Regeneration is idempotent -- re-running `generate:components` produces a
byte-identical `manifest.ts` and `docs/components.md`.