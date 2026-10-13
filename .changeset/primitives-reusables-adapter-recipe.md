---
"@xoroh/kern-primitives": patch
---

Document the react-native-reusables interop recipe ("Adapting
react-native-reusables"): the Slot / Presence / Portal / dismiss mapping
table and the one-recipe-scales note for Dialog, Menu, Popover and Tooltip.
Recipe only — no dependency either way, per D-031 (owning wins). The Slot +
Presence + Portal composition the recipe describes is live-verified by the
"Adapter composition" tests in `@xoroh/kern`'s `presentation.test.tsx`.
