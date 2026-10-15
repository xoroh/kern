---
"@xoroh/kern": minor
"@xoroh/kern-native": minor
---

M3 dial (clock-face) presentation for TimePicker, both renderers. `presentation?: "listbox" | "dial"` (default `"listbox"`, back-compatible) + `TimePickerPresentation` / `NativeTimePickerPresentation` types. 256dp face, outer/inner 24h rings, 5-minute labelling on dense minute faces, press-advances-to-minutes on touch, keyboard parity on web. Value contract unchanged (24h internal, normalized reporting, step/format honored). Native dial renders on `react-native-svg` (new runtime dependency, externalized from the build, headless doubles for jest/vitest).
