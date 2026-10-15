---
"@xoroh/kern-native": minor
---

Native `Combobox`: flat type-to-filter single choice (`options`, `value`/`defaultValue`/`onValueChange`, `onSelect`, `open`/`defaultOpen`/`onOpenChange`, local `filter` + `defaultComboboxFilter`). Read-only field trigger, inline centred `Modal` popup over the Kern scrim with filter field + option list + empty state (the compound `Popover` stays the anchored non-modal surface — its dismiss-pressable wrap would swallow filter taps, recorded in `combobox.tsx`). Shared concept with web; `platform-parity.md` gap list updated (web-only 16 → 14).
