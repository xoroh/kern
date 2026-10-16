---
"@xoroh/kern-tokens": minor
---

Add `STATE_LAYER_OPACITIES`, the single source of truth for M3 state-layer
opacities (hover 8%, focus 12%, press 12%, drag 16%, disabled 38%).

Parsed from the canonical `tokens.json` `states` block, so docs and gates
can import the numbers instead of retyping them — the class of drift where
component pages taught focus/press 10% while the tokens ship 12% becomes
impossible. No token values change.
