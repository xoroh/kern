---
"@xoroh/kern-mcp": patch
---

Fix the manifest generator's acronym handling: `input-otpinput` and
`input-otproot` are now `input-otp-input` and `input-otp-root`.

The slug rule only broke on a lower-or-digit followed by an uppercase, so it
could not see an acronym boundary. In `InputOTPRoot` the `R` is preceded by `P`
— both uppercase — so no split happened and the sub-part welded onto the concept
name. A second pass splits an acronym run from a following capitalised word
(`OTPRoot` → `OTP` + `Root`).

**Why this mattered:** those two malformed slugs were not merely ugly. They were
registry rows for components that do not exist, so they counted as web-only
concepts and inflated a gated parity number by exactly the two `review-m3`
suspected — the true web-only count is **33**, not the 35 the registry claimed.
Nothing failed at the time, which is why the contract document had been
hand-adjusted to "true web-only = 33"; that note is now obsolete and the machine
figure is the honest one.

**Scope:** five slugs change, the other 319 exports are untouched. Ordinary
PascalCase is unaffected (`SegmentedButton`, `TopAppBar`, `InputOTP` all hold).
`OTPBox`, `inputOTPStyles` and `toOTPPositions` gain the same correct splitting.

Verified: reverting only the second pass brings both phantom rows back and
flips the gate to web-only 35, which it then fails — so the defect was silent
before and is caught now. Regeneration is byte-identical on re-run.
`check:parity` PASS · `check:kern` PASS · `lint` PASS · `typecheck` PASS.
