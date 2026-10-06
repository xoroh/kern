# Tamagui — part-by-part vs kern

**Identity:** universal (React Native + web) styled system: typed tokens (`$` prefix), nestable themes, optimizing compiler (atomic CSS on web, flattened RN styles), component kit (Button, Sheet, Dialog, Popover, Select, Tabs, Accordion, ToggleGroup, Toast, Tooltip).
**Sources:** tamagui.dev/docs (configuration, themes, design-systems guide, v2 blog); reactnative.codeguides.io.

## Parts: they-have / we-will-have
- Universal primitives (Stack/Text/View styled, Button, Paragraph): Y-concept / kern keeps renderer-split packages (web Base UI + native own) with parity contract instead of one universal runtime — different architecture, same goal. Record as decided-divergence.
- Overlays (Dialog, AlertDialog, Sheet, Popover, Tooltip, Toast, Select): Y / **B** (dialog, alert-dialog, sheets, popover, tooltip, snackbar, select). Tamagui's `Adapt` (Dialog↔Sheet by platform) + `scope` prop (root-mounted portal, triggers anywhere) are worth studying for kern's overlay family.
- Tabs / Accordion / ToggleGroup (compound): Y / **B**.
- Tokens (`tamagui.config.ts`: size/space/radius/color; `$` access; tokens-as-fallback, themes-override): Y-concept / kern-theme (M3 roles; steal the tokens-fallback mental model for docs).
- Theme nesting (`parent_sub` names, upward resolution to tokens): Y-concept / kern scheme hook resolves per-renderer; nesting = G unless a use case lands.
- Compiler (style extraction, tree flattening, no re-render theme change): – for kern (no compiler track; runtime tokens + CSS vars) — record as non-goal unless perf demands.
- Animations (3 drivers: CSS/Motion/Reanimated): P / motion tokens + per-renderer drivers = G for unified story.

## Patterns to carry
`$`-token mental model for docs; `Adapt` platform-switching for overlays; `scope` root-mount pattern; component themes keyed by component name.
