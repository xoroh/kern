---
"@xoroh/kern": patch
---

Utility-motion migration: the 25 hardcoded `ease-[cubic-bezier(0.2,0,0,1)]` classes across 22 web components now read `ease-(--md-sys-motion-easing-standard)`. Default rendering is byte-identical (the var resolves to the same curve); selecting the expressive motion scheme via `applyKernTheme(..., "expressive")` now retargets component easing instead of only the anchor vars. Durations untouched (schemes differ in easing only).
