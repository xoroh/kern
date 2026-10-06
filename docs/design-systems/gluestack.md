# Gluestack-UI v2 — part-by-part vs kern

**Identity:** NativeBase's successor: **copy-paste** components + patterns (shadcn-philosophy) for React/Next.js/RN, NativeWind/Tailwind styling, RSC-compatible, `npx gluestack-ui init` + CLI add. 30+ components.
**Sources:** gluestack.io/ui/docs (introduction, all-components); github.com/gluestack/gluestack-ui README.

## Parts: they-have / we-will-have
- 30+ (accordion, actionsheet, alert(+dialog), avatar, badge, bottomsheet, box, button, calendar, card, center, **chat-ai**, checkbox, date-time-picker, divider, drawer, fab, form-control, grid, heading, hstack, icon, image(+viewer), input, link, **liquid-glass**, menu, modal, popover, portal, pressable, progress, radio, select, skeleton, slider, spinner, switch, table, tabs, text(+area), toast, tooltip, vstack): Y / **B** for M3-overlapping (actionsheet/bottomsheet→sheets B; pressable B; form-control→field B); chat-ai, liquid-glass, image-viewer = **G** (note chat-ai: enterprise Chat component class from R10 — rented if ever).
- Copy-paste + CLI (`init`, add, own the code): Y-concept / kern blocks/registry (same philosophy; kern adds the parity contract + M3 strictness Gluestack doesn't claim).
- Universal consistency (one codebase web+native): Y-claim / kern's decided-divergence (renderer-split + contract, Tamagui file).
- Theming tokens + Tailwind/NativeWind: Y / kern-theme (M3 roles; Tailwind adapter exists).
- Non-goals stated (no magical imports): mirror the honesty — kern should state its own non-goals (no compiler, no MD2 mode).

## Patterns to carry
Copy-paste ownership rhetoric; `init` command shape; component+patterns (not just components) as the unit; stated non-goals.
