---
"@xoroh/kern-native": minor
---

Native `Switch` and `Checkbox` use Base UI state names: `checked` /
`defaultChecked` / `onCheckedChange` instead of `value` / `defaultValue` /
`onValueChange`.

Per the API-consistency discipline (api-consistency.md §0), binary state
follows Base UI names — `checked` for Checkbox/Switch on both renderers —
while `value` stays for value-like components. Pre-1.0 rename, no aliases
kept. Docs pages, gallery, and parity harness updated in the same change.
