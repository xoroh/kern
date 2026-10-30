---
"@xoroh/kern-tokens": patch
---

`assertCompleteScheme` accepts an optional tenant base id for its completeness probe (defaults to `material-3`). Whitelabel tenants extending another system can now guard their own role space instead of asserting against M3 by assumption.
