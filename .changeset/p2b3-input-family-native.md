---
"@xoroh/kern-native": minor
---

M3 input family, tranche 1 of the native-parity work (P2b-3): `Autocomplete`,
`InputOTP` and `NumberField` now ship natively.

These own behaviour rather than wrapping a primitive — React Native has no
autocomplete, OTP field or number field primitive to wrap, so unlike their web
counterparts (four thin pass-throughs over Base UI each) each one implements its
query/expansion, paste distribution and stepper arithmetic itself.

- **`Autocomplete`** — the query, the filtered set, the active suggestion, and
  both exits. Opens on a non-empty *matching* query only; closes on commit and on
  blur; announces an empty result instead of opening an empty box.
- **`InputOTP`** — one box per character, advancing as it fills, stepping back
  from an empty box, and distributing a paste from the pasted position.
- **`NumberField`** — the steppers, the clamp, and the value reported to the
  host. Both steppers announce themselves disabled at their bound.

`NumberField` and `InputOTP` carry cross-renderer parity contract rows, asserted
by both suites against the same declaration. `Autocomplete` deliberately does
**not**: web's popup has no working empty state (measured — it stays expanded
with zero options), so a shared row would either be red on day one or bless the
defect. The web fix is owed by P2b-4.