---
"@xoroh/kern-native": patch
---

Tolerate a missing `AccessibilityInfo` export (U-K1). `sheet-surface` and `loading-indicator` read it through a getter-tolerant helper that no-ops when the API is absent, instead of touching the binding directly — bun 1.3.8 CJS interop drops the getter, which crashed mocks built by spreading the module. Device behaviour is unchanged.
