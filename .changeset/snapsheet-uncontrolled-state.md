---
"@xoroh/kern": patch
---

Fix uncontrolled `SnapSheet`: the detent no longer freezes at first render.

The detent was `valueProp ?? defaultValue` with no internal state, so without
a controlled `value` every interaction fired `onValueChange` but the handle
never moved. State now lives in `useControllableState` from `@xoroh/axis`
(the same hook `FilterChipRow` uses), clamped to the detent range on read
and on write. Controlled behavior is unchanged.
