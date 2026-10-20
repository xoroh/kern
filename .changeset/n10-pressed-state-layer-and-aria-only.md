---
"@xoroh/kern-native": minor
"@xoroh/kern-tokens": patch
---

N10, completed: the pressed state layer, the disabled content wash, and the
role/aria pass-through.

**The pressed state is a LAYER, not a dim.** Every pressable in
`@xoroh/kern-native` now paints a `StateLayer` overlay in its own on-colour at
the DTCG `states.press-opacity` (10%), driven by the pressed state the host
`Pressable` exposes. Before this, a press dimmed the control (0.82 / 0.9
opacity) — an invented affordance that M3 does not have. The opacity is read
from the token, never retyped, so a token change moves every control at once.

**The disabled wash is 38%, not 50%.** Every disabled opacity in the package
now reads `DISABLED_CONTENT_OPACITY` (the DTCG `states.disabled-opacity`,
38%) instead of a literal, and the states a component registers are carried
on the page as an explicit `states` list so the teaching half survives the
token table's move to the guidance corpus.

**`accessibilityState` is gone.** Every native control reports its state the
way the web does: `role` plus `aria-checked` / `aria-selected` /
`aria-expanded` / `aria-disabled` / `aria-busy`, with the explicit
`accessibilityRole` kept alongside `role` where the platform trait union
needs it. `grep -rn accessibilityState packages/kern-native/src` returns
nothing. This is the Axis-side ADR-112 direction applied to the Kern native
renderer, so both renderers speak one language.
