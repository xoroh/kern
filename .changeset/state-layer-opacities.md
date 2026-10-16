---
"@xoroh/kern-tokens": minor
---

Add `STATE_LAYER_OPACITIES`, the single source of truth for M3 state-layer
opacities (hover 8%, focus 10%, press 10%, drag 16%, disabled 38%).

Parsed from the canonical `tokens.json` `states` block, so docs and gates
can import the numbers instead of retyping them — the class of drift where
component pages taught focus/press 12% while the tokens ship 10% becomes
impossible. Token values move focus/press 12% → 10% per the live M3 spec
(material-web v0.192 still ships 12% — stale).
