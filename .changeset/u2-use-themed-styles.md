---
"@xoroh/kern-native": patch
---

Add `useThemedStyles(factory)` (U2): run a hoisted style builder once per scheme identity and return the memoized result, so screens sharing one provider stop rebuilding style objects on every render.
